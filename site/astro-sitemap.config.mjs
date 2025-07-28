/**
 * Sitemap Configuration for 20-language support with hreflang
 * 多言語サイトマップとhreflang自動生成設定
 */

import { ENABLED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangCode } from './src/lib/i18n.js'

export default {
  // サイトURL
  site: 'https://my-sanity-site.vercel.app',
  
  // サイトマップ生成設定
  changefreq: 'weekly',
  priority: 0.7,
  lastmod: new Date(),
  
  // 多言語hreflang設定
  i18n: {
    defaultLocale: DEFAULT_LANGUAGE,
    locales: ENABLED_LANGUAGES.reduce((acc, lang) => {
      acc[lang.id] = getHreflangCode(lang.id)
      return acc
    }, {}),
  },
  
  // カスタムページ設定
  customPages: [
    {
      url: '/',
      changefreq: 'daily',
      priority: 1.0,
      // 多言語版のURL
      alternates: ENABLED_LANGUAGES
        .filter(lang => lang.id !== DEFAULT_LANGUAGE)
        .map(lang => ({
          href: `/${lang.id}/`,
          hreflang: getHreflangCode(lang.id)
        }))
    }
  ],
  
  // 除外パターン
  exclude: [
    '/api/**',
    '/admin/**',
    '/_astro/**',
    '/posts/**', // 旧記事ルート
  ],
  
  // robots.txt生成
  robots: {
    policy: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_astro/']
      }
    ],
    sitemap: 'https://my-sanity-site.vercel.app/sitemap-index.xml'
  }
}