import type { APIRoute } from 'astro'

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    status: init.status || 200,
  })
}

export const POST: APIRoute = async () => {
  // This endpoint has been deprecated. Referenced docs are allowed to be deleted directly.
  return json(
    {
      error: 'gone',
      message: 'This endpoint is deprecated. Use /api/admin/articles/bulk-delete directly.',
    },
    { status: 410 }
  )
}
