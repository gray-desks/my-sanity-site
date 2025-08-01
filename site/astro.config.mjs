// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { getLangIds, getHreflangCode } from './src/lib/getSupportedLangs.ts';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'ja',
        locales: getLangIds().reduce((acc, langId) => {
          // @ts-ignore - dynamic locale mapping
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

  // Build hooks (deprecated in Astro 5)
  // hooks: {
  //   'astro:build:before': async () => {
  //     console.log('🚀 Starting OG image generation...');
  //     try {
  //       await execAsync('node scripts/generate-og.js');
  //     } catch (error) {
  //       console.error('Failed to generate OG images:', error);
  //     }
  //   }
  // },
  
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