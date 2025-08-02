import type { APIRoute } from 'astro'
import { listAlbums } from '../../../lib/google-photos-rest'

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const tokens = cookies.get('google_tokens')?.value
    
    if (!tokens) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Decode URI-encoded cookie value
    let tokenObj
    try {
      tokenObj = JSON.parse(decodeURIComponent(tokens))
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid authentication tokens' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    // Use REST helper to list albums
    const albums = await listAlbums(tokenObj)
    
    return new Response(JSON.stringify({ albums }), {
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