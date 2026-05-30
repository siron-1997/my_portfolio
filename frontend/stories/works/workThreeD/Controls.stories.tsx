import React, { useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import Controls from '@/components/works/workThreeD/Controls';
import { type WorkControl, type WorkDetail } from '@/types/api';

/** Controls コンポーネントで使用するサンプル作品データ */
const sampleContent: WorkDetail = {
  id: 1,
  key: 'symphony',
  title: 'Symphony',
  description: '気象情報APIと3D UIを連携したインタラクティブなWeb表現。',
  slug: 'symphony',
  created_at: '2024-01-01T00:00:00Z',
  introduction_title: '3D インタラクティブ表現',
  introduction_description:
    'Three.jsとGSAPを活用した3Dインタラクティブな作品。操作パネルで3Dモデルを制御できます。',
  controls_title: '操作パネル',
  controls_description: 'モデルの各部位をクリックしてアニメーションを確認できます。',
  controls: [],
};

/** Controls コンポーネントで使用するサンプルコントロールデータ */
const sampleControls: WorkControl[] = [
  { title: 'Idle', description: '待機状態のアニメーション。ループ再生される。', animation_name: 'idle', is_loop: true },
  { title: 'Walk', description: '歩行アニメーション。ループ再生される。', animation_name: 'walk', is_loop: true },
  { title: 'Run', description: '走行アニメーション。ループ再生される。', animation_name: 'run', is_loop: true },
  { title: 'Jump', description: 'ジャンプアニメーション。1 回のみ再生される。', animation_name: 'jump', is_loop: false },
];

/**
 * Controls コンポーネントのラッパー。ref を注入して表示する。
 */
const ControlsWithRef = ({
  currentIndex,
  isLoading,
}: {
  currentIndex: number;
  isLoading: boolean;
}) => {
  const controlsRef = useRef<HTMLDivElement | null>(null);
  return (
    <Controls
      content={sampleContent}
      controls={sampleControls}
      controlsRef={controlsRef}
      currentIndex={currentIndex}
      isLoading={isLoading}
      dispatch={fn()}
    />
  );
};

/**
 * Controls コンポーネントの Storybook 定義。
 *
 * 3D 作品詳細ページの操作パネルセクション。
 * コントロール項目をリスト表示し、クリックで 3D モデルのアニメーションを切り替える。
 * PC 表示と MB 表示でレイアウトが切り替わる。
 */
const meta = {
  title: 'Components/Works/WorkThreeD/Controls',
  component: Controls,
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
    controls: { control: false, table: { disable: true } },
    controlsRef: { control: false, table: { disable: true } },
    dispatch: { control: false, table: { disable: true } },
    currentIndex: {
      control: 'number',
      description: '現在選択中のコントロールインデックス',
      table: { type: { summary: 'number' } },
    },
    isLoading: {
      control: 'boolean',
      description: '3D モデルのロード完了フラグ（true でアニメーションが初期化される）',
      table: { type: { summary: 'boolean' } },
    },
  },
} satisfies Meta<typeof Controls>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト（1 番目が選択済み）。モデルのロード完了後の状態。
 */
export const Default: Story = {
  name: 'デフォルト（1 番目が選択済み）',
  render: () => <ControlsWithRef currentIndex={0} isLoading={true} />,
};

/**
 * 2 番目が選択済み。選択中の項目がハイライトされる。
 */
export const SecondSelected: Story = {
  name: '2 番目が選択済み',
  render: () => <ControlsWithRef currentIndex={1} isLoading={true} />,
};

/**
 * モバイル（〜768px）での表示。
 */
export const Mobile: Story = {
  name: 'モバイル（〜768px）',
  render: () => <ControlsWithRef currentIndex={0} isLoading={true} />,
  globals: { viewport: { value: 'mobile2' } },
};
