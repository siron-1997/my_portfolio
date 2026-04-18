'use client';

import { JSX, useMemo } from 'react';

import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { theme as baseTheme } from '@/configs/theme';

type ThemeProviderWrapperProps = {
  children: React.ReactNode;
  notoSansJP: { variable: string };
  roboto: { variable: string };
};

/**
 * MUI テーマプロバイダー
 * App Router の SSR/Client 間で Emotion の CSS が二重挿入されないよう
 * AppRouterCacheProvider でキャッシュを統一し、Hydration mismatch を防ぐ。
 *
 * @param children - ラップ対象の子要素
 * @param notoSansJP - Noto Sans JP フォントの CSS 変数オブジェクト
 * @param roboto - Roboto フォントの CSS 変数オブジェクト
 * @returns テーマ適用済みのラップ済み JSX
 */
export default function ThemeProviderWrapper({
  children,
  notoSansJP,
  roboto,
}: ThemeProviderWrapperProps): JSX.Element {
  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        typography: {
          ...baseTheme.typography,
          fontFamily: `${notoSansJP.variable}, ${roboto.variable}, 'Noto Sans JP', 'Roboto', 'sans-serif'`,
        },
      }),
    [notoSansJP.variable, roboto.variable],
  );

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
