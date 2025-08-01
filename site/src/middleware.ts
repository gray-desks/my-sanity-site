import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { request } = ctx;
  if (!request.url.includes('/admin')) return next();

  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) {
    return new Response('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  const [, encoded] = auth.split(' ');
  const [user, pass] = atob(encoded).split(':');
  
  if (
    user === import.meta.env.ADMIN_USER &&
    pass === import.meta.env.ADMIN_PASS
  ) {
    return next();
  }
  return new Response('Forbidden', { status: 403 });
});