---
applyTo: "backend/**"
---

# Backend コーディングルール（Strapi v5）

## ディレクトリ構成

```
backend/
├── config/            # Strapi 設定ファイル（admin, database, middlewares 等）
├── database/
│   └── migrations/    # データベースマイグレーションファイル
├── src/
│   ├── api/           # Content-Type ごとの API（controllers, routes, services）
│   └── extensions/    # Strapi コア機能の拡張（最小限に留める）
└── types/
    └── generated/     # Strapi が自動生成する型定義（直接編集禁止）
```

## 基本方針

- Strapi のコア機能の再定義（override）は `src/extensions/` に限定し、必要最小限にとどめる。
- Content-Type の追加・変更は Strapi Admin UI または `src/api/` 以下で行う。
- `types/generated/` 配下は自動生成ファイルのため**直接編集しない**。型変更が必要な場合は Content-Type の定義を変更して再生成する。

## データベース

- データベース: PostgreSQL（`pg` ドライバー）。
- Strapi のマイグレーションは `database/migrations/` に配置する。
- ファイル名は Strapi の規則（タイムスタンプ付き）に従う。

## アップロード（Supabase Storage）

- ファイルアップロードは `strapi-provider-upload-supabase` を使用する。
- Storage のバケット名・接続情報は環境変数で管理する（`config/plugins.ts` で `process.env.XXX` を参照）。

## TypeScript

- `strict: true` を厳守。
- `any` は使用しない。Strapi の型が不十分な箇所は `unknown` + 型ガードで対応する。
- カスタム型は `src/` 配下の適切な場所に定義する。

## セキュリティ

- API エンドポイントのアクセス制御は Strapi の Permissions（roles & permissions plugin）で管理する。
- 公開エンドポイントには認証不要のロールのみ付与し、管理 API（`/admin`）はパブリックに公開しない。
- DB 接続情報・JWT シークレットは環境変数で管理し、`config/` ファイルにハードコードしない。
