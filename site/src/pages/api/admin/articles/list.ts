import type { APIRoute } from 'astro'
import { client } from '../../../../lib/sanity'

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    status: init.status || 200,
  })
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const offset = Math.max(0, Number(url.searchParams.get('offset') || '0'))
    const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit') || '50')))
    const q = (url.searchParams.get('q') || '').trim()
    const lang = (url.searchParams.get('lang') || '').trim()
    const type = (url.searchParams.get('type') || '').trim()
    const includeDrafts = url.searchParams.get('includeDrafts') === '1'

    const qPattern = q ? `*${q}*` : null
    const excludeDrafts = includeDrafts ? null : true

    const totalQuery = `
      count(*[_type == "article"
        && ($lang == null || lang == $lang)
        && ($type == null || type == $type)
        && ($q == null || title match $q)
        && ($excludeDrafts == null || !(_id in path("drafts.**")))
      ])
    `

    const itemsQuery = `
      *[_type == "article"
        && ($lang == null || lang == $lang)
        && ($type == null || type == $type)
        && ($q == null || title match $q)
        && ($excludeDrafts == null || !(_id in path("drafts.**")))
      ] | order(publishedAt desc) [$offset...$end] {
        _id, title, lang, type, publishedAt
      }
    `

    const params: Record<string, any> = {
      lang: lang || null,
      type: type || null,
      q: qPattern,
      excludeDrafts,
      offset,
      end: offset + limit,
    }

    const [total, items] = await Promise.all([
      client.fetch<number>(totalQuery, params),
      client.fetch<any[]>(itemsQuery, params),
    ])

    return json({ total, items })
  } catch (e: any) {
    console.error('list error', e)
    return json({ error: 'internal_error' }, { status: 500 })
  }
}
