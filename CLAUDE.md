# CLAUDE.md
> Guidance for Claude Code when working with **旅ログ – Japan Travel Journal** repository  
> Last update : 2025-07-27 (v0.1.0 requirements freeze)

---

## 0. TL;DR ― ルール 3 行まとめ
1. **データモデルは `article` １本**。Trip は存在しない。  
2. **Astro / Tailwind v3 / Sanity / Vercel** ― 技術スタックは固定。  
3. n8n 連携・多言語（20 言語）を前提としつつ「まずはシンプルに」。

---

## 1. プロジェクト概略
| 項目 | 内容 |
|------|------|
| **名称** | 🗾 旅ログ – Japan Travel Journal |
| **目的** | 最低限の収益 × ほぼゼロ運用コスト（n8n 自動投稿） |
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
npm run dev          # localhost:3333
npm run deploy:studio

# === Astro Frontend ===
cd site && npm run dev      # localhost:4321
cd site && npm run build

# === 全ビルドテスト ===
npm run build && cd site && npm run build
5. 開発ガイドライン
5-1 Schema 変更手順
/schemas/article.js を編集。

site/src/lib/sanity.ts の型・GROQ を更新。

関連 Astro コンポーネントにフィールド追加。

npx sanity deploy → npm run deploy:studio.

5-2 多言語ワークフロー
JA をマスター。n8n が翻訳→article コピー。

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
PUBLIC_SANITY_PROJECT_ID = fcz6on8p

PUBLIC_BOOKING_AFFILIATE_ID

PUBLIC_ADSENSE_CLIENT_ID

REVALIDATE_SECRET

8. 典型タスク
やりたいこと	手順
新しい記事を手動で追加	Studio → New Article → 必須フィールド入力 → Publish
記事を翻訳	n8n Cron → DeepL → Sanity mutate (lang=xx)
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
原則 “小さな PR”（1 機能 / 1 ファイルセット）で送ってください。

不明点・追加情報は必ずオーナー（ひで）へ質問。

この CLAUDE.md を変更する場合は PR タイトル docs: update CLAUDE.md を付けること。