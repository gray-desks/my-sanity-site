# 🔐 セキュリティガイドライン

## ⚠️ 重要なセキュリティ注意事項

### 🚨 絶対にコミットしてはいけないファイル

以下のファイルは**絶対にGitにコミットしないでください**：

```
# 環境変数ファイル
site/.env
site/.env.local
site/.env.production

# Google Service Account キー
site/service-account-key.json
*service-account*.json
*credentials*.json

# その他の機密情報
*.pem
*.key
*.p12
```

### 🛡️ 現在の保護状況

✅ `.gitignore` に機密ファイルを追加済み  
✅ 環境変数テンプレート（`.env.example`）を非機密化  
✅ Google Service Account キーの除外設定  

## 🔧 安全な設定方法

### 1. 環境変数の設定

#### ローカル開発環境
```bash
# site/.env ファイルを作成（Gitに含まれません）
cp site/.env.example site/.env

# 主な変数例（必要に応じて設定）
PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
PUBLIC_SANITY_DATASET=production
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_TITLE=旅ログ - 日本全国の旅記録
PUBLIC_SITE_DESCRIPTION=日本全国の旅ログを多言語で発信するブログ。
REVALIDATE_SECRET=your-revalidate-secret
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
ADMIN_USER=admin
ADMIN_PASS=your-secure-password
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
PUBLIC_BOOKING_AFFILIATE_ID=xxxxxx
OG_IMAGE_VERSION=v4
```

#### 本番環境（Vercel）
1. Vercel Dashboard → プロジェクト → Settings → Environment Variables
2. 以下の変数を追加：
   ```
   PUBLIC_SANITY_PROJECT_ID
   PUBLIC_SANITY_DATASET
   PUBLIC_SITE_URL
   PUBLIC_SITE_TITLE
   PUBLIC_SITE_DESCRIPTION
   REVALIDATE_SECRET
   VERCEL_DEPLOY_HOOK_URL (任意)
   ADMIN_USER
   ADMIN_PASS
   PUBLIC_ADSENSE_CLIENT_ID (任意)
   PUBLIC_BOOKING_AFFILIATE_ID (任意)
   OG_IMAGE_VERSION (任意)
   ```

### 2. 廃止済み機能に関する注意

本プロジェクトでは Google Photos 連携は削除済みです。
- Google Photos に関する環境変数やサービスアカウント設定は不要です。
- 旧ドキュメントの記載は参照しないでください。

## 🔍 セキュリティチェックリスト

### 開発時
- [ ] `.env` ファイルが `.gitignore` に含まれている
- [ ] 機密情報がコードにハードコードされていない
- [ ] Service Account キーがGitに含まれていない
- [ ] 本番用とテスト用の認証情報が分離されている

### デプロイ時
- [ ] Vercel環境変数が正しく設定されている
- [ ] 本番環境で不要なデバッグ情報が無効化されている
- [ ] HTTPS通信が強制されている
- [ ] 管理画面のアクセス制御が有効

### 定期監査
- [ ] 使用していないAPI キーの削除
- [ ] アクセスログの確認
- [ ] 権限の最小化原則の確認

## 🚨 セキュリティインシデント対応

### もし機密情報を誤ってコミットした場合

1. **即座にGitから削除**
   ```bash
   # ファイルを削除してコミット
   git rm site/.env
   git commit -m "Remove accidentally committed credentials"
   
   # Git履歴からも削除（注意：破壊的操作）
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch site/.env' --prune-empty --tag-name-filter cat -- --all
   ```

2. **認証情報の無効化**
   - Google Cloud Console で該当するクライアントIDを無効化
   - 新しい認証情報を生成

3. **新しい認証情報の設定**
   - 新しいクライアントID・シークレットを生成
   - すべての環境で認証情報を更新

### GitHubに公開している場合

1. **即座にリポジトリをプライベートに変更**
2. **GitHub Secret Scanning の確認**
3. **認証情報の完全な更新**

## 📋 ベストプラクティス

### 認証情報管理
- 本番・テスト・開発で異なる認証情報を使用
- 定期的な認証情報のローテーション
- 最小権限の原則を適用

### コード管理
- 機密情報は環境変数から読み込み
- 設定ファイルのテンプレート化
- セキュリティレビューの実施

### モニタリング
- APIアクセスログの監視
- 異常なアクセスパターンの検出
- 定期的なセキュリティ監査

## 📞 セキュリティ問題の報告

セキュリティに関する問題を発見した場合は、即座に以下の手順を実行してください：

1. 該当する機能を無効化
2. 認証情報を無効化
3. 問題の詳細を記録
4. 修正対応の実施

---

**⚠️ 注意**: このドキュメント自体にも機密情報を含めないようにしてください。