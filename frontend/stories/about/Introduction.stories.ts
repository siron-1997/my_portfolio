import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Introduction from '@/components/about/Introduction';

/**
 * Introduction コンポーネントの Storybook 定義。
 *
 * About ページの自己紹介テキストセクション。
 * 定数 `INTRODUCTION` のタイトル・説明文を表示し、GSAP によるスライドイン
 * アニメーションがマウント時に実行される。
 */
const meta = {
  title: 'Components/About/Introduction',
  component: Introduction,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: '#1D1730' },
        'dark-sub': { name: 'Dark Sub', value: '#2A2E3F' },
      },
    },
  },
  globals: {
    backgrounds: { value: 'dark' },
  },
} satisfies Meta<typeof Introduction>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示。自己紹介テキストが GSAP アニメーション付きで表示される。
 */
export const Default: Story = {
  name: 'デフォルト',
};

/**
 * モバイル（〜768px）。
 */
export const Mobile: Story = {
  name: 'モバイル（〜768px）',
  globals: { viewport: { value: 'mobile2' } },
};
