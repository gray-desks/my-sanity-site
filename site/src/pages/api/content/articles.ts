import type { APIRoute } from 'astro'
import { writeClient as sanityClient } from '../../../lib/sanity'

export const GET: APIRoute = async ({ url }) => {
  try {
    const type = url.searchParams.get('type') || 'drafts'
    
    // For now, return empty array since we're using Sanity Studio for article management
    return new Response(JSON.stringify({ articles: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch articles' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const POST: APIRoute = async ({ request }) => {
  // Helper to slugify Japanese/Unicode titles into URL-friendly strings
  const generateSlug = (str: string): string => {
    const slug = str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-') // spaces to dash
      // remove all chars except letters, numbers and dashes (unicode aware)
      .replace(/[^\p{Letter}\p{Number}-]+/gu, '')
      .replace(/--+/g, '-') // collapse multiple dashes
      .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
    return slug || `article-${Date.now()}`;
  };

  console.log('POST request received');
  console.log('Environment variables check:');
  console.log('- SANITY_WRITE_TOKEN exists:', !!import.meta.env.SANITY_WRITE_TOKEN);
  console.log('- Process env SANITY_WRITE_TOKEN exists:', !!process.env.SANITY_WRITE_TOKEN);
  console.log('- Sanity client token configured:', !!sanityClient.config().token);
  
  try {
    // Check if Sanity write token is configured
    if (!sanityClient.config().token) {
      console.error('Sanity write token is not configured');
      return new Response(JSON.stringify({ 
        error: 'サーバー設定エラー',
        details: 'Sanity書き込みトークンが設定されていません。環境変数SANITY_WRITE_TOKENを設定してください。',
        code: 'MISSING_SANITY_WRITE_TOKEN'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const articleData = await request.json();
    console.log('Parsed article data:', articleData);
    
    // Validate required fields
    const { title, type, prefecture, content, lang = 'ja' } = articleData;
    
    if (!title || !type || !prefecture || !content) {
      return new Response(JSON.stringify({ 
        error: 'Required fields missing: title, type, prefecture, content' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate type enum
    const validTypes = ['spot', 'food', 'transport', 'hotel', 'note'];
    if (!validTypes.includes(type)) {
      return new Response(JSON.stringify({ 
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate slug
    const slug = generateSlug(title);

    // Build content: if already Portable Text blocks array, use as-is; otherwise wrap string
    let contentBlocks: any;
    if (Array.isArray(content)) {
      contentBlocks = content;
    } else {
      contentBlocks = [
        {
          _type: 'block',
          _key: Math.random().toString(36).slice(2, 10),
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: Math.random().toString(36).slice(2, 10),
              text: content,
              marks: []
            }
          ]
        }
      ];
    }

    // Create Sanity document
    const sanityDoc: any = {
      slug: {
        _type: 'slug',
        current: slug
      },
      _type: 'article',
      title,
      type,
      prefecture,
      lang,
      content: contentBlocks,
      publishedAt: articleData.publishedAt || new Date().toISOString(),
    };
    
    // Add optional fields
    if (articleData.tags && Array.isArray(articleData.tags)) {
      sanityDoc.tags = articleData.tags;
    }
    
    if (articleData.placeName) {
      sanityDoc.placeName = articleData.placeName;
    }
    
    if (articleData.location && articleData.location.lat && articleData.location.lng) {
      sanityDoc.location = {
        _type: 'geopoint',
        lat: parseFloat(articleData.location.lat),
        lng: parseFloat(articleData.location.lng)
      };
    }
    
    console.log('Creating Sanity document:', sanityDoc);
    
    console.log('Creating Sanity document:', sanityDoc);
    console.log('Using Sanity token:', sanityClient.config().token ? '***configured***' : 'NOT SET');
    
    // Create document in Sanity
    const result = await sanityClient.create(sanityDoc as any);
    
    console.log('Sanity creation result:', result);
    
    return new Response(JSON.stringify({ 
      success: true,
      id: result._id,
      data: {
        title,
        type,
        prefecture,
        lang,
        sanityId: result._id
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Error creating article:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    
    // Parse different types of Sanity errors
    let errorMessage = '記事の作成に失敗しました';
    let errorDetails = error.message || error.toString();
    let errorCode = 'UNKNOWN_ERROR';
    let statusCode = 500;
    
    if (error.message) {
      if (error.message.includes('No token')) {
        errorMessage = 'Sanity認証エラー';
        errorDetails = 'Sanity書き込みトークンが設定されていないか無効です。環境変数を確認してください。';
        errorCode = 'SANITY_AUTH_ERROR';
        statusCode = 401;
      } else if (error.message.includes('Unauthorized')) {
        errorMessage = 'Sanity認証エラー';
        errorDetails = 'Sanityトークンが無効または権限不足です。';
        errorCode = 'SANITY_UNAUTHORIZED';
        statusCode = 401;
      } else if (error.message.includes('validation')) {
        errorMessage = 'データ検証エラー';
        errorDetails = 'スキーマ検証に失敗しました: ' + error.message;
        errorCode = 'VALIDATION_ERROR';
        statusCode = 400;
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'ネットワークエラー';
        errorDetails = 'Sanity APIへの接続に失敗しました。';
        errorCode = 'NETWORK_ERROR';
        statusCode = 503;
      }
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: errorDetails,
      code: errorCode,
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}