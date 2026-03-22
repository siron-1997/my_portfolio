# backend

ポートフォリオサイトのコンテンツ管理用 Strapi v5 アプリケーションです。  
データベースに PostgreSQL、ファイルストレージに Supabase Storage を使用しています。

---

## 技術スタック

| パッケージ | バージョン | 用途 |
|---|---|---|
| `@strapi/strapi` | 5.13.0 | Strapi フレームワーク本体 |
| `@strapi/plugin-users-permissions` | 5.13.0 | 認証・権限管理プラグイン |
| `@strapi/plugin-cloud` | 5.13.0 | Strapi Cloud デプロイプラグイン |
| `@strapi/provider-upload-aws-s3` | ^5.22.0 | S3 互換アップロードプロバイダー |
| `strapi-provider-upload-supabase` | ^1.0.0 | Supabase Storage アップロードプロバイダー |
| `pg` | 8.8.0 | PostgreSQL ドライバー |
| `typescript` | ^5 | 型システム |
| **Node.js** | 22.14.0 | ランタイム |
| **pnpm** | >=10.0.0 | パッケージマネージャー |

---

## セットアップ

### 1. パッケージインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env.example` を参考に `.env` ファイルを作成し、各値を設定してください。

```bash
cp .env.example .env
```

### 3. 開発サーバー起動

```bash
pnpm dev
```

[http://localhost:1337/admin](http://localhost:1337/admin) で Strapi Admin にアクセスできます。

---

## スクリプト

| コマンド | 内容 |
|---|---|
| `pnpm dev` | 開発サーバー起動（ホットリロード有効） |
| `pnpm start` | 本番サーバー起動（ホットリロード無効） |
| `pnpm build` | Admin パネルのビルド |
| `pnpm upgrade:dry` | Strapi アップグレードのドライラン（確認用） |
| `pnpm upgrade` | Strapi を最新バージョンへアップグレード |

---

## ディレクトリ構成

```text
backend/
├── config/            # Strapi 設定ファイル（admin, database, middlewares 等）
├── database/
│   └── migrations/    # データベースマイグレーションファイル
├── src/
│   ├── api/           # Content-Type ごとの API（controllers, routes, services）
│   │   ├── category/
│   │   ├── control-item/
│   │   ├── work/
│   │   └── work-introduction/
│   └── extensions/    # Strapi コア機能の拡張（最小限に留める）
└── types/
    └── generated/     # Strapi が自動生成する型定義（直接編集禁止）
```

---

## Content Types

| Content Type | 説明 |
|---|---|
| `category` | 作品カテゴリ |
| `work` | ポートフォリオ作品 |
| `work-introduction` | 作品紹介テキスト |
| `control-item` | 3D ビューアの操作説明アイテム |

---

## 参考リンク

- [Strapi ドキュメント](https://docs.strapi.io) - 公式ドキュメント
- [Strapi CLI リファレンス](https://docs.strapi.io/dev-docs/cli) - CLI コマンド一覧
- [Strapi Changelog](https://strapi.io/changelog) - アップデート履歴
- [Strapi GitHub](https://github.com/strapi/strapi)
