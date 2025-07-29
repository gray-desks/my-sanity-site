// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { getLangIds, getHreflangCode } from './src/lib/getSupportedLangs.js';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'ja',
        locales: getLangIds().reduce((acc, langId) => {
          acc[langId] = getHreflangCode(langId);
          return acc;
        }, {}),
      },
    })
  ],
  
  // 国際化設定
  i18n: {
    defaultLocale: 'ja',
    locales: getLangIds(),
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