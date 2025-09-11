import { createClient } from '@sanity/client'
import { ENABLED_LANGUAGES, DEFAULT_LANGUAGE, type Language } from './i18n'

// Normalize a potentially malformed token to avoid invalid Authorization header values
const sanitizeToken = (raw: string | null | undefined): string | undefined => {
  if (!raw) return undefined
  let t = String(raw)
    .replace(/\r?\n/g, '') // remove any newlines
    .replace(/\t/g, '') // remove tabs
    .trim()
  // Remove surrounding quotes if present
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.slice(1, -1)
  }
  // Some environments mistakenly include the Bearer prefix in the env var
  t = t.replace(/^Bearer\s+/i, '')
  // Tokens should have no spaces
  t = t.replace(/\s+/g, '')
  return t || undefined
}

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'fcz6on8p',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

// Get environment variables with proper fallbacks for different environments
const getSanityToken = (): string | undefined => {
  // Try different ways to get the token based on environment
  let tok: string | null = null
  if (typeof process !== 'undefined' && process.env && typeof process.env.SANITY_WRITE_TOKEN === 'string' && process.env.SANITY_WRITE_TOKEN) {
    tok = process.env.SANITY_WRITE_TOKEN
  } else if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.SANITY_WRITE_TOKEN) {
    tok = (import.meta as any).env.SANITY_WRITE_TOKEN as string
  }
  return sanitizeToken(tok)
};

// Write client for mutations (requires token)
export const writeClient = createClient({
  projectId: 'fcz6on8p',
  dataset: 'production',
  useCdn: false, // Don't use CDN for write operations
  apiVersion: '2024-01-01',
  token: getSanityToken(),
})


export interface Article {
  _id: string
  title: string
  slug: { current: string } | null
  type: 'spot' | 'food' | 'transport' | 'hotel' | 'note'
  placeName?: string
  prefecture?: string
  publishedAt: string
  visitDate?: string
  tags?: string[]
  coverImage: {
    asset: {
      _ref: string
      url?: string
    }
  }
  gallery?: {
    asset: {
      _ref: string
      url?: string
    }
  }[]
  body: any[]
  bodyText?: string
  lang: string
  __i18n_lang?: string
  __i18n_refs?: { _ref: string; _key: string }[]
}

// 有効な言語コードの型
export type EnabledLanguageCode = typeof ENABLED_LANGUAGES[number]['id']

// 多言語記事取得結果
export interface MultiLanguageArticles {
  [langCode: string]: Article[]
}





// ======= NEW ARTICLE FUNCTIONS (20言語対応) =======

// 記事一覧取得（言語別）
export async function getArticles(lang = DEFAULT_LANGUAGE): Promise<Article[]> {
  // `lang` フィールドを使用してフィルタリング
  const query = `
    *[_type == "article" && (lang == $lang || (!defined(lang) && $lang == "ja"))] | order(publishedAt desc) {
      _id,
      title,
      slug,
      type,
      placeName,
      prefecture,
      publishedAt,
      visitDate,
      tags,
      coverImage {
        asset->{
          _id,
          url
        }
      },
      gallery[] {
        asset->{
          _id,
          url
        }
      },
      "bodyText": pt::text(coalesce(content, body)),
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query, { lang })
}

// ======= PAGINATION FUNCTIONS =======

// 記事総数取得（ページネーション用）
export async function getArticleCount(lang = DEFAULT_LANGUAGE): Promise<number> {
  const query = `
    count(*[_type == "article" 
      && (lang == $lang || (!defined(lang) && $lang == "ja")) 
      && defined(slug.current)
    ])
  `
  return await client.fetch(query, { lang })
}

// ページング対応記事一覧取得
export async function getArticlesPaged(
  lang = DEFAULT_LANGUAGE, 
  offset: number = 0, 
  limit: number = 12
): Promise<Article[]> {
  const query = `
    *[_type == "article" 
      && (lang == $lang || (!defined(lang) && $lang == "ja")) 
      && defined(slug.current)
    ] | order(publishedAt desc) [$offset...$end] {
      _id,
      title,
      slug,
      type,
      placeName,
      prefecture,
      publishedAt,
      visitDate,
      tags,
      coverImage {
        asset->{
          _id,
          url,
          metadata {
            dimensions
          }
        }
      },
      gallery[] {
        asset->{
          _id,
          url
        }
      },
      "bodyText": pt::text(coalesce(content, body)),
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  const end = offset + limit
  return await client.fetch(query, { lang, offset, end })
}

// ======= SEARCH/FILTER FUNCTIONS =======
// 検索・絞り込み対応（ページング）
export async function getArticlesWithFilters(
  lang: string = DEFAULT_LANGUAGE,
  offset: number = 0,
  limit: number = 12,
  searchTerm?: string,
  type?: string,
  prefecture?: string
): Promise<Article[]> {
  const filters: string[] = [
    '_type == "article"',
    '(lang == $lang || (!defined(lang) && $lang == "ja"))',
    'defined(slug.current)'
  ]

  if (searchTerm && searchTerm.trim()) {
    filters.push('(title match $searchPattern || pt::text(coalesce(content, body)) match $searchPattern)')
  }
  if (type && type.trim()) {
    filters.push('type == $type')
  }
  if (prefecture && prefecture.trim()) {
    filters.push('prefecture == $prefecture')
  }

  const query = `*[${filters.join(' && ')}] | order(publishedAt desc) [$offset...$end] {
    _id,
    title,
    slug,
    type,
    placeName,
    prefecture,
    publishedAt,
    visitDate,
    tags,
    coverImage {
      asset->{
        _id,
        url,
        metadata { dimensions }
      }
    },
    gallery[] {
      asset->{ _id, url }
    },
    "bodyText": pt::text(coalesce(content, body)),
    lang,
    __i18n_lang,
    __i18n_refs
  }`

  const end = offset + limit
  const searchPattern = searchTerm && searchTerm.trim() ? `*${searchTerm}*` : undefined

  return await client.fetch(query, { lang, offset, end, searchPattern, type, prefecture })
}

// 検索・絞り込み結果の総件数取得
export async function getArticleCountWithFilters(
  lang: string = DEFAULT_LANGUAGE,
  searchTerm?: string,
  type?: string,
  prefecture?: string
): Promise<number> {
  const filters: string[] = [
    '_type == "article"',
    '(lang == $lang || (!defined(lang) && $lang == "ja"))',
    'defined(slug.current)'
  ]

  if (searchTerm && searchTerm.trim()) {
    filters.push('(title match $searchPattern || pt::text(coalesce(content, body)) match $searchPattern)')
  }
  if (type && type.trim()) {
    filters.push('type == $type')
  }
  if (prefecture && prefecture.trim()) {
    filters.push('prefecture == $prefecture')
  }

  const query = `count(*[${filters.join(' && ')}])`
  const searchPattern = searchTerm && searchTerm.trim() ? `*${searchTerm}*` : undefined
  return await client.fetch(query, { lang, searchPattern, type, prefecture })
}

// 全言語の記事を一括取得（将来の多言語展開用）
export async function getAllLanguageArticles(): Promise<MultiLanguageArticles> {
  const results: MultiLanguageArticles = {}
  
  for (const language of ENABLED_LANGUAGES) {
    try {
      results[language.id] = await getArticles(language.id)
    } catch (error) {
      console.warn(`Failed to fetch articles for language ${language.id}:`, error)
      results[language.id] = []
    }
  }
  
  return results
}

// 記事の翻訳版を取得（将来の多言語展開用）
export async function getArticleTranslations(articleId: string): Promise<Article[]> {
  const query = `
    *[_type == "article" && (__i18n_base._ref == $articleId || _id == $articleId || __i18n_refs[]._ref == $articleId)] {
      _id,
      title,
      slug,
      type,
      placeName,
      prefecture,
      publishedAt,
      visitDate,
      tags,
      coverImage {
        asset->{
          _id,
          url
        }
      },
      "bodyText": pt::text(coalesce(content, body)),
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query, { articleId })
}

// IDで記事取得（slugの代わりに_idを使用）
export async function getArticleById(articleId: string): Promise<Article | null> {
  const query = `
    *[_type == "article" && _id == $articleId][0] {
      _id,
      title,
      slug,
      type,
      placeName,
      prefecture,
      publishedAt,
      visitDate,
      tags,
      coverImage {
        asset->{
          _id,
          url
        }
      },
      gallery[] {
        asset->{
          _id,
          url
        }
      },
      "body": coalesce(content, body),
      "bodyText": pt::text(coalesce(content, body)),
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query, { articleId })
}

// スラッグで記事取得（後方互換性のため残す）
export async function getArticleBySlug(slug: string, lang = DEFAULT_LANGUAGE): Promise<Article | null> {
  const query = `
    *[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      type,
      placeName,
      prefecture,
      publishedAt,
      visitDate,
      tags,
      coverImage {
        asset->{
          _id,
          url
        }
      },
      gallery[] {
        asset->{
          _id,
          url
        }
      },
      "body": coalesce(content, body),
      "bodyText": pt::text(coalesce(content, body)),
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query, { slug })
}

// タイプ別記事取得（言語別）
export async function getArticlesByType(type: string, lang = DEFAULT_LANGUAGE): Promise<Article[]> {
  // `lang` フィールドを使用してフィルタリング
  const query = `
    *[_type == "article" && type == $type && (lang == $lang || (!defined(lang) && $lang == "ja"))] | order(publishedAt desc) {
      _id,
      title,
      slug,
      type,
      placeName,
      prefecture,
      publishedAt,
      visitDate,
      tags,
      coverImage {
        asset->{
          _id,
          url
        }
      },
      gallery[] {
        asset->{
          _id,
          url
        }
      },
      "bodyText": pt::text(coalesce(content, body)),
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query, { type, lang })
}

// 将来の多言語展開用の関数を追加
// 全記事のスラッグとタイプを取得（静的生成用・20言語対応）
export async function getAllArticleSlugs(): Promise<{slug: string, type: string, lang: string}[]> {
  const query = `
    *[_type == "article" && defined(slug.current)] {
      "slug": slug.current,
      type,
      lang
    }
  `
  return await client.fetch(query)
}

// 有効言語の記事のみ取得（フェーズ別展開用）
export async function getEnabledLanguageArticleSlugs(): Promise<{slug: string, type: string, lang: string}[]> {
  const enabledLangCodes = ENABLED_LANGUAGES.map(lang => lang.id)
  const allSlugs = await getAllArticleSlugs()
  
  return allSlugs.filter(item => enabledLangCodes.includes(item.lang))
}


// 記事が存在する都道府県のリストを取得（言語別）
export async function getAvailablePrefectures(lang = DEFAULT_LANGUAGE): Promise<string[]> {
  const query = `
    *[_type == "article" 
      && (lang == $lang || (!defined(lang) && $lang == "ja"))
      && defined(prefecture)
      && prefecture != ""
    ] {
      "prefecture": coalesce(prefecture, "")
    }
  `
  const items: { prefecture: string }[] = await client.fetch(query, { lang })
  
  // 重複を除去して都道府県リストを作成
  const prefectureSet = new Set<string>()
  items.forEach(item => {
    if (item.prefecture && item.prefecture !== "未設定") {
      prefectureSet.add(item.prefecture)
    }
  })
  
  return Array.from(prefectureSet).sort()
}