# portfolio_v2

Webエンジニア個人ポートフォリオサイトのモノレポです。  
Next.js 15 + Strapi v5 + Supabase で構成されています。

---

## システム構成

```
portfolio_v2/
├── frontend/   # Next.js 15 (App Router) - フロントエンド
├── backend/    # Strapi v5 - ヘッドレス CMS (コンテンツ管理)
└── supabase/   # Supabase - DB / Storage / Edge Functions
```

### アーキテクチャ概要

```
ブラウザ
  └─ Next.js (frontend)
        ├─ Supabase    : works・カテゴリ等のデータ取得（View 経由）
        ├─ Strapi      : コンテンツ管理 API
        ├─ SendGrid    : お問い合わせメール送信
        └─ OpenWeather : 天気情報取得（3D ワールド連携）
```

---

## 技術スタック

| 領域                   | 技術           | バージョン    |
| ---------------------- | -------------- | ------------- |
| フロントエンド         | Next.js        | 15.5.14       |
| フロントエンド         | React          | ^19           |
| フロントエンド         | TypeScript     | ^5            |
| フロントエンド         | Three.js / R3F | ^0.183.2 / ^9 |
| フロントエンド         | GSAP           | ^3.14.2       |
| フロントエンド         | MUI            | ^5.13.1       |
| バックエンド           | Strapi         | 5.13.0        |
| バックエンド           | PostgreSQL     | -             |
| インフラ               | Supabase       | -             |
| ランタイム             | Node.js        | 22.14.0       |
| パッケージマネージャー | pnpm           | >=10.0.0      |

---

## 各パッケージのセットアップ

各ディレクトリ内の README を参照してください。

- [frontend/README.md](./frontend/README.md)
- [backend/README.md](./backend/README.md)

---

## 開発ポート一覧

| サービス        | URL                         |
| --------------- | --------------------------- |
| フロントエンド  | http://localhost:3000       |
| Strapi Admin    | http://localhost:1337/admin |
| Supabase Studio | http://localhost:54323      |

---

## 環境変数

各パッケージに `.env` ファイルが必要です。  
テンプレートを参考に値を設定してください。

| パッケージ  | テンプレートファイル               |
| ----------- | ---------------------------------- |
| `frontend/` | `frontend/.env.development`        |
| `backend/`  | `backend/.env` （Strapi 自動生成） |

---

## ブランチ戦略

| ブランチ    | 用途             |
| ----------- | ---------------- |
| `main`      | 本番環境         |
| `develop`   | 開発統合ブランチ |
| `feature/*` | 機能開発         |
| `fix/*`     | バグ修正         |

---

## 参考リンク

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Strapi ドキュメント](https://docs.strapi.io)
- [Supabase ドキュメント](https://supabase.com/docs)
- [Three.js ドキュメント](https://threejs.org/docs/)
- [React Three Fiber ドキュメント](https://docs.pmnd.rs/react-three-fiber)
- [GSAP ドキュメント](https://gsap.com/docs/v3/)
