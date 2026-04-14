---
applyTo: "frontend/**"
---

# Frontend コーディングルール（Next.js 15 App Router）

あなたはフロントエンド専門のエージェントとして、以下の規約を厳守して実装を行ってください。

## 技術スタック

| パッケージ                           | バージョン | 用途                                                                                                                                                                    |
| ------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next`                               | 15.5.14    | フレームワーク（App Router）**※ v15 系に固定（MUI v5 / 他パッケージとの互換性・安定性を優先）。アップグレードは MUI v7 対応と合わせて検討する**                         |
| `react` / `react-dom`                | ^19        | UI ライブラリ                                                                                                                                                           |
| `typescript`                         | ^5         | 型システム                                                                                                                                                              |
| `@mui/material`                      | ^5.13.1    | UI コンポーネント                                                                                                                                                       |
| `@emotion/react` / `@emotion/styled` | ^11.14.0   | MUI スタイルエンジン                                                                                                                                                    |
| `gsap`                               | ^3.14.2    | アニメーション                                                                                                                                                          |
| `three`                              | 0.182.0    | 3D レンダリング **※ r183 で `THREE.Clock` が deprecated され `@react-three/fiber` 内部起因の警告が発生するため v0.182.0 に固定。R3F v10 stable リリース時に再評価する** |
| `@types/three`                       | 0.182.0    | three.js 型定義（devDependency）**※ three に合わせて固定**                                                                                                              |
| `@react-three/fiber`                 | ^9         | Three.js の React バインディング                                                                                                                                        |
| `@react-three/drei`                  | ^10        | Three.js ヘルパー集                                                                                                                                                     |
| `@react-three/postprocessing`        | ^3.0.4     | ポストプロセスエフェクト                                                                                                                                                |
| `leva`                               | 0.10.1     | 3D デバッグ UI（開発環境のみ使用）                                                                                                                                      |
| `r3f-perf`                           | 7.2.3      | R3F パフォーマンスモニター（開発環境のみ使用）                                                                                                                          |
| `@supabase/supabase-js`              | ^2.99.3    | Supabase クライアント                                                                                                                                                   |
| `axios`                              | ^1.13.6    | HTTP クライアント                                                                                                                                                       |
| `classnames`                         | ^2.5.1     | 条件付きクラス名結合                                                                                                                                                    |
| `sharp`                              | ^0.34.5    | 画像最適化                                                                                                                                                              |
| **Node.js**                          | 22.14.0    | ランタイム                                                                                                                                                              |
| **pnpm**                             | >=10.0.0   | パッケージマネージャー                                                                                                                                                  |

## JSDoc ルール

コード内のコメントは、宣言直上・ブロック内部・インラインを問わず**すべて JSDoc 形式（`/** \*/`）で統一する**。`//` による行コメントは使用しない。本ルールは関数・型・Props・定数のすべてに適用する。

- **タイトル**: 1行目に簡潔な概要。
- **説明**: 2行目以降に詳細な仕様（なぜその処理が必要か等）。
- **@param**: 引数名、型、説明を記述。
- **@returns**: 戻り値の型、説明を記述。
- **@example**: 処理が複雑な場合や特定のコンテキストで使われる場合は必ず使用例を記述。
- **型・Props・定数の各プロパティ**: 宣言の直上に全体の概要を JSDoc で記述し、各プロパティにもインライン JSDoc を付ける。プロパティ間は空行で区切る。
- **インライン補足**: ブロック内の補足は `/** 説明 */` で記述する。

```ts
/**
 * 要素をフェードインさせるアニメーション。
 * GSAP を使用して不透明度 0 から 1 へ変化させる。
 *
 * @param {HTMLElement} target - アニメーション対象の DOM 要素
 * @param {number} [duration=0.5] - アニメーションにかける秒数
 * @returns {gsap.core.Tween} GSAP のトゥイーンオブジェクト
 *
 * @example
 * const tween = fadeIn(element, 1.2);
 */
export const fadeIn = (
  target: HTMLElement,
  duration: number = 0.5,
): gsap.core.Tween => {
  /** GSAP の fromTo でフェードインアニメーションを実行する */
  return gsap.fromTo(target, { opacity: 0 }, { opacity: 1, duration });
};
```

## ディレクトリ構成

```text
frontend/
├── app/              # Next.js App Router（ルーティング・Server Components）
│   ├── (pages)/      # Route Groups（URL に影響しないグループ）
│   └── api/          # Route Handlers（サーバーサイド API）
├── animations/       # GSAP アニメーション定義（ページ単位で分割）
├── components/       # UI コンポーネント（ドメイン別フォルダ）
├── configs/          # MUI テーマ・環境変数バリデーション等の設定
├── constants/        # 定数（UPPER_SNAKE_CASE、用途別ファイル）
├── contexts/         # React Context（グローバル状態管理）
├── hooks/            # 共通カスタムフック
├── services/         # データ取得関数（Server Components から呼び出す fetch ロジック）
├── styles/           # CSS Modules（コンポーネント単位のスタイル）
├── types/            # 型定義（api.ts, common.ts など用途別）
└── utils/            # 汎用ユーティリティ関数
```

## コンポーネント設計

### 1. サーバー/クライアントの境界 (Server/Client Components)

- **Data Fetching**: 原則として `app/` 配下の Server Components で行い、Client Components へ Props を流し込む。
- **Client Boundary**: MUI、GSAP、Three.js を含むコンポーネントは最小単位の「Leaf Component」として切り出し、`"use client"` を付与する。ツリーの上位は可能な限り Server Component を維持すること。

### 2. ファイル構成パターン

コンポーネントのファイル構成は、ロジックの複雑さに応じて以下のいずれかを選択する。

**シンプルパターン（単一ファイル）**： `useXxx` フックが不要な場合（ref + 単純な useEffect・cn・定数のみ）に使用する。統合後のファイルが 500 行未満であることを目安とする。

```text
ComponentName.tsx   # UI + ロジックをまとめて記述（親フォルダへ直接配置）
```

**ディレクトリパターン（フック分離）**： ロジックが複雑で独立した `useXxx` フックの価値がある場合に使用する。具体的には、`useState` による状態管理・複数の `useCallback`/`useMemo`・複雑な副作用・多数の返り値 などを持つ場合が該当する。

```text
ComponentName/
├── ComponentName.tsx   # UI レンダリング（ロジックは持たない）
├── useComponentName.ts # コンポーネント固有ロジック（カスタムフック）
└── index.ts            # export { default as ComponentName } from './ComponentName'
```

**どちらを選ぶか判断基準**：

| 条件                                       | パターン     |
| ------------------------------------------ | ------------ |
| ref + 1 つの useEffect（アニメーション等） | シンプル     |
| cn・useIconSize など派生値の計算のみ       | シンプル     |
| useState を持つ / 複数の useCallback       | ディレクトリ |
| useMemo で複雑な計算を行う                 | ディレクトリ |
| フックの行数が約 50 行を超える             | ディレクトリ |

- Props の型はコンポーネントファイル内で `type Props = { ... }` として定義する。JSDoc ルールに従い、型の直上と各プロパティにコメントを付け、プロパティ間は空行で区切る。

```ts
/**
 * カードコンポーネントの Props。
 * 作品一覧とホームの両方で使用する汎用カード。
 */
type Props = {
  /** カード画像の URL */
  image?: string;

  /** 遷移先のリンク */
  link?: string;

  /** 画像の代替テキスト */
  alt?: string;

  /** 作品タイトル */
  title: string;

  /** 作品の概要テキスト */
  description: string;

  /** カテゴリ名 */
  categoryType: string;

  /** 表示コンテキスト（作品一覧 or ホーム） */
  type: "work" | "home";
};
```

### 3. インポートエイリアス

- **基本原則**: プロジェクトルートからの絶対パスを示す `@/*` エイリアスを常に使用すること。
- **禁止事項**: `../` や `../../` を用いた相対パスによるインポートは、階層が深くなり可読性を損なうため禁止する。

```ts
// ✅ Good: エイリアスを使用して構造を明確にする
import { Button } from "@/components/common/Button";
import { useWorks } from "@/hooks/useWorks";
import { COLORS } from "@/constants/colors";

// ❌ Bad: 階層が不明瞭になり、ファイル移動時の修正コストが高い
import { Button } from "../../../components/common/Button";
import { useWorks } from "../../hooks/useWorks";
```

## スタイリング

- **技術スタック**: CSS Modules（`.module.css`）と `classnames`（`cn`）を組み合わせて使用する。
- **配置**: スタイルファイルは `styles/` ディレクトリに配置し、コンポーネント階層に合わせてサブフォルダへ整理する。
- **MUI の拡張**: MUI コンポーネントに CSS Modules を適用する場合は、`className` prop を使用して上書きを行う。
- **クラス名の命名規則**: 単語を `_` で区切る `snake_case` で記述する。`camelCase` や `kebab-case` は使用しない。

```css
/* ✅ Good */
.work_container { ... }
.card_media { ... }
.input_text_field { ... }

/* ❌ Bad */
.workContainer { ... }
.card-media { ... }
```

```ts
import cn from "classnames";
import s from "@/styles/works/WorkContainer.module.css";

/** アクティブ状態に応じてクラスを切り替える */
const classNames = cn(s.work_container, {
  [s.work_container_active]: isActive,
});
```

## 状態管理（React Context）

- **グローバル状態**: アプリケーション全体や大きな機能単位で共有が必要な状態は `contexts/` 内の React Context API で管理する。
- **実装パターン**: `Context + Provider + カスタムフック (useXxxContext)` の 3 点セットで実装すること。
- **安全な利用**: `useContext` を直接コンポーネントで呼び出さず、内部で `undefined` チェックを持つラッパーフックを提供・使用すること。これにより、Provider 外での誤用を早期に検知する。
- **状態の複雑さによる使い分け**: 管理する状態が少なく単純な場合は `useState` を使用する。状態の数が多い・状態同士に依存関係がある・遷移パターンが複雑な場合は `useReducer` を採用し、Context には state と dispatch のみを公開する（個別の setter を外部に露出しない）。

```ts
/**
 * 作品データに関するコンテキストを利用するためのカスタムフック
 *
 * WorksProvider 内で使用される必要がある。
 *
 * @returns {WorksContextType} 作品データの状態と操作関数
 * @throws {Error} WorksProvider 外で使用された場合にエラーを投げる
 */
export const useWorksContext = () => {
  const context = useContext(WorksContext);
  if (!context) {
    throw new Error("useWorksContext must be used within a WorksProvider");
  }
  return context;
};
```

## パフォーマンス最適化

### React.memo

- **適用条件**: `map` によるリスト描画の各アイテムコンポーネント・Three.js コンポーネントなど、同じ Props で繰り返しレンダリングされるコンポーネントに適用する。
- **不適用**: Props が毎回変わるコンポーネント、または描画コストが極めて低い単純コンポーネント。

```tsx
/** リスト描画の各アイテムは親の再レンダリングで不要な更新が生じるため memo でラップする */
export const WorkCard = React.memo(({ title, image, link }: Props) => {
  return <Card>...</Card>;
});
```

### useMemo

- **Context value のメモ化（必須）**: `Provider` の `value` に渡すオブジェクトは必ず `useMemo` でメモ化する。メモ化しない場合、state 変化のたびにオブジェクトが再生成され、Consumer 全体が不要な再レンダリングを起こす。
- **高コスト計算**: Three.js ジオメトリ生成・配列変換・フィルタリング等、計算コストが高い処理に適用する。

```tsx
/** value を useMemo でメモ化し、state 変化時以外の Consumer 再レンダリングを防ぐ */
const value = useMemo(() => ({ state, dispatch }), [state]);

return <WorksContext.Provider value={value}>{children}</WorksContext.Provider>;
```

### useCallback

- **適用条件**:
  1. `React.memo` でラップされたコンポーネントへ渡す関数 Props。
  2. Context を通じて Consumer に公開する関数。
  3. `useEffect` / `useMemo` の依存配列に含まれる関数。
- **不適用**: 上記に該当しない場合は過剰な最適化になるため使用しない。

```ts
/** React.memo 済みの子コンポーネントへ渡すためメモ化する */
const handleSelect = useCallback(
  (id: number) => {
    dispatch({ type: "SELECT_ITEM", payload: id });
  },
  [dispatch],
);
```

## React フック記述順序

コンポーネント内のフックは以下の順序で記述する。フック呼び出しの順序を統一することで可読性を高め、副作用の依存関係を見つけやすくする。

```
1. useRef / useContext / useReducer  （外部依存なしの状態・参照）
2. useState                          （ローカル状態）
3. カスタムフック                      （useXxx）
4. useMemo / useCallback             （派生値・メモ化関数）
5. useEffect                         （副作用） ← JSX の直上に配置
6. return (...)                      （JSX）
```

- **`useEffect` は必ず `return` の直上にまとめて配置する**。`useMemo` や `useCallback` と混在させない。
- `useFrame`（R3F）は `useEffect` と同じ副作用レイヤーとして扱い、`useEffect` の直前に配置する。
- 複数の `useEffect` がある場合は関連性の薄いものから順に並べ、最も「天気・状態の同期」など外部条件に反応するものを最後（JSX の直前）に置く。

## 定数

- **命名**: 全べて `UPPER_SNAKE_CASE` で記述する。
- **管理**: `constants/` ディレクトリ内に `colors.ts`, `common.ts`, `api.ts` 等のファイルを作成して管理する。

```ts
/** ブレークポイント（px）。レスポンシブ分岐に使用する */
export const BREAK_POINTS = {
  XS: 768,
  SM: 1024,
  LG: 1280,
  XL: 1536,
} as const;

/**
 * 現在地のデフォルト座標（東京駅）
 *
 * @description 位置情報の共有が許可されなかった場合のフォールバック値
 */
export const DEFAULT_COORDINATES = {
  latitude: 35.681236,
  longitude: 139.767125,
} as const;
```

## 型定義

- **集約**: すべての型定義は `types/` ディレクトリに配置する。
- **型安全**: `any` の使用は厳禁。不明な型は `unknown` とし、型ガードを用いて安全に処理する。
- **ファイル分割**: API レスポンス型は `types/api.ts`、Context 型は `types/contexts.ts` のように用途別に分ける。
- **明示**: 公開 API、Props、関数の戻り値には必ず型を明示する。

```ts
/**
 * お問い合わせフォームの入力・検証・送信状態をまとめた型。
 * ContactFormContext で保持し、dispatch を通じて更新する。
 */
export type ContactFormContextType = {
  /** 入力者の名前 */
  name: string;

  /** 入力者のメールアドレス */
  email: string;

  /** お問い合わせ本文 */
  message: string;

  /** 名前が入力済みかどうか（バリデーションフラグ） */
  isNotNameEmpty: boolean;

  /** メールアドレスが有効な形式かどうか（バリデーションフラグ） */
  isNotEmailValid: boolean;

  /** メールアドレスのエラーメッセージ */
  emailErrorMessage: string;

  /** メッセージが入力済みかどうか（バリデーションフラグ） */
  isNotMessageEmpty: boolean;

  /** メール送信処理中かどうか */
  isSending: boolean;

  /** 送信結果。undefined: 未送信 / true: 成功 / false: 失敗 */
  isSended: boolean | undefined;

  /** フォームの現在のステップ */
  formStep: FormStep;

  /** バリデーションエラーが存在するかどうか */
  isValidationError: boolean;

  /** 初回バリデーションチェックが実施済みかどうか */
  isInitialValidationCheck: boolean;

  /** Context の状態を更新するための dispatch 関数 */
  dispatch: React.Dispatch<ContactFormAction>;
};
```

## フォント

- **読み込み**: `next/font/local` を使用して最適化する。
- **適用**: CSS 変数（`--font-xxx`）として定義し、スタイルシートから参照可能にする。
- **アセット**: フォントの実体ファイルは `public/fonts/` に配置する。

```ts
/** app/layout.tsx でのフォント定義 */
import localFont from "next/font/local";

const notoSansJP = localFont({
  src: [
    {
      path: "../public/fonts/Noto_Sans_JP/NotoSansJP-Regular.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/Noto_Sans_JP/NotoSansJP-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-noto-sans-jp",
  display: "swap",
});
```

```css
/* CSS Modules または globals.css での参照 */
.body {
  font-family: var(--font-noto-sans-jp), sans-serif;
}
```

## インポート規約

インポートの順序・グループ分けは `eslint-plugin-simple-import-sort` によって自動強制・自動整列される（保存時 ESLint auto-fix で適用）。記述順と空行の挿入は以下のルールに従うこと。

### グループ順序（上から下へ）

```
1. 副作用インポート（CSS・フォント等）
2. React / Next.js（フレームワーク）
3. 外部パッケージ（npm / @スコープパッケージ。ただし @/ は除く）
4. 内部エイリアス（@/ プレフィックス）
5. 相対インポート（./・../）
```

### ルール

- 各グループの間は**必ず空行 1 行**で区切る。
- 同一グループ内はアルファベット順に並べる。
- 型のみのインポートは `import type { Foo }` ではなく `import { type Foo }` のインライン形式を使用する（`@typescript-eslint/consistent-type-imports` による強制）。
- import 並び順は保存時に ESLint auto-fix が自動整列するため、手動でのソートは不要。

```ts
/** 副作用 */
import "@/styles/globals.css";

/** React / Next.js */
import { useCallback, useMemo } from "react";
import Image from "next/image";

/** 外部パッケージ */
import axios from "axios";
import { Canvas } from "@react-three/fiber";

/** 内部エイリアス（@/） */
import { Button } from "@/components/common";
import { type WorkItem } from "@/types/api";

/** 相対パス */
import { helper } from "./utils";
```

## デバッグ・動作確認（Playwright MCP）

フロントエンドのデバッグ・動作確認は **VS Code に設定された Playwright MCP 経由**で行う。
ブラウザを直接操作するのではなく、以下の MCP ツールを積極的に使用すること。

### 優先する確認手順

1. `mcp_playwright_browser_navigate` でページを開く
2. `mcp_playwright_browser_console_messages` でコンソールエラー・警告を確認する
3. `mcp_playwright_browser_take_screenshot` でスクリーンショットを取得してビジュアル確認する
4. `mcp_playwright_browser_snapshot` で DOM 構造を確認する
5. `mcp_playwright_browser_network_requests` でネットワークリクエストを確認する

### 確認が必要な状況

| 状況                             | 使用ツール                        |
| -------------------------------- | --------------------------------- |
| コンソールエラー・警告の調査     | `console_messages`                |
| 画像・スタイルの崩れ確認         | `take_screenshot`                 |
| API レスポンス・404 の確認       | `network_requests`                |
| DOM 構造・アクセシビリティ確認   | `snapshot`                        |
| フォーム入力・ボタン操作のテスト | `click`, `fill_form`, `press_key` |
| ページ遷移の動作確認             | `navigate`, `navigate_back`       |

### 注意事項

- 初回使用時に Chromium が未インストールの場合は `mcp_playwright_browser_install` を実行する。
- Playwright ブラウザのコンソールログは `.playwright-mcp/` ディレクトリに保存される（git 管理外）。
- `mcp.json` の `playwright` サーバーは `--browser chromium` オプションで起動している。
