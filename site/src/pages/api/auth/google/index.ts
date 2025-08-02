import type { APIRoute } from 'astro'
import { google } from 'googleapis'

export const prerender = false

export const GET: APIRoute = async ({ redirect }) => {
  try {
    // Check required environment variables
    const clientId = import.meta.env.GOOGLE_CLIENT_ID
    const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET
    const redirectUri = import.meta.env.GOOGLE_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing OAuth environment variables:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        hasRedirectUri: !!redirectUri
      })
      return new Response(JSON.stringify({ 
        error: 'OAuth configuration missing',
        details: 'Server configuration error. Please contact administrator.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

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