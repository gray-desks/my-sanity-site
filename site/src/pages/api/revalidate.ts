import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { secret, path } = body

    // 秘密キーの確認
    if (secret !== import.meta.env.REVALIDATE_SECRET) {
      return new Response(
        JSON.stringify({ error: 'Invalid secret' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // パスの検証
    if (!path || typeof path !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid path' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Vercel の revalidate 機能を使用
    // 注意: この機能は Vercel Pro プラン以上で利用可能
    if (import.meta.env.VERCEL) {
      const revalidateUrl = `https://api.vercel.com/v1/integrations/deploy-hooks/${import.meta.env.VERCEL_DEPLOY_HOOK}`
      
      if (revalidateUrl) {
        await fetch(revalidateUrl, { method: 'POST' })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Revalidation triggered',
        path,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Revalidation error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// GET リクエストでもデプロイ可能（デバッグ用）
export const GET: APIRoute = async ({ url }) => {
  const secret = url.searchParams.get('secret')
  
  if (secret !== import.meta.env.REVALIDATE_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  return new Response(
    JSON.stringify({ 
      message: 'Revalidate endpoint is working',
      timestamp: new Date().toISOString(),
      env: import.meta.env.VERCEL ? 'vercel' : 'local'
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}