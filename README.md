# 🗾 旅ログ - Japan Travel Blog

[![Version](https://img.shields.io/badge/version-v0.2.4-blue?style=flat-square)](https://github.com/HIDE-Kanazawa/my-sanity-site/releases/tag/v0.2.4)
[![Schema](https://img.shields.io/badge/schema-Article%20v0.2-green?style=flat-square)](https://github.com/HIDE-Kanazawa/my-sanity-site/blob/main/schema/article.js)
[![Deploy](https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel)](https://www.japantravellog.com)
[![Studio](https://img.shields.io/badge/studio-sanity.studio-green?style=flat-square&logo=sanity)](https://travel-blog-jp.sanity.studio)
[![License](https://img.shields.io/badge/license-UNLICENSED-red?style=flat-square)](LICENSE)
[![Astro](https://img.shields.io/badge/astro-5.12.3-orange?style=flat-square&logo=astro)](https://astro.build)
[![Sanity](https://img.shields.io/badge/sanity-v4.3.0-red?style=flat-square&logo=sanity)](https://sanity.io)

日本全国の旅記録を多言語で発信するブログサイト。Sanity CMS と Astro (SSR) を使用しています。

## 📋 概要

- **目的**: 日本全国の旅行記を多言語で発信
- **CMS**: Sanity (Free プラン)
- **Studio**: [travel-blog-jp.sanity.studio](https://travel-blog-jp.sanity.studio)
- **フロントエンド**: Astro (SSR) + Tailwind CSS
- **ホスティング**: Vercel Hobby
- **収益化**: Booking.com アフィリエイト + Google AdSense

## 🚀 機能

### ✅ 実装済み機能
- [x] **高度な国際化(i18n)対応 (20言語)**
- [x] 記事管理（Sanity CMS）
- [x] **ChatGPT記事一括貼り付け機能**
- [x] **SEO最適化 (動的Sitemap, hreflang, OGP)**
- [x] **パフォーマンス改善 (画像WebP化, Vercel Speed Insights)**
- [x] レスポンシブデザイン
- [x] サーバーサイドレンダリング (SSR on Vercel)
- [x] ISR（Incremental Static Regeneration）による自動更新
- [x] 収益導線（アフィリエイト・広告）

### 📝 記事スキーマ (Article v0.2)
- タイトル・スラッグ・記事タイプ（spot/food/transport/hotel/note）
- カバー画像・ギャラリー（最大12枚）
- 位置情報・場所名
- 本文（Portable Text + アフィリエイトブロック）
- 多言語フィールド（20言語対応）・公開日

## 🛠 技術スタック

- **CMS**: Sanity v4.3 + @sanity/document-internationalization v3.3
- **Frontend**: Astro v5.12 (SSR) + Tailwind CSS v3.4
- **Deployment**: Vercel (Adapter: @astrojs/vercel)
- **Language**: TypeScript
- **Testing**: Vitest

## 📦 セットアップ

### 1. 依存関係のインストール

```bash
# ルートディレクトリ（Sanity Studio）
npm install

# フロントエンド
cd site
npm install
```

### 2. 環境変数の設定

ルートと`site`ディレクトリに`.env`ファイルを作成します。

```bash
# ルートディレクトリ
cp .env.example .env

# サイトディレクトリ
cd site
cp .env.example .env
```

**主要な環境変数 (`site/.env`):**
- `PUBLIC_SANITY_PROJECT_ID`: Sanity プロジェクト ID
- `PUBLIC_SITE_URL`: **必須** Vercelデプロイ先のURL (例: `https://your-site.vercel.app`)
- `REVALIDATE_SECRET`: ISR 用の秘密キー (ランダムな文字列)

### 3. 開発サーバー起動

```bash
# Sanity Studio (ポート 3333)
npm run dev

# Astro サイト (ポート 4321)
cd site
npm run dev
```

## 🌐 デプロイ

このプロジェクトはVercelへのデプロイに最適化されています。

### Vercel へのデプロイ

1. **Vercel プロジェクト作成**
   - Vercel CLIをインストール (`npm i -g vercel`)
   - `site` ディレクトリで `vercel` コマンドを実行

2. **環境変数設定 (Vercel Dashboard)**
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_SANITY_DATASET` (例: `production`)
   - `PUBLIC_SITE_URL` (デプロイ先のURL)
   - `REVALIDATE_SECRET` (ISR用)
   - その他、アフィリエイトやAdSenseのID

3. **ビルド設定 (Vercel)**
   - **Framework Preset**: Astro
   - **Root Directory**: `site`
   (他の設定は自動で検出されます)

### ISR（自動更新）設定

Sanityでコンテンツを更新した際に、Vercel上のサイトを自動で再ビルドします。

1. **Sanity Webhook 設定**
   - Sanity ダッシュボード → API → Webhooks
   - URL: `https://<YOUR_SITE_URL>/api/revalidate`
   - Secret: `REVALIDATE_SECRET` と同じ値
   - Trigger on: `Create`, `Update`, `Delete`

## 📊 運用

### 記事投稿フロー (推奨)
1. Sanity Studioで新規Article作成
2. **「📝 記事テキスト一括入力」** フィールドにChatGPT生成記事をペースト
3. **「🚀 記事データを自動生成」** ボタンをクリック
4. 自動入力されたフィールドを確認・微調整後、公開

**自動抽出機能:**
- ✅ タイトル, 記事タイプ, 都道府県, 場所名
- ✅ 関連タグ (最大5個)
- ✅ MarkdownからPortable Textへ自動変換

## 🗺️ ロードマップ

### ✅ v0.2.4 - i18n & SEO強化 (完了)
- [x] **国際化(i18n)リファクタリング**: UIテキストを多言語化
- [x] **SEO最適化**: `hreflang`タグと`og:locale:alternate`を全言語で自動生成
- [x] **パフォーマンス改善**: 主要画像をWebPに変換
- [x] **Astro v5 & SSR移行**: `output: 'server'` に変更し、Vercelアダプタを導入

### ✅ v0.2.3 - ChatGPT記事一括貼り付け機能 (完了)
- [x] カスタム入力コンポーネント `TextPasteInput.jsx`
- [x] 自動テキスト解析エンジン `textParser.js`
- [x] テストスイート `textParser.test.ts`

### ✅ v0.2.1 - 運用自動化 & 本番安定化 (完了)
- [x] ISR Webhook 設定（Sanity → Vercel 自動更新）
- [x] 旧URL リダイレクト（`/posts/*` → `/note/*`）
- [x] E2E テストスイート（`npm run e2e`）
- [x] 環境変数のドキュメント化

### ✅ v0.2.0 - Articleスキーマ移行 (完了)
- [x] Articleスキーマ導入、多言語対応(20言語)
- [x] Studioデプロイ

### ✅ v0.1.0 (MVP) - (完了)
- [x] 多言語ブログ基盤、Sanity統合、Vercelデプロイ

### 🚧 v0.3.0 - 自動化強化 (進行中)
- [ ] 記事検索機能
- [ ] RSS フィード生成
- [ ] n8n による投稿自動化
- [ ] 写真の自動リサイズ・最適化

## 🐛 トラブルシューティング

**Q: Sanity のデータが表示されない**
A: `site/.env` の `PUBLIC_SANITY_PROJECT_ID` を確認してください。

**Q: ISR が動作しない**
A: Vercelの環境変数 `REVALIDATE_SECRET` と Sanity WebhookのSecretが一致しているか確認してください。

---

Made with ❤️ for Japanese travel content creators
