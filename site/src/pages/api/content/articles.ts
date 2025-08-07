import type { APIRoute } from 'astro'
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const CONTENT_DIR = join(process.cwd(), '..', 'content')
const DRAFTS_DIR = join(CONTENT_DIR, 'drafts')
const PUBLISHED_DIR = join(CONTENT_DIR, 'published')

// Ensure directories exist
for (const dir of [CONTENT_DIR, DRAFTS_DIR, PUBLISHED_DIR]) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const type = url.searchParams.get('type') || 'drafts'
    const dir = type === 'published' ? PUBLISHED_DIR : DRAFTS_DIR
    
    const files = readdirSync(dir)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = join(dir, file)
        const content = readFileSync(filePath, 'utf-8')
        const [, frontmatter, body] = content.split('---\n')
        
        let metadata = {}
        try {
          // Simple frontmatter parsing
          frontmatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(': ')
            if (key && valueParts.length > 0) {
              metadata[key.trim()] = valueParts.join(': ').trim()
            }
          })
        } catch (error) {
          console.error('Error parsing frontmatter:', error)
        }
        
        return {
          filename: file,
          title: metadata['title'] || file.replace('.md', ''),
          type: metadata['type'] || 'note',
          lang: metadata['lang'] || 'ja',
          created: metadata['created'] || new Date().toISOString(),
          status: type,
          bodyPreview: body ? body.slice(0, 200) + '...' : ''
        }
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    
    return new Response(JSON.stringify({ articles: files }), {
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
  try {
    const articleData = await request.json()
    
    // Validate required fields
    const { title, type, prefecture, content, lang = 'ja' } = articleData
    
    if (!title || !type || !prefecture || !content) {
      return new Response(JSON.stringify({ 
        error: 'Required fields missing: title, type, prefecture, content' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Validate type enum
    const validTypes = ['spot', 'food', 'transport', 'hotel', 'note']
    if (!validTypes.includes(type)) {
      return new Response(JSON.stringify({ 
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const timestamp = new Date().toISOString().split('T')[0]
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const filename = `${timestamp}_${sanitizedTitle}.md`
    const filePath = join(DRAFTS_DIR, filename)
    
    // Build frontmatter with all fields
    let frontmatterLines = [
      '---',
      `title: ${title}`,
      `type: ${type}`,
      `prefecture: ${prefecture}`,
      `lang: ${lang}`,
      `publishedAt: ${articleData.publishedAt || new Date().toISOString()}`,
      `created: ${new Date().toISOString()}`
    ]
    
    // Add optional fields if they exist
    if (articleData.tags && Array.isArray(articleData.tags) && articleData.tags.length > 0) {
      frontmatterLines.push(`tags: [${articleData.tags.map(tag => `"${tag}"`).join(', ')}]`)
    }
    
    if (articleData.placeName) {
      frontmatterLines.push(`placeName: ${articleData.placeName}`)
    }
    
    if (articleData.location && articleData.location.lat && articleData.location.lng) {
      frontmatterLines.push(`location:`)
      frontmatterLines.push(`  lat: ${articleData.location.lat}`)
      frontmatterLines.push(`  lng: ${articleData.location.lng}`)
    }
    
    frontmatterLines.push('---', '', '')
    
    const frontmatter = frontmatterLines.join('\n')
    const fullContent = frontmatter + content
    
    writeFileSync(filePath, fullContent, 'utf-8')
    
    return new Response(JSON.stringify({ 
      success: true, 
      filename,
      message: 'Article created successfully',
      data: {
        title,
        type,
        prefecture,
        lang,
        filename
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error creating article:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to create article',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}