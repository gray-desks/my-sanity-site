# n8n Workflows for 旅ログ Blog

このディレクトリには、旅ログブログの自動化ワークフローが含まれています。

## ワークフロー一覧

### 1. google-drive-to-sanity.json
Google DriveからSanityブログへの手動投稿ワークフロー（MVP版）

**機能:**
- 手動トリガーで実行
- 「未投稿/日本語」フォルダのファイル（.md, .txt）を取得
- ファイル内容を解析してSanity記事形式に変換
- Sanityに記事を投稿
- ISRキャッシュの再検証をトリガー
- 投稿済みファイルを「投稿/日本語」フォルダに移動

**フォルダ構成:**
```
旅ログ/
├── 未投稿/
│   └── 日本語/ (ID: 1Z6qZ28zbGX2jDxqoqE4MKBmyb3Fi-p0F)
└── 投稿/
    └── 日本語/ (ID: 1Mmmz0BP5EBkRkZJ52wqLn5airSpahaaU)
```

**設定が必要な項目:**
1. **Google Drive Service Account認証**
   - Google Cloud ConsoleでService Accountを作成
   - Drive APIを有効化し、Service Accountに権限を付与
   - n8nで`Google API`認証情報として`google-drive-credential`を作成
   - 対象フォルダをService Accountと共有

2. **環境固有の設定を更新:**
   ```json
   "YOUR_SANITY_API_TOKEN": "Sanityのプロジェクト管理画面で生成したAPIトークン",
   "YOUR_REVALIDATE_SECRET": "Vercelで設定したREVALIDATE_SECRET"
   ```

**セルフホスティング環境での注意点:**
- Sanity専用ノードが利用できない場合、HTTP Requestノードを使用
- Sanity Mutate APIを直接呼び出す方式に変更済み
- APIトークンは「Editor」権限以上が必要

### 2. translate-posts.json
既存の翻訳ワークフロー（DeepL連携）

## 使用方法

1. n8nにワークフローをインポート
2. Google Drive認証情報を設定
3. ワークフロー内の以下の値を更新:
   - `YOUR_SANITY_API_TOKEN`: Sanity APIトークン
   - `YOUR_REVALIDATE_SECRET`: Vercelのリバリデーション用シークレット
4. ワークフローを手動実行

## ファイル形式

Google Driveに置くファイルは **YAMLフロントマター付きMarkdown** 形式を推奨：

### 基本構造
```markdown
---
title: 記事タイトル
type: spot|food|transport|hotel|note
placeName: 場所名（オプション）
prefecture: tokyo|osaka|kyoto など
publishedAt: 2025-01-27T10:00:00.000Z
coverImage: cover.jpg              # カバー画像
gallery:                           # ギャラリー画像
  - photo1.jpg
  - photo2.jpg
---

# 記事タイトル

## セクション1
テキストの説明...

![画像の説明](image1.jpg)       # 記事内画像

続きのテキスト...

![別の画像](image2.jpg)          # 記事内画像
```

### テンプレートファイル
各記事タイプのテンプレートを `n8n/templates/` に用意：

- **spot-template.md**: 観光スポット用
- **food-template.md**: 食事・グルメ用  
- **hotel-template.md**: ホテル・宿泊用
- **transport-template.md**: 交通手段用
- **note-template.md**: メモ・準備用

### 自動解析機能
- フロントマターから各フィールドを自動抽出
- Markdownを Sanity Portable Text に変換
- 見出し（#, ##, ###）の階層構造を保持
- **記事内画像記法** `![alt](image.jpg)` を画像ブロックに変換
- カバー画像・ギャラリー画像の自動設定
- **注意**: テンプレート形式での記事作成が前提

## 画像の扱い方

### 基本方針
Google Drive同一フォルダ内に画像ファイルを配置し、用途に応じて指定：

#### 3種類の画像
1. **カバー画像**: 記事のメイン画像（フロントマター指定）
2. **記事内画像**: 本文中の説明画像（Markdown記法）
3. **ギャラリー画像**: 記事末尾の画像集（フロントマター指定）

```yaml
---
coverImage: cover.jpg        # カバー画像（1枚）
gallery:                     # ギャラリー画像（最大12枚）
  - photo1.jpg
  - photo2.jpg
---

# 記事本文

![説明文](inline-image.jpg)  # 記事内画像（無制限）
```

### フォルダ構成例（改良版）
```
旅ログ/
├── 未投稿/
│   └── 日本語/
│       ├── 20250127_浅草寺参拝記/
│       │   ├── article.md          # 記事ファイル（固定名）
│       │   ├── cover.jpg           # カバー画像
│       │   ├── gate.jpg            # ギャラリー画像
│       │   └── temple.jpg          # ギャラリー画像
│       └── 20250128_銀座寿司体験/
│           ├── article.md
│           ├── cover.jpg
│           └── counter.jpg
└── 投稿/
    └── 日本語/
        └── 20250127_浅草寺参拝記/    # 投稿後に移動
```

### 自動処理フロー
1. **フォルダ検索**: 未投稿フォルダ内の記事フォルダを検索
2. **記事読込**: `article.md` ファイルを読み込み・解析
3. **画像検出**: 同フォルダ内の画像ファイルを検索・ダウンロード  
4. **画像アップロード**: Sanity Asset APIで画像をアップロード
5. **記事作成**: アップロードした画像を記事に関連付け
6. **フォルダ移動**: 処理完了後、投稿済みフォルダに移動

### 対応形式
- **画像形式**: JPG, PNG, WEBP
- **ファイル名**: 英数字・ハイフン推奨（日本語可）
- **サイズ制限**: 1ファイル10MB以内推奨

### 注意事項
- 画像ファイルが見つからない場合は画像なしで記事作成
- 大きな画像は自動的にSanityで最適化される
- ギャラリーは指定した順序で表示される