# CLAUDE.md
> Guidance for Claude Code when working with **旅ログ – Japan Travel Journal** repository  
> Last update : 2025-08-12 (docs cleanup: remove content/ & CLI)

---

## 0. TL;DR ― ルール 3 行まとめ
1. **データモデルは `article` １本**。Trip は存在しない。  
2. **Astro / Tailwind v3 / Sanity / Vercel** ― 技術スタックは固定。  

---

## 1. プロジェクト概略
| 項目 | 内容 |
|------|------|
| **名称** | 🗾 旅ログ – Japan Travel Journal |
| **CMS / Studio** | Sanity v4 （`travel-blog-jp.sanity.studio`） |
| **フロント** | Astro 5 + Tailwind CSS 3 （`site/`） |
| **ホスティング** | Vercel Hobby (`https://my-sanity-site.vercel.app`) |
| **翻訳対象言語** | 20 言語（JA + EN + ZH-CN + …） |
| **収益導線** | Booking.com AID / Google AdSense |

---

## 2. データモデル（確定版）

### 2-1 Article
| フィールド | 型 / 仕様 |
|------------|-----------|
| `title` | string (required) |
| `slug` | slug (auto, unique) |
| `type` | string (enum: `spot` `food` `transport` `hotel` `note`) |
| `location` | geopoint (optional) |
| `placeName` | string (optional) |
| `publishedAt` | datetime (default = now) |
| `coverImage` | image (hotspot) |
| `gallery` | image[] (max 12, hotspot) |
| `body` | Portable-Text (block / image / affiliate block) |
| `lang` | 20 言語コード |
| `__i18n_*` | handled by `@sanity/document-internationalization` |

### 2-2 Affiliate Block
```js
{
  name: 'affiliate',
  type: 'object',
  fields: [
    {name: 'service', type: 'string', options:{list:['booking','rakuten','klook']}},
    {name: 'url',     type: 'url'}
  ]
}
金額内訳フィールドは無し。必要なら本文へ自由記述。

3. リポジトリ構造
bash
コピーする
編集する
my-sanity-site/
├─ schemas/                 # article.js, affiliate.js
├─ sanity.cli.js            # studioHost: 'travel-blog-jp'
├─ CLAUDE.md                # ← 本ドキュメント
├─ site/
│  ├─ astro.config.mjs
│  ├─ tailwind.config.mjs
│  ├─ src/
│  │  ├─ lib/sanity.ts      # getArticles(), getArticleBySlug()
│  │  ├─ pages/
│  │  │  ├─ index.astro
│  │  │  ├─ [lang]/index.astro
│  │  │  ├─ [type]/[slug].astro
│  │  │  └─ api/revalidate.ts
│  │  ├─ components/
│  │  │  ├─ ArticleCard.astro
│  │  │  ├─ Gallery.astro
│  │  │  └─ AffiliateBlock.astro
│  │  └─ styles/global.css
└─ .github/                 # (CI, templates) ＊未実装
4. 必須コマンド
bash
コピーする
編集する
# === Sanity Studio ===
npm run dev                # localhost:3333
npm run deploy:studio

# === Admin (Manual Post) ===
# 記事作成は Sanity Studio または サイトの管理画面（/admin）から手動で行います。
# ローカルの content/ ディレクトリや自動投稿CLIは廃止しました。

# === Astro Frontend ===
cd site && npm run dev      # localhost:4321
cd site && npm run build

# === 全ビルド ===
npm run build && cd site && npm run build

---

### 4-1 コンテンツ運用方針（更新）

- 記事データは Sanity Studio 上で作成・編集・公開します。
- 画像は Sanity の image フィールド（`coverImage`/`gallery`）で管理します。
- 追加の静的アセットが必要な場合は `site/public/` 配下に配置します（例: `site/public/og/`）。
- 旧来の `content/` ディレクトリ運用と CLI ワークフローは撤廃しました。
5. 開発ガイドライン
5-1 Schema 変更手順
/schemas/article.js を編集。

site/src/lib/sanity.ts の型・GROQ を更新。

関連 Astro コンポーネントにフィールド追加。

npx sanity deploy → npm run deploy:studio.

5-2 多言語ワークフロー

URL 例：/en/spot/kiyomizu-dera/。

lang フォルダ配下の一覧ページを ISR 生成。

5-3 ギャラリー指針
最大 12 枚。Gallery.astro で IntersectionObserver → LazyLoad。

ファイルサイズ目安：合計 < 1.5 MB / entry。

6. CI / 品質チェック（予定）
ツール	チェック内容
GitHub Actions	Node 20 → npm ci, npm run build (site)
Lighthouse CI	LCP / CLS / a11y スコア
ESLint + Prettier	ルート & site 両方

7. 環境変数（site/.env）
PUBLIC_SANITY_PROJECT_ID=fcz6on8p
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2024-01-01
PUBLIC_SITE_URL=https://my-sanity-site.vercel.app
PUBLIC_SITE_TITLE=旅ログ - 日本全国の旅記録
PUBLIC_SITE_DESCRIPTION=日本全国の旅ログを多言語で発信するブログ。各地の魅力を写真と文章でお届けします。
PUBLIC_BOOKING_AFFILIATE_ID=your-booking-affiliate-id
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-your-adsense-id
REVALIDATE_SECRET=your-secure-random-32char-string
VERCEL_DEPLOY_HOOK_URL=your-vercel-deploy-hook-id
ADMIN_USER=admin
ADMIN_PASS=change-me
OG_IMAGE_VERSION=v4

8. 典型タスク
やりたいこと	手順
新しい記事を手動で追加	Studio → New Article → 必須フィールド入力 → Publish
スタイル調整	tailwind.config.mjs に theme.extend 追加 → global.css 反映
デバッグ ISR	GET /api/revalidate?secret=… → Vercel Logs

9. TODO ロードマップ対応表
フェーズ	Claude Code が実装すべき大タスク
v0.2	1) Article スキーマ切替
2) 一覧/詳細ルーティング改修
3) タグ機能
v0.3	検索 / RSS / OGP 生成 / Lighthouse CI
v1.0	20 言語フル自動翻訳 + マップ埋込

10. 最後に
原則 "小さな PR"（1 機能 / 1 ファイルセット）で送ってください。

不明点・追加情報は必ずオーナー（ひで）へ質問。

この CLAUDE.md を変更する場合は PR タイトル docs: update CLAUDE.md を付けること。

---

## 🌍 多言語対応方針（2025-08-10 更新）

### DeepL API 対応20言語への統一

#### ✅ 採用言語（20言語）
**原文**: 日本語（ja）`isDefault: true`

**DeepL API対応19言語**:
- **アジア**: English, 한국어, 中文（简体/繁體）, ไทย, Bahasa Indonesia
- **ヨーロッパ**: Français, Deutsch, Español, Italiano, Português (Brasil), Русский, Nederlands, Polski, Svenska, Dansk, Suomi
- **その他**: العربية, Türkçe

#### 🚫 除去対象
| 言語コード | 言語名 | 除去理由 |
|-----------|--------|----------|
| `hi` | हिन्दी | DeepL API未対応 |
| `ms` | Bahasa Melayu | DeepL API未対応 |
| `tl` | Filipino | DeepL API未対応 |
| `vi` | Tiếng Việt | DeepL API未対応 |

#### 📂 影響ファイル
- `supportedLanguages.js` ✅ **更新完了**
- `sanity.config.js` - documentInternationalization設定
- `site/src/` - Astroルーティング・コンポーネント

---

## 📝 開発履歴 (History)

### v0.2-dev Article Schema Migration (2025-01-27)
**実装**: Post → Article スキーマ移行完了

#### ✅ 完了項目
- `/schemas/article.js` 新規作成（単一ドキュメント型）
- `/schemas/affiliate.js` アフィリエイトブロック作成
- `sanity.config.js` 20言語対応 + Article スキーマ追加
- `site/src/lib/sanity.ts` Article インターフェース + GROQ クエリ
- 新ルーティング: `[type]/[slug]` & `en/[type]/[slug]`
- コンポーネント: `ArticleCard`, `Gallery`（LazyLoad）, `AffiliateBlock`
- 既存 Post 機能は後方互換性維持

#### 🔧 問題解決
- Sanity Studio ビルドエラー: ✅ **解決済み**
- 原因: `site/schema.json` 配置ミス + `.sanity` runtime 未生成
- 解決策: クリーン → dev 起動 → runtime 再生成 → build 成功
- デプロイ: https://travel-blog-jp.sanity.studio ✅

#### 📊 移行結果
- JA/EN 一覧ページ: Article 対応完了
- 詳細ページ: Gallery + アフィリエイト表示
- サンプルデータ: 4記事作成完了（浅草寺・銀座寿司 JA/EN）
- ルート生成: `/spot/asakusa-morning`, `/food/ginza-sushi` 正常

### v0.2.0 Production Release (2025-01-27)
**本番リリース**: Article schema v0.2.0 完了

#### ✅ デプロイ結果
- **Main Branch**: PR #1 squash merge 完了
- **Vercel Production**: https://my-sanity-site.vercel.app 自動デプロイ
- **Studio Production**: https://travel-blog-jp.sanity.studio 稼働中
- **Redirects**: `/posts/*` → `/note/*` (301 redirect)
- **Sample Data**: 浅草寺・銀座寿司記事 本番環境で表示確認

#### 🔧 v0.2.1 運用自動化 (進行中)
**目標**: ISR Webhook + 環境変数最終整備

##### 必須環境変数 (Vercel Dashboard)
```bash
# === Core Sanity Configuration ===
PUBLIC_SANITY_PROJECT_ID=fcz6on8p
PUBLIC_SANITY_DATASET=production  
PUBLIC_SANITY_API_VERSION=2024-01-01

# === Site Configuration ===
PUBLIC_SITE_URL=https://my-sanity-site.vercel.app
PUBLIC_SITE_TITLE=旅ログ - 日本全国の旅記録

# === Revenue Stream ===
PUBLIC_BOOKING_AFFILIATE_ID=your-booking-affiliate-id
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-your-adsense-id

# === ISR Automation ===
REVALIDATE_SECRET=your-secure-random-32char-string
VERCEL_DEPLOY_HOOK_URL=your-vercel-deploy-hook-id
```

##### Sanity Webhook 設定
**Location**: Sanity Dashboard → API → Webhooks
```
Name: Vercel ISR Trigger
URL: https://my-sanity-site.vercel.app/api/revalidate
Method: POST
Dataset: production
Trigger: Create, Update, Delete
Document types: article
Secret: [REVALIDATE_SECRET と同じ値]
```


### v0.2.2 Schema Synchronization for Translation Pipeline (2025-08-06)
**実装**: 翻訳自動化パイプラインとのスキーマ同期完了

#### ✅ 完了項目
- **Article Schema 更新**: 翻訳パイプライン必須フィールド対応
- **必須フィールド追加**: `lang`, `type`, `prefecture`, `content` (validation 付き)
- **オプションフィールド**: `tags`, `placeName`, `translationOf` 対応
- **多言語サポート**: 20言語対応 (ja, en, zh-cn, zh-tw, ko, th, vi, id, ms, tl, fr, de, es, it, pt, ru, ar, hi, tr, pt-br)
- **フィールド名変更**: `body` → `content` (Article スキーマ用)

#### 🔧 Schema 変更詳細
**Required Fields** (validation: Rule.required()):
- `title` - String
- `lang` - String (supportedLanguages から選択) 
- `slug` - Slug (自動生成、必須検証追加)
- `content` - Portable Text array (旧 body から変更)
- `publishedAt` - DateTime (必須検証追加)
- `type` - Enum (spot/food/transport/hotel/note、必須検証追加)
- `prefecture` - 都道府県選択 (47都道府県、必須検証追加)

**Optional Fields**:
- `tags` - String array (layout: tags)
- `placeName` - String (多言語説明付き)  
- `translationOf` - Reference to article (weak reference)

**Image Fields** (維持):
- `coverImage` - Image with hotspot
- `gallery` - Image array (max 12, hotspot)

#### 📊 翻訳パイプライン対応
**Document ID Pattern**: `article-{timestamp}-ja-{language}`  
**Translation Linking**: `translationOf` フィールドでマスター記事との関連付け  
**Webhook Ready**: article 作成/更新/削除時の翻訳トリガー対応  
**Field Validation**: 翻訳時の "Unknown fields" エラー解消


### v0.2.3 DeepL API対応20言語への移行完了 (2025-08-10)
**実装**: 翻訳パイプライン互換性改善 + 言語設定統一

#### ✅ 完了項目
- **言語設定統一**: DeepL API対応20言語への統一完了
- **除去言語**: vi, ms, tl, hi の4言語を削除（DeepL API未対応）
- **追加言語**: nl, pl, sv, da, fi の5言語を追加（DeepL API対応）
- **中央設定更新**: `supportedLanguages.js` を基準とした動的言語管理
- **コンポーネント修正**: ハードコード言語参照を全て動的取得に変更
- **Prefecture翻訳**: 47都道府県 × 削除言語分のデータクリーンアップ
- **OG画像対応**: 新言語分のタイトル生成設定追加

#### 🔧 技術改修詳細
**コンポーネント修正**:
- `SearchFilter.astro`: i18n関数による動的文言取得
- `ArticleCard.astro`: 動的ロケールマッピング
- `Seo.astro`: OG locale動的対応

**設定ファイル**:
- `sanity.config.js`: 中央言語設定からの自動取得
- `astro.config.mjs`: 動的i18nルーティング設定
- `i18n.ts`: 20言語分のUI翻訳追加

#### 📊 検証結果
**ビルド検証**: ✅ **全言語成功**
- Sanity Studio: ビルドクリア
- Astro Frontend: 20言語プリレンダリング成功
- サイトマップ: 全言語URL生成完了

#### 🌍 対応言語 (20言語)
**原文**: 日本語 (ja)
**DeepL API対応19言語**: en, es, fr, de, it, pt-br, ru, ko, zh-cn, zh-tw, ar, tr, th, nl, pl, sv, da, fi, id

#### ⚠️ 移行影響
**既存データ**: 削除言語の記事は保持（新規翻訳のみ停止）
**URL構造**: 変更なし（既存リンク互換性維持）
**パフォーマンス**: 言語数変更なし（20言語維持）