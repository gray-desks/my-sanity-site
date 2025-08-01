import type { APIRoute } from 'astro'
import { readdirSync, existsSync, statSync } from 'fs'
import { join } from 'path'

const CONTENT_DIR = join(process.cwd(), '..', 'content')
const IMAGES_DIR = join(CONTENT_DIR, 'images')

export const GET: APIRoute = async ({ url }) => {
  try {
    const type = url.searchParams.get('type') || 'optimized' // raw, optimized, thumbnails
    const dir = join(IMAGES_DIR, type)
    
    if (!existsSync(dir)) {
      return new Response(JSON.stringify({ images: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const files = readdirSync(dir)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => {
        const filePath = join(dir, file)
        const stats = statSync(filePath)
        
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime.toISOString(),
          modified: stats.mtime.toISOString(),
          url: `/content/images/${type}/${file}` // This would need to be served statically
        }
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    
    return new Response(JSON.stringify({ images: files }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error fetching images:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch images' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}