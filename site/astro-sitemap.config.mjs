/**
 * Sitemap Configuration for 20-language support with hreflang
 * 多言語サイトマップとhreflang自動生成設定
 */

import { getLangIds, getHreflangCode } from './src/lib/getSupportedLangs.js'

export default {
  // サイトURL
  site: 'https://my-sanity-site.vercel.app',
  
  // サイトマップ生成設定
  changefreq: 'weekly',
  priority: 0.7,
  lastmod: new Date(),
  
  // 多言語hreflang設定
  i18n: {
    defaultLocale: 'ja',
    locales: getLangIds().reduce((acc, langId) => {
      acc[langId] = getHreflangCode(langId)
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
      alternates: getLangIds()
        .filter(langId => langId !== 'ja')
        .map(langId => ({
          href: `/${langId}/`,
          hreflang: getHreflangCode(langId)
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