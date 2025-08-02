import type { APIRoute } from 'astro'
import { fetchAlbum, fetchAlbumMediaItems } from '../../../lib/google-photos-rest'

export const GET: APIRoute = async ({ url, cookies }) => {
  try {
    const albumId = url.searchParams.get('albumId') || import.meta.env.GOOGLE_PHOTOS_ALBUM_ID

    if (!albumId) {
      return new Response(JSON.stringify({ 
        error: 'No album ID provided. Add ?albumId=YOUR_ALBUM_ID or set GOOGLE_PHOTOS_ALBUM_ID environment variable.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const tokensCookie = cookies.get('google_tokens')?.value
    if (!tokensCookie) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }
    let tokenObj
    try { tokenObj = JSON.parse(decodeURIComponent(tokensCookie)) } catch { return new Response(JSON.stringify({ error: 'Invalid tokens' }), { status: 401, headers: { 'Content-Type': 'application/json' } }) }

    // Use REST client functions
    const album = await fetchAlbum(albumId, tokenObj)
    const mediaItems = await fetchAlbumMediaItems(albumId, 5, tokenObj)

    return new Response(JSON.stringify({
      album: {
        id: album.id,
        title: album.title,
        productUrl: album.productUrl,
        mediaItemsCount: album.mediaItemsCount,
        coverPhotoBaseUrl: album.coverPhotoBaseUrl
      },
      mediaItems: mediaItems.map(item => ({
        id: item.id,
        filename: item.filename,
        mimeType: item.mimeType,
        baseUrl: item.baseUrl,
        creationTime: item.mediaMetadata?.creationTime
      })),
      success: true,
      message: 'Album access test successful'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Album test error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to access album. Check album ID and API permissions.',
      albumId: url.searchParams.get('albumId') || import.meta.env.GOOGLE_PHOTOS_ALBUM_ID
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}