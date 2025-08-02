import type { APIRoute } from 'astro'
import { google } from 'googleapis'

export const prerender = false

export const GET: APIRoute = async ({ redirect }) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      import.meta.env.GOOGLE_CLIENT_ID,
      import.meta.env.GOOGLE_CLIENT_SECRET,
      import.meta.env.GOOGLE_REDIRECT_URI
    )

    const scopes = [
      'https://www.googleapis.com/auth/photoslibrary.readonly'
    ]

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    })

    return redirect(url)
  } catch (error) {
    console.error('Google OAuth error:', error)
    return new Response(JSON.stringify({ error: 'Failed to initiate Google OAuth' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}