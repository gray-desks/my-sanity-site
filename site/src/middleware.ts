import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { request } = ctx;
  if (!request.url.includes('/admin')) return next();
  
  // In local development, bypass authentication for admin pages
  // This allows accessing the admin UI without login when running `astro dev`.
  if (import.meta.env.DEV) {
    return next();
  }
  
  // Allow access to login page
  if (request.url.includes('/admin/login')) return next();

  // Check for session cookie
  const cookies = request.headers.get('cookie') || '';
  const hasValidSession = cookies.includes('admin-session=authenticated');
  
  if (hasValidSession) {
    return next();
  }

  // Try Basic Auth as fallback
  const auth = request.headers.get('authorization');
  if (auth && auth.startsWith('Basic ')) {
    const [, encoded] = auth.split(' ');
    const [user, pass] = atob(encoded).split(':');
    
    if (
      user === import.meta.env.ADMIN_USER &&
      pass === import.meta.env.ADMIN_PASS
    ) {
      return next();
    }
  }
  
  // Redirect to login page instead of showing basic auth dialog
  return new Response('', {
    status: 302,
    headers: { 'Location': '/admin/login' }
  });
});