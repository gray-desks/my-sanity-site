# Content Management

このディレクトリは、ブログコンテンツと画像の管理に使用されます。

## ディレクトリ構造

- `images/` - Google Photosからダウンロードした画像ファイル
  - `raw/` - オリジナル画像
  - `optimized/` - 最適化された画像
  - `thumbnails/` - サムネイル画像

- `drafts/` - 下書き記事（Markdown形式）
  - 記事のメタデータとコンテンツ
  - Sanity CMSへのアップロード前の作業領域

- `published/` - 公開済み記事のバックアップ
  - Sanity CMSに公開された記事のローカルコピー

## 使用方法

1. 管理画面の「Download New Photos」ボタンでGoogle Photosから画像をダウンロード
2. `drafts/`ディレクトリで記事を作成・編集
3. 完成した記事をSanity CMSにアップロード
4. 公開された記事は`published/`にバックアップ

## ファイル命名規則

- 画像: `YYYY-MM-DD_description.jpg`
- 記事: `YYYY-MM-DD_article-title.md`