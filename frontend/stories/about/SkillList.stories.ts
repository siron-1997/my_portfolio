import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SkillList from '@/components/about/SkillList';

/**
 * SkillList コンポーネントの Storybook 定義。
 *
 * About ページのスキル一覧セクション。
 * カテゴリごとにスキルアイコンをグリッドで表示する。
 * ウィンドウ幅に応じて 1 行あたりのアイコン数（チャンクサイズ）が変わる
 * レスポンシブレイアウトを持つ。
 * GSAP によるフェードインアニメーションがマウント時に実行される。
 */
const meta = {
  title: 'Components/About/SkillList',
  component: SkillList,
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
} satisfies Meta<typeof SkillList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デスクトップ（1280px 以上）。
 */
export const Desktop: Story = {
  name: 'デスクトップ（1280px〜）',
};

/**
 * タブレット（768px〜1024px）。
 */
export const Tablet: Story = {
  name: 'タブレット（768px〜）',
  globals: { viewport: { value: 'tablet' } },
};

/**
 * モバイル（〜768px）。1 行に全スキルを縦並びで表示。
 */
export const Mobile: Story = {
  name: 'モバイル（〜768px）',
  globals: { viewport: { value: 'mobile2' } },
};
