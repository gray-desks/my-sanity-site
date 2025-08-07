import type { APIRoute } from 'astro'
import { sanityClient } from '../../lib/sanity'

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
  console.log('POST request received');
  
  try {
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
    
    // Create Sanity document
    const sanityDoc = {
      _type: 'article',
      title,
      type,
      prefecture,
      lang,
      content: [
        {
          _type: 'block',
          _key: 'content',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span',
              text: content,
              marks: []
            }
          ]
        }
      ],
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
    
    // Create document in Sanity
    const result = await sanityClient.create(sanityDoc);
    
    console.log('Sanity creation result:', result);
    
    return new Response(JSON.stringify({ 
      success: true,
      id: result._id,
      message: 'Article created successfully in Sanity',
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
    
  } catch (error) {
    console.error('Error creating article:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create article',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}