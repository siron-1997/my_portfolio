import React, { useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Portal from '@/components/home/Portal';

/**
 * Portal（Home）コンポーネントのラッパー。ref を注入して表示する。
 */
const PortalWithRef = ({ isCanvasReady }: { isCanvasReady: boolean }) => {
  const portalRef = useRef<HTMLDivElement | null>(null);
  return <Portal portalRef={portalRef} isCanvasReady={isCanvasReady} />;
};

/**
 * Portal（Home）コンポーネントの Storybook 定義。
 *
 * Home ページのヒーローセクション。サイト名タイトルを大きく表示する。
 * `isCanvasReady` が `true` になると GSAP の ScrollTrigger によるフェード＋
 * パララックスアニメーションが実行される。
 * 実際の使用時は Three.js World Canvas がこのセクションの背後に重なる。
 *
 * > **注意**: Storybook 上では Three.js Canvas は表示されません。
 */
const meta = {
  title: 'Components/Home/Portal',
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
    portalRef: { control: false, table: { disable: true } },
    isCanvasReady: {
      control: 'boolean',
      description:
        'Canvas の準備完了フラグ。true でアニメーションが初期化される',
      table: { type: { summary: 'boolean' } },
    },
  },
} satisfies Meta<typeof Portal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Canvas 準備完了。アニメーション初期化済みの通常表示。
 */
export const CanvasReady: Story = {
  name: 'Canvas 準備完了',
  render: () => <PortalWithRef isCanvasReady={true} />,
};

/**
 * Canvas 未準備。アニメーション未実行の初期状態。
 */
export const CanvasNotReady: Story = {
  name: 'Canvas 未準備',
  render: () => <PortalWithRef isCanvasReady={false} />,
};

/**
 * モバイル（〜768px）。
 */
export const Mobile: Story = {
  name: 'モバイル（〜768px）',
  render: () => <PortalWithRef isCanvasReady={true} />,
  globals: { viewport: { value: 'mobile2' } },
};
