'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { theme as baseTheme } from '@/configs/theme';

/**
 * MUI テーマプロバイダーラッパー。
 * App Router の SSR/Client 間で Emotion の CSS が二重挿入されないよう
 * AppRouterCacheProvider でキャッシュを統一し、Hydration mismatch を防ぐ。
 *
 * @param children - ラップ対象の子要素
 * @param notoSansJP - Noto Sans JP フォントの CSS 変数オブジェクト
 * @param roboto - Roboto フォントの CSS 変数オブジェクト
 */
export default function ThemeProviderWrapper({
  children,
  notoSansJP,
  roboto,
}: {
  children: React.ReactNode;
  notoSansJP: { variable: string };
  roboto: { variable: string };
}) {
  const theme = createTheme({
    ...baseTheme,
    typography: {
      ...baseTheme.typography,
      fontFamily: `${notoSansJP.variable}, ${roboto.variable}, 'Noto Sans JP', 'Roboto', 'sans-serif'`,
    },
  });

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
