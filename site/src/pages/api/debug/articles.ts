import type { APIRoute } from 'astro';
import { getArticlesPaged } from '../../../lib/sanity';
import { DEFAULT_LANGUAGE } from '../../../lib/i18n';

export const GET: APIRoute = async ({ url }) => {
  // For safety, only allow in development
  if (!import.meta.env.DEV) {
    return new Response(
      JSON.stringify({ ok: false, error: 'This endpoint is available only in development.' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const lang = url.searchParams.get('lang') || DEFAULT_LANGUAGE;
  const limit = Number(url.searchParams.get('limit') || '5');

  try {
    const articles = await getArticlesPaged(lang, 0, limit);
    const payload = {
      ok: true,
      lang,
      count: articles.length,
      sample: articles.map(a => ({
        _id: a._id,
        title: a.title,
        lang: a.lang,
        __i18n_lang: (a as any).__i18n_lang,
        slug: a.slug?.current || null,
        publishedAt: a.publishedAt,
      }))
    };
    return new Response(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || String(e) }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
