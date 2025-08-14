import type { APIRoute } from 'astro'
import { client, writeClient } from '../../../../lib/sanity'

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    status: init.status || 200,
  })
}

async function hasReferences(id: string): Promise<{ count: number; refs: Array<{ _id: string; _type: string; title?: string }> }> {
  const baseId = id.startsWith('drafts.') ? id.slice(7) : id
  const publishedId = baseId
  const draftId = `drafts.${baseId}`
  const params = { id: publishedId, draftId }
  const countQuery = 'count(*[references($id) || references($draftId)])'
  const refsQuery = '*[references($id) || references($draftId)][0...5]{ _id, _type, title }'
  const [count, refs] = await Promise.all([
    client.fetch<number>(countQuery, params),
    client.fetch<Array<{ _id: string; _type: string; title?: string }>>(refsQuery, params),
  ])
  return { count, refs }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!('SANITY_WRITE_TOKEN' in import.meta.env) && !process.env.SANITY_WRITE_TOKEN) {
      return json({ error: 'write_token_missing' }, { status: 500 })
    }

    const body = await request.json().catch(() => null)
    if (!body || !Array.isArray(body.ids)) {
      return json({ error: 'invalid_request' }, { status: 400 })
    }

    const ids = (body.ids as string[]).filter(Boolean)
    const failIfReferenced = Boolean(body.failIfReferenced)

    if (ids.length === 0) return json({ results: [] })
    if (ids.length > 1000) return json({ error: 'too_many_ids' }, { status: 400 })

    const results: Array<{ id: string; ok: boolean; error?: string }> = []

    // Optional pre-check when failIfReferenced is true
    if (failIfReferenced) {
      for (const id of ids) {
        const { count } = await hasReferences(id)
        if (count > 0) {
          results.push({ id, ok: false, error: 'referenced' })
        }
      }
      if (results.length > 0) {
        // If any are blocked, return early with the failures
        // The UI performs a dry-run beforehand,なので通常はここに来ない想定
        return json({ results })
      }
    }

    // Chunk deletes to avoid large transactions
    const chunkSize = 100
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize)
      let tx = writeClient.transaction()
      for (const id of chunk) {
        const baseId = id.startsWith('drafts.') ? id.slice(7) : id
        const publishedId = baseId
        const draftId = `drafts.${baseId}`
        tx = tx.delete(publishedId).delete(draftId)
      }
      try {
        await tx.commit({ visibility: 'async' })
        for (const id of chunk) results.push({ id, ok: true })
      } catch (e: any) {
        // If transaction fails, attempt per-doc delete with existence check
        for (const id of chunk) {
          try {
            const baseId = id.startsWith('drafts.') ? id.slice(7) : id
            const publishedId = baseId
            const draftId = `drafts.${baseId}`
            
            // Check existence before attempting deletion to avoid unnecessary errors
            const [publishedDoc, draftDoc] = await Promise.all([
              client.getDocument(publishedId).catch(() => null),
              client.getDocument(draftId).catch(() => null)
            ])
            
            const deletePromises = []
            if (publishedDoc) {
              deletePromises.push(writeClient.delete(publishedId))
            }
            if (draftDoc) {
              deletePromises.push(writeClient.delete(draftId))
            }
            
            if (deletePromises.length > 0) {
              await Promise.all(deletePromises)
            }
            
            results.push({ id, ok: true })
          } catch (err: any) {
            results.push({ id, ok: false, error: err?.message || 'delete_failed' })
          }
        }
      }
      // Small delay to be nice to the API (optional)
      await new Promise((r) => setTimeout(r, 150))
    }

    return json({ results })
  } catch (e) {
    console.error('bulk-delete error', e)
    return json({ error: 'internal_error' }, { status: 500 })
  }
}
