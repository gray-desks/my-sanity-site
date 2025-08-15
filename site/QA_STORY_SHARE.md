# Instagramストーリーズ共有 検証チェックリスト

## 概要
- 対象機能: 記事詳細ページからInstagramストーリーズへ画像共有（Web Share API Level 2 + フォールバック）
- 対象ページ: `site/src/pages/article/[id].astro`
- 生成画像API: `GET /api/og/story/[id]?v=<OG_IMAGE_VERSION>`
- クライアントJS: `site/public/js/article-share.js`

## 前提条件
- 記事に `title` と `coverImage` が設定されている（カバー無しでも動作はするが背景が単色に）
- GA計測用 `gtag` がページで有効
- 実機: iOS 17+ / Android 12+ 推奨（最新Safari/Chrome）

## 環境
- 本番/プレビューURLを用意
- 端末: 
  - iOS Safari / iOS Chrome
  - Android Chrome / Android Firefox（フォールバック動作確認用）

## テスト項目

### 1) Web Share API 経路（対応端末）
- [ ] 記事詳細で「Instagramでストーリーズにシェア」をタップ
- [ ] 共有シートが開く（iOS Safari 17+ / Android Chrome）
- [ ] Instagramが候補に表示される／選択できる
- [ ] Instagramへ遷移し、生成画像が添付されている
- [ ] 共有完了後、アプリから戻ってもページが正常
- [ ] GA: `click_share_instagram`（method=web_share, can_share_files=true, article_id, ua）送信
- [ ] GA: `share_instagram_success`（method=web_share, article_id, ua）送信

### 2) フォールバック経路（非対応端末 or 共有失敗）
- [ ] ボタンタップでモーダルが表示され、プレビューが読み込まれる
- [ ] 「画像を保存」ボタンで端末の保存UIが開く/保存できる
- [ ] 「Instagramを開く」タップで `instagram://story-camera` 起動（インストール済み端末）
- [ ] GA: `click_share_instagram`（method=fallback, can_share_files=false, article_id, ua）送信
- [ ] GA: `share_instagram_fallback_modal_shown`（method=fallback, article_id, ua）送信
- [ ] GA: `save_story_image`（method=fallback, article_id, ua）送信
- [ ] GA: `open_instagram_app`（method=fallback, article_id, ua）送信

### 3) エラー経路
- [ ] 生成APIが一時失敗してもモーダルが出る（できれば再取得して表示）
- [ ] GA: `share_instagram_error`（message, method=error, article_id, ua）送信

### 4) 表示・デザイン
- [ ] 画像サイズは 1080x1920（縦）
- [ ] タイトルが3行以内で美しく折り返し（明朝系フォント）
- [ ] 上部ブランド（丸ロゴ＋「旅ログ」）の位置と見え方が問題ない
- [ ] 下部ドメインピル（例: japantravellog.com）の視認性
- [ ] ぼかし背景と暗さでタイトルの可読性が確保されている

### 5) パフォーマンス/安定性
- [ ] ボタンタップ→共有シート/モーダル表示までの体感が許容範囲
- [ ] 繰り返し共有してもメモリリーク（ObjectURL未解放等）が無い
- [ ] ネットワーク遅延時の体験（ローディング/操作不能にならない）

## デバッグのコツ
- ブラウザで `window.dataLayer`/`gtag` を確認（GA DebugViewでイベントが届くこと）
- 画像直URL: `/api/og/story/<id>?v=<OG_IMAGE_VERSION>` を直接開いて生成を確認
- 共有不可端末の判定: `navigator.canShare({ files: [new File([""], "x.webp", {type: 'image/webp'})] })`

## 既知の留意点
- iOS/AndroidともにOS/ブラウザバージョンにより `files` サポートが異なる
- フォントはサーバ環境のフォント状況に依存（厳密なブランド再現が必要なら埋め込みやパス化を検討）

