# Google Photos API セットアップガイド

## 🎯 実装済み機能

✅ サービスアカウント対応のGoogle Photos API連携  
✅ 特定アルバムからの直接ダウンロード  
✅ 自動画像最適化（オリジナル・最適化・サムネイル）  
✅ 管理画面での簡単操作  

## 🔐 セキュリティ改善済み

✅ **セキュリティ強化実装済み**
- 機密情報のマスキング
- 安全なエラーメッセージ
- 環境変数の検証
- セキュアなログ出力
- 認証情報の保護

⚠️ **認証情報は環境変数で設定**
実際の認証情報は `site/.env` ファイルに設定してください（Gitには含まれません）

## 🔧 次のステップ

### 1. アルバムIDの取得

Google Photosのアルバムページから、URLからアルバムIDを取得してください：

```
https://photos.google.com/u/0/album/{ALBUM_ID}
```

例：
- URL: `https://photos.google.com/u/0/album/AF1QipNQ7O4MxcEi4dZXk6QwQGhpTf1xGfpB7h8pV2Kx`
- アルバムID: `AF1QipNQ7O4MxcEi4dZXk6QwQGhpTf1xGfpB7h8pV2Kx`

### 2. 環境変数の設定

`site/.env` ファイルに以下を追加：

```bash
# 特定のアルバムID（必須）
GOOGLE_PHOTOS_ALBUM_ID=YOUR_ALBUM_ID_HERE
```

### 3. テスト実行

アルバムアクセスをテスト：

```bash
# 開発サーバー起動
npm run dev

# ブラウザで以下にアクセス
http://localhost:4321/api/photos/test-album?albumId=YOUR_ALBUM_ID
```

### 4. 実際の使用

1. 管理画面にアクセス: `http://localhost:4321/admin`
2. 「指定アルバムから写真をダウンロード」ボタンをクリック
3. 画像が `content/images/` に自動保存されます

## 🚨 サービスアカウント設定（推奨）

より安全な本番環境のために：

### Google Cloud Console設定

1. **サービスアカウント作成**
   - Google Cloud Console > IAM と管理 > サービスアカウント
   - 新しいサービスアカウントを作成
   - Photos Library API のスコープを付与

2. **キーファイル作成**
   - 作成したサービスアカウント > キー > 新しいキーを作成
   - JSON形式でダウンロード
   - `site/service-account-key.json` として保存

3. **環境変数追加**
   ```bash
   GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account-key.json
   ```

## 📁 ファイル構造

```
content/
├── images/
│   ├── raw/           # オリジナル画像
│   ├── optimized/     # 最適化画像 (1200x800)
│   └── thumbnails/    # サムネイル (300x200)
├── drafts/           # 下書き記事
└── published/        # 公開済み記事
```

## 🔍 トラブルシューティング

### 認証エラー
- Google Cloud Console でPhotos Library APIが有効になっているか確認
- アルバムIDが正しいか確認
- アルバムが公開またはアクセス可能な状態か確認

### ダウンロードエラー
- `content/` ディレクトリの書き込み権限を確認
- ネットワーク接続を確認
- APIクォータ制限を確認

## 📞 サポート

設定でお困りの場合は、以下の情報をお知らせください：

1. エラーメッセージ
2. アルバムID
3. テストAPI の結果: `/api/photos/test-album?albumId=YOUR_ALBUM_ID`