import { createClient } from '@sanity/client'
import { ENABLED_LANGUAGES, DEFAULT_LANGUAGE, type Language } from './i18n'

export const client = createClient({
  projectId: 'fcz6on8p',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

// Write client for mutations (requires token)
export const writeClient = createClient({
  projectId: 'fcz6on8p',
  dataset: 'production',
  useCdn: false, // Don't use CDN for write operations
  apiVersion: '2024-01-01',
  token: import.meta.env.SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN,
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
      "bodyText": pt::text(body),
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
  const end = offset + limit - 1
  return await client.fetch(query, { lang, offset, end })
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
      "bodyText": pt::text(body),
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
      "body": content,
      "bodyText": pt::text(content),
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
      "body": content,
      "bodyText": pt::text(content),
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
      "bodyText": pt::text(body),
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

// 記事の統計情報取得（言語・種類の分布）
export async function getArticleStats(): Promise<{
  totalArticles: number
  articlesByLanguage: Record<string, number>
  articlesByType: Record<string, number>
}> {
  // 必要最小限のフィールドのみ取得
  const query = `
    *[_type == "article"]{
      "lang": coalesce(lang, "ja"),
      "type": coalesce(type, "unknown")
    }
  `
  const items: { lang: string; type: string }[] = await client.fetch(query)

  const totalArticles = items.length
  const articlesByLanguage: Record<string, number> = {}
  const articlesByType: Record<string, number> = {}

  for (const it of items) {
    articlesByLanguage[it.lang] = (articlesByLanguage[it.lang] ?? 0) + 1
    articlesByType[it.type] = (articlesByType[it.type] ?? 0) + 1
  }

  return { totalArticles, articlesByLanguage, articlesByType }
}