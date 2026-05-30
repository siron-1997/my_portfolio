import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import ControlItems from '@/components/works/workThreeD/ControlItems';

/**
 * ControlItems コンポーネントの Storybook 定義。
 *
 * 3D 作品詳細ページの操作パネルに表示する各コントロール項目。
 * インデックス番号・タイトル・説明文を一行で表示し、クリックでアニメーションを切り替える。
 */
const meta = {
  title: 'Components/Works/WorkThreeD/ControlItems',
  component: ControlItems,
  decorators: [
    (Story) =>
      React.createElement(
        'div',
        {
          style: {
            width: '480px',
            backgroundColor: '#1D1730',
            padding: '16px',
          },
        },
        React.createElement(Story),
      ),
  ],
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
      description: 'コントロール項目のタイトル',
      table: { type: { summary: 'string' } },
    },
    description: {
      control: 'text',
      description: 'コントロール項目の説明文',
      table: { type: { summary: 'string' } },
    },
    index: {
      control: 'number',
      description: 'コントロール項目のインデックス（0 始まり）',
      table: { type: { summary: 'number' } },
    },
    className: {
      control: false,
      description: 'ルート要素に付与する CSS クラス名',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description: 'ルート要素に付与するインラインスタイル',
      table: { type: { summary: 'CSSProperties' } },
    },
    onClick: {
      control: false,
      description:
        'クリック時に呼び出されるコールバック。引数は項目のインデックス',
      table: { type: { summary: '(index: number) => void' } },
    },
  },
  args: {
    onClick: fn(),
    className: '',
  },
} satisfies Meta<typeof ControlItems>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト。1 番目のコントロール項目。
 */
export const Default: Story = {
  name: 'デフォルト（1 番目）',
  args: {
    title: 'Idle',
    description: '待機状態のアニメーション。ループ再生される。',
    index: 0,
  },
};

/**
 * 2 番目のコントロール項目。インデックスが異なる場合の表示確認。
 */
export const SecondItem: Story = {
  name: '2 番目の項目',
  args: {
    title: 'Walk',
    description: '歩行アニメーション。ループ再生される。',
    index: 1,
  },
};

/**
 * 説明文が長い場合の表示確認。
 */
export const LongDescription: Story = {
  name: '説明文が長い場合',
  args: {
    title: 'Complex Animation',
    description:
      '複数のボーンが連動する複雑なモーションキャプチャーアニメーション。開始から終了まで約 3 秒かかる。ループ再生はオフ。',
    index: 2,
  },
};
