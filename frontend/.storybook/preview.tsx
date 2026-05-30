import '@/styles/globals.css';

import React from 'react';

import { ThemeProvider } from '@mui/material/styles';
import type { Preview } from '@storybook/nextjs-vite';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';

import { theme } from '@/configs/theme';

const customViewports = {
  desktop: {
    name: 'Desktop（1024px〜）',
    styles: { width: '1024px', height: '768px' },
    type: 'desktop' as const,
  },
  desktopXl: {
    name: 'Desktop XL（1280px〜）',
    styles: { width: '1280px', height: '800px' },
    type: 'desktop' as const,
  },
  desktopXxl: {
    name: 'Desktop 2XL（1536px〜）',
    styles: { width: '1536px', height: '900px' },
    type: 'desktop' as const,
  },
};

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    viewport: {
      options: { ...MINIMAL_VIEWPORTS, ...customViewports },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
