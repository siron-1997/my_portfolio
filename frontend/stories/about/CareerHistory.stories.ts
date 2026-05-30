import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import CareerHistory from '@/components/about/CareerHistory';

/**
 * CareerHistory コンポーネントの Storybook 定義。
 *
 * About ページの職務・学歴タイムライン。
 * MUI `Timeline` を使用して経歴を時系列に表示する。
 * ウィンドウ幅が `BREAK_POINTS.XS`（768px）未満のモバイルでは年代カラムを非表示にする。
 * GSAP による各タイムラインアイテムのスライドインアニメーションが実行される。
 */
const meta = {
  title: 'Components/About/CareerHistory',
  component: CareerHistory,
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
} satisfies Meta<typeof CareerHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デスクトップ（768px 以上）。年代カラムが表示された PC レイアウト。
 */
export const Desktop: Story = {
  name: 'デスクトップ（768px〜）',
};

/**
 * モバイル（〜768px）。年代カラムが非表示になるモバイルレイアウト。
 */
export const Mobile: Story = {
  name: 'モバイル（〜768px）',
  globals: { viewport: { value: 'mobile2' } },
};
