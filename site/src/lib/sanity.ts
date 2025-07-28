import { createClient } from '@sanity/client'
import { ENABLED_LANGUAGES, DEFAULT_LANGUAGE, type Language } from './i18n'

export const client = createClient({
  projectId: 'fcz6on8p',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

export interface Post {
  _id: string
  title: string
  slug: { current: string } | null
  publishedAt: string
  excerpt: string
  mainImage?: {
    asset: {
      _ref: string
      url?: string
    }
  }
  content: any[]
  tags: string[]
  tripDate?: string
  travelCost?: number
  lodgingCost?: number
  lang: 'ja' | 'en'
  __i18n_lang?: string
  __i18n_refs?: { _ref: string; _key: string }[]
}

export interface Article {
  _id: string
  title: string
  slug: { current: string } | null
  type: 'spot' | 'food' | 'transport' | 'hotel' | 'note'
  location?: {
    lat: number
    lng: number
  }
  placeName?: string
  publishedAt: string
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

// 日本語記事一覧取得
export async function getJapanesePosts(): Promise<Post[]> {
  const query = `
    *[_type == "post" && lang == "ja" && defined(slug.current)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage {
        asset->{
          _id,
          url
        }
      },
      tags,
      tripDate,
      travelCost,
      lodgingCost,
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query)
}

// 英語記事一覧取得
export async function getEnglishPosts(): Promise<Post[]> {
  const query = `
    *[_type == "post" && lang == "en" && defined(slug.current)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage {
        asset->{
          _id,
          url
        }
      },
      tags,
      tripDate,
      travelCost,
      lodgingCost,
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query)
}

// スラッグで記事取得（多言語対応）
export async function getPostBySlug(slug: string, lang: 'ja' | 'en' = 'ja'): Promise<Post | null> {
  const query = `
    *[_type == "post" && slug.current == $slug && lang == $lang && defined(slug.current)][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage {
        asset->{
          _id,
          url
        }
      },
      content,
      tags,
      tripDate,
      travelCost,
      lodgingCost,
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query, { slug, lang })
}

// 他言語版取得
export async function getTranslatedPost(postId: string, targetLang: 'ja' | 'en'): Promise<Post | null> {
  const query = `
    *[_type == "post" && __i18n_refs[].ref == $postId && lang == $targetLang][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage {
        asset->{
          _id,
          url
        }
      },
      content,
      tags,
      tripDate,
      travelCost,
      lodgingCost,
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query, { postId, targetLang })
}

// 全投稿のスラッグを取得（静的生成用）
export async function getAllPostSlugs(): Promise<{slug: string, lang: 'ja' | 'en'}[]> {
  const query = `
    *[_type == "post" && defined(slug.current)] {
      "slug": slug.current,
      lang
    }
  `
  return await client.fetch(query)
}

// ======= NEW ARTICLE FUNCTIONS (20言語対応) =======

// 記事一覧取得（言語別）
export async function getArticles(lang = DEFAULT_LANGUAGE): Promise<Article[]> {
  const query = `
    *[_type == "article" && lang == $lang && defined(slug.current)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      type,
      location,
      placeName,
      publishedAt,
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
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query, { lang })
}

// 全言語の記事を一括取得
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

// 記事の翻訳版を取得
export async function getArticleTranslations(articleId: string): Promise<Article[]> {
  const query = `
    *[_type == "article" && (__i18n_base._ref == $articleId || _id == $articleId || __i18n_refs[]._ref == $articleId)] {
      _id,
      title,
      slug,
      type,
      location,
      placeName,
      publishedAt,
      coverImage {
        asset->{
          _id,
          url
        }
      },
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query, { articleId })
}

// スラッグで記事取得（20言語対応）
export async function getArticleBySlug(slug: string, lang = DEFAULT_LANGUAGE): Promise<Article | null> {
  const query = `
    *[_type == "article" && slug.current == $slug && lang == $lang && defined(slug.current)][0] {
      _id,
      title,
      slug,
      type,
      location,
      placeName,
      publishedAt,
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
      body,
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query, { slug, lang })
}

// タイプ別記事取得（20言語対応）
export async function getArticlesByType(type: string, lang = DEFAULT_LANGUAGE): Promise<Article[]> {
  const query = `
    *[_type == "article" && type == $type && lang == $lang && defined(slug.current)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      type,
      location,
      placeName,
      publishedAt,
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
      lang,
      __i18n_lang,
      __i18n_refs
    }
  `
  return await client.fetch(query, { type, lang })
}

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

// 記事の統計情報取得
export async function getArticleStats(): Promise<{
  totalArticles: number
  articlesByLanguage: Record<string, number>
  articlesByType: Record<string, number>
}> {
  const query = `
    {
      "totalArticles": count(*[_type == "article"]),
      "articlesByLanguage": *[_type == "article"] | group_by(lang) {
        "lang": @[0].lang,
        "count": length(@)
      },
      "articlesByType": *[_type == "article"] | group_by(type) {
        "type": @[0].type,
        "count": length(@)
      }
    }
  `
  
  const result = await client.fetch(query)
  
  // 結果を整形
  const articlesByLanguage: Record<string, number> = {}
  const articlesByType: Record<string, number> = {}
  
  result.articlesByLanguage.forEach((item: any) => {
    articlesByLanguage[item.lang] = item.count
  })
  
  result.articlesByType.forEach((item: any) => {
    articlesByType[item.type] = item.count
  })
  
  return {
    totalArticles: result.totalArticles,
    articlesByLanguage,
    articlesByType
  }
}