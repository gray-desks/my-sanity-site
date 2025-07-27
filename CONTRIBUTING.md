# 🤝 Contributing Guide

旅ログプロジェクトへのコントリビューションをありがとうございます！

## 📋 コントリビューション方針

### 🎯 プロジェクトの目標
- 日本の旅行情報を多言語で発信
- シンプルで使いやすいCMS連携ブログ
- 個人事業の経費管理機能
- 収益化導線の最適化

### 🌟 歓迎するコントリビューション
- 🐛 バグ修正
- ✨ 新機能追加
- 📚 ドキュメント改善
- 🎨 UI/UX改善
- ⚡ パフォーマンス最適化
- 🔧 開発環境の改善

## 🚀 開発環境セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/HIDE-Kanazawa/my-sanity-site.git
cd my-sanity-site
```

### 2. 依存関係のインストール
```bash
# Sanity Studio
npm install

# Astro サイト
cd site
npm install
```

### 3. 環境変数の設定
```bash
# site/.env を作成
cp site/.env.example site/.env
# 必要な環境変数を設定
```

### 4. 開発サーバー起動
```bash
# Sanity Studio (ポート 3333)
npm run dev

# Astro サイト (ポート 4321) 
cd site
npm run dev
```

## 📝 コミット規約 (Conventional Commits)

### コミットメッセージ形式
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type一覧
- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント変更
- `style:` コードフォーマット（機能に影響しない）
- `refactor:` リファクタリング
- `perf:` パフォーマンス改善
- `test:` テスト追加・修正
- `chore:` ビルドプロセス・補助ツール変更
- `ci:` CI設定変更

### コミット例
```bash
# 新機能
feat(search): add article search functionality

# バグ修正
fix(i18n): resolve slug undefined error in English pages

# ドキュメント
docs(readme): update deployment instructions

# リファクタリング  
refactor(sanity): extract common query functions

# パフォーマンス
perf(images): implement lazy loading for article images
```

## 🔄 プルリクエスト手順

### 1. ブランチ作成
```bash
# development ブランチから作成
git checkout development
git pull origin development
git checkout -b feature/your-feature-name
```

### 2. 開発・テスト
```bash
# 型チェック
cd site && npx tsc --noEmit

# ビルドテスト
cd site && npm run build

# 手動テスト
# - / (日本語)
# - /en (英語)
# - 記事詳細ページ
```

### 3. プルリクエスト作成
- **Base branch**: `main`
- **Title**: 簡潔で分かりやすいタイトル
- **Description**: PR テンプレートに従って記載
- **Reviewers**: メンテナーを指定

### 4. レビュー対応
- CI が通ることを確認
- レビューコメントに対応
- 必要に応じて追加コミット

## 🧪 テストガイドライン

### 必須チェック項目
- [ ] 型チェック通過 (`npx tsc --noEmit`)
- [ ] ビルド成功 (`npm run build`)
- [ ] 日本語版動作確認 (`/`)
- [ ] 英語版動作確認 (`/en`) 
- [ ] レスポンシブデザイン確認
- [ ] Lighthouse スコア維持

### 手動テスト手順
1. **記事表示**: 記事一覧・詳細が正常表示
2. **多言語**: 日英切り替えが正常動作
3. **画像**: メイン画像が適切に表示
4. **リンク**: 内部・外部リンクが正常動作
5. **フォーム**: 検索・コメント機能が正常動作

## 🔒 セキュリティガイドライン

### 注意事項
- ✅ 環境変数で機密情報管理
- ✅ XSS/CSRF対策の実装
- ✅ 入力値の適切なバリデーション
- ❌ API キーのハードコーディング禁止
- ❌ 個人情報の不適切な取り扱い禁止

### セキュリティレビュー
- 新機能は必ずセキュリティレビューを実施
- 外部ライブラリ追加時は脆弱性チェック
- 認証・認可機能は慎重にレビュー

## 📞 サポート・質問

### 質問・相談
- 🐛 **バグ報告**: [Bug Report テンプレート](https://github.com/HIDE-Kanazawa/my-sanity-site/issues/new?template=bug_report.yml)
- ✨ **機能提案**: [Feature Request テンプレート](https://github.com/HIDE-Kanazawa/my-sanity-site/issues/new?template=feature_request.yml)
- 💬 **一般的な質問**: [Discussions](https://github.com/HIDE-Kanazawa/my-sanity-site/discussions)

### 開発チーム
- **メンテナー**: [@HIDE-Kanazawa](https://github.com/HIDE-Kanazawa)
- **レビュアー**: コミュニティメンバー

## 📜 行動規範

### 基本原則
- 🤝 **尊敬**: 全ての参加者を尊重する
- 🌈 **多様性**: 異なる意見・バックグラウンドを歓迎
- 🎯 **建設的**: 建設的なフィードバックを心がける
- 📚 **学習**: 学び合いの姿勢を大切にする

### 禁止事項
- 侮辱的・差別的な言動
- 嫌がらせやいじめ
- 個人情報の無断公開
- スパムや関係のない投稿

---

**🎯 目標**: 日本の旅行文化を世界に発信し、旅行者と地域をつなぐプラットフォームを目指します。

あなたのコントリビューションが、多くの旅行者にとって価値ある情報源となります。ありがとうございます！ 🙏