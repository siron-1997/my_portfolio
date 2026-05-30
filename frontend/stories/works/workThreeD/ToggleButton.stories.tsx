import React, { useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import ToggleButton from '@/components/works/workThreeD/ToggleButton';
import { type ViewerStatus } from '@/types/contexts';

/**
 * ToggleButton コンポーネントのラッパー。ref を注入して表示する。
 */
const ToggleButtonWithRef = ({ viewerStatus }: { viewerStatus: ViewerStatus }) => {
  const toggleButtonRef = useRef<HTMLDivElement | null>(null);
  return (
    <ToggleButton
      viewerStatus={viewerStatus}
      toggleButtonRef={toggleButtonRef}
      dispatch={fn()}
    />
  );
};

/**
 * ToggleButton コンポーネントの Storybook 定義。
 *
 * 3D 作品詳細ページのビュワーモード切り替えボタン。
 * viewerStatus に応じて「Start」または「End」ラベルを表示し、
 * クリックでビュワーの ON / OFF を切り替える。
 */
const meta = {
  title: 'Components/Works/WorkThreeD/ToggleButton',
  component: ToggleButton,
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
    viewerStatus: {
      control: 'select',
      options: ['passive', 'entering', 'active', 'exiting'],
      description: 'ビュワーモードの状態',
      table: { type: { summary: "'passive' | 'entering' | 'active' | 'exiting'" } },
    },
    toggleButtonRef: { control: false, table: { disable: true } },
    dispatch: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Passive（初期状態）。「Start」ラベルを表示する。
 */
export const Passive: Story = {
  name: 'Passive（初期状態・Start ラベル）',
  render: () => <ToggleButtonWithRef viewerStatus="passive" />,
};

/**
 * Active（ビュワー有効）。「End」ラベルを表示する。
 */
export const Active: Story = {
  name: 'Active（ビュワー有効・End ラベル）',
  render: () => <ToggleButtonWithRef viewerStatus="active" />,
};

/**
 * Entering（開始アニメーション中）。ビュワーの開始トランジション中の状態。
 */
export const Entering: Story = {
  name: 'Entering（開始トランジション中）',
  render: () => <ToggleButtonWithRef viewerStatus="entering" />,
};

/**
 * Exiting（終了アニメーション中）。ビュワーの終了トランジション中の状態。
 */
export const Exiting: Story = {
  name: 'Exiting（終了トランジション中）',
  render: () => <ToggleButtonWithRef viewerStatus="exiting" />,
};
