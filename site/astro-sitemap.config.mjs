/**
 * Sitemap Configuration for 20-language support with hreflang
 * 多言語サイトマップとhreflang自動生成設定
 */

import { getHreflangCode } from './src/lib/getSupportedLangs.ts'

export default {
  // サイトURL（独自ドメインに統一）
  site: 'https://www.japantravellog.com',
  
  // サイトマップ生成設定
  changefreq: 'weekly',
  priority: 0.7,
  lastmod: new Date(),
  
  // 多言語hreflang設定（審査期間中は日本語のみ露出）
  i18n: {
    defaultLocale: 'ja',
    locales: { ja: getHreflangCode('ja') },
  },
  
  // カスタムページ設定
  customPages: [
    {
      url: '/',
      changefreq: 'daily',
      priority: 1.0,
      // 当面 alternates は出さない
      alternates: []
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
    sitemap: 'https://www.japantravellog.com/sitemap-index.xml'
  }
}