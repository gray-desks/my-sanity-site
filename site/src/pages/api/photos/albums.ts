import type { APIRoute } from 'astro'
import { google } from 'googleapis'

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const tokens = cookies.get('google_tokens')?.value
    
    if (!tokens) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const oauth2Client = new google.auth.OAuth2(
      import.meta.env.GOOGLE_CLIENT_ID,
      import.meta.env.GOOGLE_CLIENT_SECRET,
      import.meta.env.GOOGLE_REDIRECT_URI
    )

    oauth2Client.setCredentials(JSON.parse(tokens))

    // Google Photos Library APIを使用
    const photosLibrary = google.photoslibrary({ version: 'v1', auth: oauth2Client })
    
    const response = await photosLibrary.albums.list({
      pageSize: 50
    })

    const albums = response.data.albums || []
    
    return new Response(JSON.stringify({ 
      albums: albums.map(album => ({
        id: album.id,
        title: album.title,
        productUrl: album.productUrl,
        mediaItemsCount: album.mediaItemsCount,
        coverPhotoBaseUrl: album.coverPhotoBaseUrl
      }))
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error fetching albums:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch albums' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}