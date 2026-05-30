import React, { useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Portal from '@/components/works/workThreeD/Portal';
import { type WorkDetail } from '@/types/api';

/** Portal コンポーネントで使用するサンプル作品データ */
const sampleContent: WorkDetail = {
  id: 1,
  key: 'symphony',
  title: 'Symphony',
  description:
    '気象情報APIと3D UIを連携したインタラクティブなWeb表現。Three.jsとGSAPを活用。',
  slug: 'symphony',
  created_at: '2024-01-01T00:00:00Z',
  introduction_title: '3D インタラクティブ表現',
  introduction_description:
    'Three.jsとGSAPを活用した3Dインタラクティブな作品。',
  controls_title: '操作パネル',
  controls_description:
    'モデルの各部位をクリックしてアニメーションを確認できます。',
  controls: [],
};

/**
 * Portal（workThreeD）コンポーネントのラッパー。ref を注入して表示する。
 */
const PortalWithRef = ({ isLoading }: { isLoading: boolean }) => {
  const portalRef = useRef<HTMLElement | null>(null);
  return (
    <Portal
      content={sampleContent}
      portalRef={portalRef}
      isLoading={isLoading}
    />
  );
};

/**
 * Portal（workThreeD）コンポーネントの Storybook 定義。
 *
 * 3D 作品詳細ページの 3D Canvas が表示される背景セクション。
 * isLoading が false になったとき GSAP によるフェードインアニメーションが実行される。
 * 実際の使用時は Three.js Canvas がこのセクションの背後に fixed で重なる。
 */
const meta = {
  title: 'Components/Works/WorkThreeD/Portal',
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
    content: { control: false, table: { disable: true } },
    portalRef: { control: false, table: { disable: true } },
    isLoading: {
      control: 'boolean',
      description:
        '3D モデルのロード中フラグ。false でアニメーションが初期化される',
      table: { type: { summary: 'boolean' } },
    },
  },
} satisfies Meta<typeof Portal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ロード完了後。タイトルと説明文が表示される。
 */
export const Loaded: Story = {
  name: 'ロード完了',
  render: () => <PortalWithRef isLoading={false} />,
};

/**
 * ロード中。アニメーションが未実行の状態。
 */
export const Loading: Story = {
  name: 'ロード中',
  render: () => <PortalWithRef isLoading={true} />,
};
