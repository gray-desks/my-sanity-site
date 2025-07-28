/**
 * Lighthouse CI Configuration for Multi-language SEO
 * 多言語SEO最適化のためのLighthouse CI設定
 */

export default {
  ci: {
    collect: {
      // Phase 1の7言語をテスト
      url: [
        // 日本語 (デフォルト)
        'http://localhost:4321/',
        'http://localhost:4321/spot/test-article',
        
        // 英語
        'http://localhost:4321/en/',
        'http://localhost:4321/en/spot/test-article',
        
        // 中国語 (簡体字)
        'http://localhost:4321/zh-cn/',
        'http://localhost:4321/zh-cn/spot/test-article',
        
        // 中国語 (繁体字)
        'http://localhost:4321/zh-tw/',
        'http://localhost:4321/zh-tw/spot/test-article',
        
        // 韓国語
        'http://localhost:4321/ko/',
        'http://localhost:4321/ko/spot/test-article',
        
        // タイ語
        'http://localhost:4321/th/',
        'http://localhost:4321/th/spot/test-article',
        
        // ベトナム語
        'http://localhost:4321/vi/',
        'http://localhost:4321/vi/spot/test-article',
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        // 多言語フォント読み込み時間を考慮
        maxWaitForLoad: 45000,
        // 各言語の文字エンコーディングテスト
        emulatedFormFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        // パフォーマンス基準
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'categories:seo': ['error', { minScore: 0.90 }],
        
        // 多言語SEO固有のチェック
        'meta-description': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'hreflang': 'warn',
        'canonical': 'warn',
        
        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        
        // フォント読み込み最適化
        'font-display': 'warn',
        'preload-fonts': 'warn',
        
        // 画像最適化 (多言語記事の画像)
        'modern-image-formats': 'warn',
        'optimized-images': 'warn',
        'uses-responsive-images': 'warn',
        
        // ネットワーク最適化
        'uses-http2': 'warn',
        'uses-rel-preconnect': 'warn',
        'uses-rel-preload': 'warn',
        
        // JavaScript最適化
        'unused-javascript': 'warn',
        'uses-passive-event-listeners': 'warn',
        
        // 多言語固有のベストプラクティス
        'charset': 'error',
        'viewport': 'error',
        'robots-txt': 'warn',
        'is-crawlable': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9001,
      storage: './lighthouse-results',
    },
  },
  
  // カスタム監査設定
  extends: [
    'lighthouse:default',
  ],
  
  // 多言語固有の設定
  settings: {
    // 各言語でのフォント読み込み最適化チェック
    onlyAudits: [
      'meta-description',
      'document-title', 
      'html-has-lang',
      'html-lang-valid',
      'hreflang',
      'canonical',
      'structured-data',
      'font-display',
      'largest-contentful-paint',
      'cumulative-layout-shift',
      'first-contentful-paint',
      'speed-index',
      'interactive',
      'total-blocking-time',
      'uses-optimized-images',
      'modern-image-formats',
      'uses-webp-images',
      'uses-responsive-images',
      'efficient-animated-content',
      'preload-fonts',
      'font-display',
      'uses-rel-preconnect',
      'uses-rel-preload',
      'critical-request-chains',
      'uses-http2',
      'uses-passive-event-listeners',
      'no-document-write',
      'uses-text-compression',
      'redirects-http',
      'uses-rel-canonical',
      'charset',
      'viewport',
      'robots-txt',
      'is-crawlable',
    ],
    
    // エミュレートするデバイス
    emulatedFormFactor: 'desktop',
    
    // スロットリング設定 (多言語コンテンツ読み込みを考慮)
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    
    // 多言語フォント読み込み待機時間
    maxWaitForLoad: 45000,
    maxWaitForFcp: 30000,
    
    // ブラウザ設定
    chromeFlags: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--lang=en-US,ja,zh-CN,zh-TW,ko,th,vi'
    ],
  },
}