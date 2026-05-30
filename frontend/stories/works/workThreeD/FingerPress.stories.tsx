import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import FingerPress from '@/components/works/workThreeD/FingerPress';
import { type ViewerStatus } from '@/types/contexts';

/**
 * FingerPress コンポーネントの Storybook 定義。
 *
 * 3D 作品詳細ページのビュワーモード切り替えを促すガイドコンポーネント。
 * viewerStatus が passive のとき「スクロールしてください」テキスト + 矢印を表示する。
 * viewerStatus が active のとき指アイコンを表示し、クリックで非表示になる。
 */
const meta = {
  title: 'Components/Works/WorkThreeD/FingerPress',
  component: FingerPress,
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
    isFingerVisible: {
      control: 'boolean',
      description: '指アイコンの表示フラグ',
      table: { type: { summary: 'boolean' } },
    },
    viewerStatus: {
      control: 'select',
      options: ['passive', 'entering', 'active', 'exiting'],
      description: 'ビュワーモードの状態',
      table: {
        type: { summary: "'passive' | 'entering' | 'active' | 'exiting'" },
      },
    },
    dispatch: {
      control: false,
      table: { disable: true },
    },
  },
  args: {
    dispatch: fn(),
  },
} satisfies Meta<typeof FingerPress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Passive（初期状態）。「スクロールしてください」テキストと下向き矢印を表示する。
 */
export const PassiveState: Story = {
  name: 'Passive（スクロール促進テキスト）',
  args: {
    isFingerVisible: false,
    viewerStatus: 'passive' as ViewerStatus,
  },
};

/**
 * Active（指アイコン表示）。指アイコンが表示される状態。
 */
export const ActiveWithFinger: Story = {
  name: 'Active（指アイコン表示）',
  args: {
    isFingerVisible: true,
    viewerStatus: 'active' as ViewerStatus,
  },
};

/**
 * Active（指アイコン非表示）。指アイコンをクリックして非表示になった状態。
 */
export const ActiveWithoutFinger: Story = {
  name: 'Active（指アイコン非表示）',
  args: {
    isFingerVisible: false,
    viewerStatus: 'active' as ViewerStatus,
  },
};
