import type { APIRoute } from 'astro'
import { client } from '../../../../../lib/sanity'

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    status: init.status || 200,
  })
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => null)
    if (!body || !Array.isArray(body.ids)) {
      return json({ error: 'invalid_request' }, { status: 400 })
    }
    const ids = (body.ids as string[]).filter(Boolean)
    if (ids.length === 0) return json({ results: [] })
    if (ids.length > 1000) return json({ error: 'too_many_ids' }, { status: 400 })

    const results: Array<{ id: string; deletable: boolean; refs: Array<{ _id: string; _type: string; title?: string }> }> = []

    for (const id of ids) {
      const baseId = id.startsWith('drafts.') ? id.slice(7) : id
      const publishedId = baseId
      const draftId = `drafts.${baseId}`

      const params = { id: publishedId, draftId }
      const countQuery = 'count(*[references($id) || references($draftId)])'
      const refsQuery = '*[references($id) || references($draftId)][0...5]{ _id, _type, title }'

      const [refCount, refs] = await Promise.all([
        client.fetch<number>(countQuery, params),
        client.fetch<Array<{ _id: string; _type: string; title?: string }>>(refsQuery, params),
      ])

      results.push({ id, deletable: refCount === 0, refs })
    }

    return json({ results })
  } catch (e) {
    console.error('dry-run error', e)
    return json({ error: 'internal_error' }, { status: 500 })
  }
}
