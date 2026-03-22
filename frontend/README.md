# frontend

個人ポートフォリオサイトのフロントエンドアプリケーション。  
Next.js 15 (App Router) + Three.js + GSAP で構築しています。

---

## 技術スタック

| パッケージ | バージョン | 用途 |
|---|---|---|
| `next` | 15.5.14 | フレームワーク（App Router） |
| `react` / `react-dom` | ^19 | UI ライブラリ |
| `typescript` | ^5 | 型システム |
| `@mui/material` | ^5.13.1 | UI コンポーネント |
| `@emotion/react` / `@emotion/styled` | ^11.14.0 | MUI スタイルエンジン |
| `gsap` | ^3.14.2 | アニメーション |
| `three` | ^0.183.2 | 3D レンダリング |
| `@react-three/fiber` | ^9 | Three.js の React バインディング |
| `@react-three/drei` | ^10 | Three.js ヘルパー集 |
| `@react-three/postprocessing` | ^3.0.4 | ポストプロセスエフェクト |
| `@supabase/supabase-js` | ^2.99.3 | Supabase クライアント |
| `axios` | ^1.13.6 | HTTP クライアント |
| `sharp` | ^0.34.5 | 画像最適化 |
| **Node.js** | 22.14.0 | ランタイム |
| **pnpm** | >=10.0.0 | パッケージマネージャー |

---

## セットアップ

### 1. パッケージインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env.development` を参考に `.env` ファイルを作成し、各値を設定してください。

```bash
cp .env.development .env
```

| 変数名 | 説明 |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | フロントエンドのベース URL |
| `BASE_URL` | サーバーサイドで使用するベース URL |
| `MY_NAME` | お問い合わせメールの送信者名 |
| `MY_EMAIL` | 送信元・受信先メールアドレス |
| `SENDGRID_API_KEY` | SendGrid API キー |
| `OPEN_WEATHER_API_KEY` | OpenWeatherMap API キー |
| `SUPABASE_URL` | Supabase プロジェクト URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role キー（サーバーサイド専用） |

### 3. 開発サーバー起動

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

---

## スクリプト

| コマンド | 内容 |
|---|---|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | プロダクションビルド |
| `pnpm start` | プロダクションサーバー起動 |
| `pnpm lint` | ESLint 実行 |

---

## ディレクトリ構成

```text
frontend/
├── app/                  # Next.js App Router（ルーティング・Server Components）
│   ├── (pages)/          # Route Groups（URL に影響しないグループ）
│   │   ├── about/
│   │   ├── contact/
│   │   └── works/
│   └── api/              # Route Handlers（サーバーサイド API）
│       ├── getCurrentWeather/
│       ├── sendGridEmail/
│       └── supabase/
├── animations/           # GSAP アニメーション定義（ページ単位で分割）
├── components/           # UI コンポーネント（ドメイン別フォルダ）
│   ├── about/
│   ├── common/
│   ├── contact/
│   ├── home/
│   ├── layout/
│   ├── works/
│   └── world/
├── configs/              # MUI テーマ等の設定
├── constants/            # 定数（用途別ファイル）
├── contexts/             # React Context（グローバル状態管理）
├── hooks/                # 共通カスタムフック
├── public/               # 静的アセット（画像・3D モデル・フォント等）
├── services/             # データ取得関数（Supabase・外部 API）
├── styles/               # CSS Modules（コンポーネント単位のスタイル）
├── types/                # 型定義（用途別ファイル）
└── utils/                # 汎用ユーティリティ関数
```

---

## 参考リンク

### Next.js

- [Next.js ドキュメント](https://nextjs.org/docs) - Next.js の機能と API
- [Learn Next.js](https://nextjs.org/learn) - インタラクティブチュートリアル
- [Next.js GitHub リポジトリ](https://github.com/vercel/next.js)
- [App Router デプロイガイド](https://nextjs.org/docs/app/building-your-application/deploying)

### その他

- [Three.js ドキュメント](https://threejs.org/docs/)
- [React Three Fiber ドキュメント](https://docs.pmnd.rs/react-three-fiber)
- [GSAP ドキュメント](https://gsap.com/docs/v3/)
- [Supabase ドキュメント](https://supabase.com/docs)
