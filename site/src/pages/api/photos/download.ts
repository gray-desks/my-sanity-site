import type { APIRoute } from 'astro'
import { downloadPhotosFromAlbum } from '../../../lib/google-photos'
import axios from 'axios'
import sharp from 'sharp'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export const prerender = false

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check for OAuth2 tokens in cookies
    const tokensCookie = cookies.get('google_tokens')?.value
    if (!tokensCookie) {
      return new Response(JSON.stringify({ 
        error: 'Authentication required. Please login with Google first.',
        code: 'AUTHENTICATION_REQUIRED'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let tokens
    try {
      tokens = JSON.parse(tokensCookie)
    } catch (parseError) {
      return new Response(JSON.stringify({ 
        error: 'Invalid authentication tokens. Please login again.',
        code: 'INVALID_TOKENS'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { maxPhotos = 20, albumId } = await request.json()

    // Use specific album ID from env or provided albumId
    const targetAlbumId = albumId || import.meta.env.GOOGLE_PHOTOS_ALBUM_ID

    if (!targetAlbumId) {
      return new Response(JSON.stringify({ 
        error: 'No album ID specified. Please set GOOGLE_PHOTOS_ALBUM_ID in environment variables.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get photos from specific album with OAuth2 tokens
    const photoUrls = await downloadPhotosFromAlbum({
      albumId: targetAlbumId,
      maxPhotos,
      imageSize: 'large',
      tokens
    })

    const downloadResults = []

    // コンテンツディレクトリを確認・作成
    const contentDir = join(process.cwd(), '..', 'content')
    const imagesDir = join(contentDir, 'images')
    const rawDir = join(imagesDir, 'raw')
    const optimizedDir = join(imagesDir, 'optimized')
    const thumbnailsDir = join(imagesDir, 'thumbnails')

    for (const dir of [contentDir, imagesDir, rawDir, optimizedDir, thumbnailsDir]) {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }
    }

    for (const [index, photo] of photoUrls.entries()) {
      try {
        const response = await axios.get(photo.downloadUrl, { responseType: 'arraybuffer' })
        
        const timestamp = new Date().toISOString().split('T')[0]
        const filename = photo.filename || `${timestamp}_photo_${index + 1}.jpg`
        
        // オリジナル画像を保存
        const rawPath = join(rawDir, filename)
        writeFileSync(rawPath, response.data)
        
        // 最適化された画像を生成
        const optimizedPath = join(optimizedDir, filename)
        await sharp(response.data)
          .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true })
          .toFile(optimizedPath)
        
        // サムネイルを生成
        const thumbnailPath = join(thumbnailsDir, `thumb_${filename}`)
        await sharp(response.data)
          .resize(300, 200, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toFile(thumbnailPath)

        downloadResults.push({
          filename,
          originalSize: response.data.length,
          success: true
        })

      } catch (error) {
        console.error(`Error downloading image ${index}:`, error)
        downloadResults.push({
          index,
          success: false,
          error: error.message
        })
      }
    }

    return new Response(JSON.stringify({
      success: true,
      downloaded: downloadResults.length,
      results: downloadResults
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error downloading photos:', error)
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return new Response(JSON.stringify({ 
      error: 'Failed to download photos',
      details: errorMessage,
      success: false
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}