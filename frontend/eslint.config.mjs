import { FlatCompat } from '@eslint/eslintrc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/** FlatCompat: ESLint 9 Flat Config から旧来の extends 形式を利用するためのブリッジ */
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      /**
       * useEffect / useCallback / useMemo の依存配列漏れをエラーとして検出する。
       * VSCode で未保存のままでも赤波線が表示される。
       */
      'react-hooks/exhaustive-deps': 'error',

      /** アンダースコアプレフィックスの変数は意図的な未使用となるため除外する */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      /**
       * 型のみのインポートは import type を使用することを強制する。
       * バンドルサイズの最適化とインポート意図の明確化のため。
       */
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      /**
       * console.log などの本番コードへの混入を警告する。
       * console.error / console.warn は許容する。
       */
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      /**
       * import 文をアルファベット順で自動整列する。
       * グループ順: 副作用 → React/Next → 外部パッケージ → @/ エイリアス → 相対パス
       */
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // 副作用インポート（CSS など）
            ['^\\u0000'],
            // React / Next.js（フレームワークを先頭に）
            ['^react$', '^react/', '^react-dom', '^next$', '^next/'],
            // 外部パッケージ（@スコープ含む。ただし @/ は除く）
            ['^(?!@/)@?\\w'],
            // 内部エイリアス（@/ プレフィックス）
            ['^@/'],
            // 相対インポート
            ['^\\.'],
          ],
        },
      ],

      /** export 文もアルファベット順に整列する */
      'simple-import-sort/exports': 'warn',
    },
  },
];

export default eslintConfig;
