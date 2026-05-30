import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Portal from '@/components/about/Portal';

/**
 * Portal（About）コンポーネントの Storybook 定義。
 *
 * About ページのヒーローセクションに表示するページタイトル見出し。
 * `title` を `<h1>` として中央揃えで描画し、GSAP によるフェードイン
 * アニメーションがマウント時に実行される。
 */
const meta = {
  title: 'Components/About/Portal',
  component: Portal,
  parameters: {
    layout: 'centered',
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
      description: 'ポータルに表示するページタイトル',
      table: { type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof Portal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示。「About」タイトルが中央に表示される。
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {
    title: 'About',
  },
};

/**
 * 長いタイトル文字列のケース。
 */
export const LongTitle: Story = {
  name: 'タイトル長文',
  args: {
    title: 'About My Career & Skills',
  },
};
