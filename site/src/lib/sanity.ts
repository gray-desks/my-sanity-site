import { createClient } from '@sanity/client'

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