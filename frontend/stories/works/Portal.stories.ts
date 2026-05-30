import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Portal from '@/components/works/Portal';

/**
 * Portal コンポーネントの Storybook 定義（works 一覧ページ用）。
 *
 * 作品一覧ページのエントリーポイントに表示する大見出しコンポーネント。
 * マウント時に GSAP によるテキストアニメーションが実行される。
 */
const meta = {
  title: 'Components/Works/Portal',
  component: Portal,
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
  argTypes: {
    title: {
      control: 'text',
      description: 'ポータルに表示するタイトル文字列',
      table: { type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof Portal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト。「Works」タイトルを表示する。
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {
    title: 'Works',
  },
};

/**
 * 長いタイトルの場合の表示。
 */
export const LongTitle: Story = {
  name: '長いタイトル',
  args: {
    title: 'Works & Projects',
  },
};
