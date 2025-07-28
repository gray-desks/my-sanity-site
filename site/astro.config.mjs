// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'ja',
        locales: {
          ja: 'ja',
          en: 'en',
          'zh-cn': 'zh-Hans',
          'zh-tw': 'zh-Hant',
          ko: 'ko',
          th: 'th',
          vi: 'vi',
        },
      },
    })
  ],
  
  // 国際化設定
  i18n: {
    defaultLocale: 'ja',
    locales: [
      // Phase 1: 基幹7言語
      'ja', 'en', 'zh-cn', 'zh-tw', 'ko', 'th', 'vi'
      // Phase 2/3は段階的に追加予定
    ],
    routing: {
      prefixDefaultLocale: false, // /ja プレフィックスを使用しない
      redirectToDefaultLocale: false
    }
  },
  
  // サイト設定
  site: 'https://my-sanity-site.vercel.app',
  
  // ビルド設定
  output: 'static',
  
  // CSS最適化
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      }
    },
    css: {
      devSourcemap: false
    }
  },
  
});