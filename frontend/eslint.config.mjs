import { FlatCompat } from '@eslint/eslintrc';

/** FlatCompat: ESLint 9 Flat Config から旧来の extends 形式を利用するためのブリッジ */
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    rules: {
      /** useEffect / useCallback / useMemo の依存配列漏れを警告する */
      'react-hooks/exhaustive-deps': 'warn',
      /** アンダースコアプレフィックスの変数は意図的な未使用となるため除外する */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
];

export default eslintConfig;
