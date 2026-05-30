import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ProfileImage from '@/components/about/ProfileImage';

/**
 * ProfileImage コンポーネントの Storybook 定義。
 *
 * About ページのプロフィール画像コンポーネント。
 * Next.js Image を使用した `fill` レイアウトのプロフィール写真を表示し、
 * GSAP によるフェードインアニメーションがマウント時に実行される。
 */
const meta = {
  title: 'Components/About/ProfileImage',
  component: ProfileImage,
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
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '400px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProfileImage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示。プロフィール画像が fill レイアウトでレンダリングされる。
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
