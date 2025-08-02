import type { APIRoute } from 'astro'
import { google } from 'googleapis'

export const GET: APIRoute = async ({ url, redirect, cookies }) => {
  try {
    const code = url.searchParams.get('code')
    
    if (!code) {
      return redirect('/admin?error=no_code')
    }

    const oauth2Client = new google.auth.OAuth2(
      import.meta.env.GOOGLE_CLIENT_ID,
      import.meta.env.GOOGLE_CLIENT_SECRET,
      import.meta.env.GOOGLE_REDIRECT_URI
    )

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Store tokens in secure httpOnly cookie
    cookies.set('google_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: import.meta.env.PROD, // Only secure in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    })

    return redirect('/admin?auth=success')
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return redirect('/admin?error=auth_failed')
  }
}