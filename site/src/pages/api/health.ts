import type { APIRoute } from 'astro';
import { client } from '../../lib/sanity';
import { ENABLED_LANGUAGES } from '../../lib/i18n';

export const GET: APIRoute = async () => {
  const start = Date.now();
  const env = {
    sanityProjectIdConfigured: Boolean(import.meta.env.PUBLIC_SANITY_PROJECT_ID),
    sanityDataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
    siteUrlConfigured: Boolean(import.meta.env.PUBLIC_SITE_URL),
    langsEnv: import.meta.env.LANGS || 'ja',
  };

  let sanityReachable = false;
  let articleCount: number | null = null;
  let errorMessage: string | null = null;

  try {
    articleCount = await client.fetch(
      'count(*[_type == "article" && defined(slug.current)])'
    );
    sanityReachable = true;
  } catch (e: any) {
    sanityReachable = false;
    errorMessage = e?.message || String(e);
  }

  const payload = {
    ok: sanityReachable,
    env,
    i18n: {
      enabledLanguages: ENABLED_LANGUAGES.map((l) => l.id),
    },
    sanity: {
      reachable: sanityReachable,
      articleCount,
      error: errorMessage,
    },
    durationMs: Date.now() - start,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: sanityReachable ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
};
