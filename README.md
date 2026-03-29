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

## セットアップ

### 前提条件

| ツール | バージョン | 備考 |
| --- | --- | --- |
| Node.js | 22.14.0 | `.nvmrc` 対応。`nvm use` で切り替え可 |
| pnpm | >=10.0.0 | `npm install -g pnpm` |
| Supabase CLI | 最新 | `brew install supabase/tap/supabase` |

### 手順

#### 1. VS Code 拡張機能のインストール

> **注意**: GitHub Copilot は MCP サーバー連携および AI エージェント機能に必須です。

VS Code のコマンドパレット（`Ctrl+Shift+P`）で `Extensions: Show Recommended Extensions`
を実行すると推奨一覧が表示されます。「ワークスペースの推奨」タブで一括インストールできます。

| 拡張機能 ID | 名前 | 用途 |
| --- | --- | --- |
| `github.copilot` | GitHub Copilot | AI コード補完（**MCP必須**） |
| `github.copilot-chat` | GitHub Copilot Chat | AI エージェント・コードレビュー（**MCP必須**） |
| `esbenp.prettier-vscode` | Prettier | コードフォーマッター |
| `dbaeumer.vscode-eslint` | ESLint | リンター |
| `denoland.vscode-deno` | Deno | Supabase Edge Functions 開発時の型検査 |

#### 2. 依存関係のインストール

```bash
cd frontend && pnpm install
cd ../backend && pnpm install
```

#### 2. 環境変数の設定

```bash
# アプリケーション用
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# VS Code MCP サーバー用（ルート直下）
cp .env.portfolio.example .env.portfolio
cp .env.portfolio-test.example .env.portfolio-test
cp .env.supabase.example .env.supabase
cp .env.figma.example .env.figma
```

各ファイルを開いて実際の値を設定してください。詳細は **環境変数** セクションを参照。

#### 3. Supabase マイグレーションの適用

`supabase/migrations/` 内の SQL ファイルを本番プロジェクトに適用します。

```bash
# Supabase CLI でリモートプロジェクトに push
supabase db push --project-ref <project-ref>
```

または Supabase MCP を使って各マイグレーションファイルを実行してください。

#### 4. 各サービスの起動

**VS Code タスクで同時起動（推奨）:**

VS Code のコマンドパレット（`Ctrl+Shift+P`）で `Tasks: Run Task` を選び、
`start-my-portfolio` を実行すると Strapi と Next.js が同時に起動します。

**手動起動:**

```bash
# ターミナル 1: Strapi
cd backend && pnpm dev

# ターミナル 2: Next.js
cd frontend && pnpm dev
```

---

## 各パッケージの詳細

- [frontend/README.md](./frontend/README.md) - Next.js フロントエンド
- [backend/README.md](./backend/README.md) - Strapi CMS

---

## 開発ポート一覧

| サービス        | URL                         |
| --------------- | --------------------------- |
| フロントエンド  | http://localhost:3000       |
| Strapi Admin    | http://localhost:1337/admin |
| Supabase Studio | http://localhost:54323      |

---

## 環境変数

### アプリケーション用

各パッケージに `.env` ファイルが必要です。  
テンプレートを参考に値を設定してください。

| パッケージ  | テンプレートファイル      |
| ----------- | ------------------------- |
| `frontend/` | `frontend/.env.example`   |
| `backend/`  | `backend/.env.example`    |

### VS Code MCP サーバー用（ルート直下）

VS Code の GitHub Copilot MCP サーバーが使用するトークンファイルです。  
各 `.example` ファイルをコピーして実際のトークン値を設定してください。  
すべてのトークンファイルは `.gitignore` により git 管理外です。

| 実ファイル            | テンプレート                  | 用途                             | トークン取得先                                               |
| --------------------- | ----------------------------- | -------------------------------- | ------------------------------------------------------------ |
| `.env.portfolio`      | `.env.portfolio.example`      | GitHub MCP（本リポジトリ用）     | GitHub → Settings → Developer settings → Fine-grained tokens |
| `.env.portfolio-test` | `.env.portfolio-test.example` | GitHub MCP（テストリポジトリ用） | 同上（参照専用）                                             |
| `.env.supabase`       | `.env.supabase.example`       | Supabase MCP                     | Supabase ダッシュボード → Account → Access Tokens            |
| `.env.figma`          | `.env.figma.example`          | Figma MCP                        | Figma → Account Settings → Personal access tokens            |

```bash
# セットアップ例
cp .env.portfolio.example .env.portfolio
cp .env.portfolio-test.example .env.portfolio-test
cp .env.supabase.example .env.supabase
cp .env.figma.example .env.figma
# 各ファイルを開いてトークン値を入力する
```

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
