'use client';

import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { theme as baseTheme } from '@/configs/theme';

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
