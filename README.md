# 🗾 旅ログ - Japan Travel Blog

[![Version](https://img.shields.io/github/v/release/HIDE-Kanazawa/my-sanity-site?style=flat-square&color=blue)](https://github.com/HIDE-Kanazawa/my-sanity-site/releases)
[![Deploy](https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel)](https://my-sanity-site.vercel.app)
[![CI Status](https://img.shields.io/github/actions/workflow/status/HIDE-Kanazawa/my-sanity-site/ci.yml?style=flat-square&label=CI)](https://github.com/HIDE-Kanazawa/my-sanity-site/actions)
[![License](https://img.shields.io/badge/license-UNLICENSED-red?style=flat-square)](LICENSE)
[![Astro](https://img.shields.io/badge/astro-5.x-orange?style=flat-square&logo=astro)](https://astro.build)
[![Sanity](https://img.shields.io/badge/sanity-v4-red?style=flat-square&logo=sanity)](https://sanity.io)

日本全国の旅記録を多言語で発信するブログサイト。Sanity CMS と Astro を使用した MVP（最小実行可能プロダクト）。

## 📋 概要

- **目的**: 日本全国の旅行記を日本語・英語で発信
- **CMS**: Sanity (Free プラン)
- **フロントエンド**: Astro + Tailwind CSS
- **ホスティング**: Vercel Hobby
- **収益化**: Booking.com アフィリエイト + Google AdSense

## 🚀 機能

### ✅ 実装済み機能
- [x] 多言語対応（日本語・英語）
- [x] 記事管理（Sanity CMS）
- [x] 経費記録（交通費・宿泊費）
- [x] レスポンシブデザイン
- [x] 静的サイト生成（SSG）
- [x] 収益導線（アフィリエイト・広告）
- [x] ISR（Incremental Static Regeneration）対応

### 📝 記事フィールド
- タイトル・スラッグ・本文
- 公開日・旅行日
- メイン画像・タグ
- 交通費・宿泊費（経費管理）
- 言語設定（ja/en）

## 🛠 技術スタック

- **CMS**: Sanity v4 + document-internationalization plugin
- **Frontend**: Astro v5 + Tailwind CSS v4
- **Deployment**: Vercel
- **Language**: TypeScript

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

```bash
# site/.env ファイルを作成
cp site/.env.example site/.env
```

必要な環境変数:
- `PUBLIC_SANITY_PROJECT_ID`: Sanity プロジェクト ID
- `PUBLIC_BOOKING_AFFILIATE_ID`: Booking.com アフィリエイト ID
- `PUBLIC_ADSENSE_CLIENT_ID`: Google AdSense クライアント ID
- `REVALIDATE_SECRET`: ISR 用秘密キー

### 3. 開発サーバー起動

```bash
# Sanity Studio（ポート 3333）
npm run dev

# Astro サイト（ポート 4321）
cd site
npm run dev
```

## 🌐 デプロイ

### Vercel へのデプロイ

1. **Vercel プロジェクト作成**
   ```bash
   # Vercel CLI インストール
   npm install -g vercel
   
   # サイトディレクトリでデプロイ
   cd site
   vercel
   ```

2. **環境変数設定**
   Vercel ダッシュボードで以下を設定:
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_SANITY_DATASET=production`
   - `PUBLIC_SITE_URL=https://your-domain.vercel.app`
   - `PUBLIC_BOOKING_AFFILIATE_ID`
   - `PUBLIC_ADSENSE_CLIENT_ID`
   - `REVALIDATE_SECRET`

3. **ビルド設定**
   - Framework Preset: **Astro**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `site`

### ISR（自動更新）設定

1. **Vercel Deploy Hook 作成**
   - Vercel ダッシュボード → Settings → Git
   - Deploy Hook を作成し、URL を `VERCEL_DEPLOY_HOOK` に設定

2. **Sanity Webhook 設定**
   - Sanity ダッシュボード → API → Webhooks
   - URL: `https://your-domain.vercel.app/api/revalidate`
   - Secret: `REVALIDATE_SECRET` と同じ値

## 📊 運用

### 記事投稿フロー
1. Sanity Studio で記事作成・編集
2. 経費フィールド入力（節税対応）
3. 言語設定（ja/en）
4. 公開 → 自動的にサイト更新

### 収益化
- **Booking.com**: 宿泊施設アフィリエイト
- **Google AdSense**: ディスプレイ広告

## 🔧 カスタマイズ

### 新しいフィールド追加
1. `schema/post.js` でスキーマ拡張
2. `site/src/lib/sanity.ts` でクエリ更新
3. Astro コンポーネントで表示処理

### スタイル変更
- `site/src/layouts/Layout.astro` - 共通レイアウト
- Tailwind CSS クラスでスタイリング

## 🗺️ ロードマップ

### 📦 v0.1.0 (MVP) - ✅ 完了
- [x] 多言語ブログ基盤
- [x] Sanity CMS 統合
- [x] 経費記録機能
- [x] 収益化導線
- [x] Vercel 自動デプロイ

### 🚀 v0.2.0 - UI/UX 改善
- [ ] 記事検索機能
- [ ] カテゴリ・タグ別ページ
- [ ] 記事いいね機能
- [ ] コメント機能
- [ ] RSS フィード生成
- [ ] OGP 画像自動生成

### 🤖 v0.3.0 - 自動化強化
- [ ] n8n による投稿自動化
- [ ] 写真の自動リサイズ・最適化
- [ ] SNS 自動投稿
- [ ] 分析ダッシュボード
- [ ] バックアップ自動化

### 📊 v0.4.0 - 運用最適化
- [ ] パフォーマンス監視
- [ ] A/Bテスト機能
- [ ] 収益分析ツール
- [ ] メルマガ配信機能
- [ ] ユーザー登録・管理

## 🐛 トラブルシューティング

### よくある問題

**Q: Sanity のデータが表示されない**
A: 環境変数 `PUBLIC_SANITY_PROJECT_ID` を確認

**Q: 本番環境で広告が表示されない**
A: `PUBLIC_ADSENSE_CLIENT_ID` が正しく設定されているか確認

**Q: ISR が動作しない**
A: Webhook URL とシークレットが正しく設定されているか確認

### デバッグ用エンドポイント
- `/api/revalidate?secret=your-secret` - ISR エンドポイント確認

## 📄 ライセンス

このプロジェクトは個人事業用のMVPです。

---

**🎯 作成目的**: 1週間でMVP構築 → n8n自動化への発展

Made with ❤️ for Japanese travel content creators
