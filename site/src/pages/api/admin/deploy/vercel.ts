import type { APIRoute } from 'astro'

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    status: init.status || 200,
  })
}

export const POST: APIRoute = async () => {
  try {
    const hook = (import.meta.env.VERCEL_DEPLOY_HOOK_URL || process.env.VERCEL_DEPLOY_HOOK_URL) as string | undefined
    if (!hook) {
      return json({ error: 'missing_hook_url' }, { status: 500 })
    }

    const res = await fetch(hook, { method: 'POST' })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return json({ error: 'deploy_hook_failed', status: res.status, body: text }, { status: 502 })
    }

    let payload: any = null
    try { payload = await res.json() } catch { /* ignore non-JSON */ }

    return json({ ok: true, payload })
  } catch (e: any) {
    console.error('vercel deploy trigger error', e)
    return json({ error: 'internal_error' }, { status: 500 })
  }
}
