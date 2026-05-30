import React, { useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import Introduction from '@/components/works/workThreeD/Introduction';
import { type WorkDetail } from '@/types/api';
import { type ViewerStatus } from '@/types/contexts';

/** Introduction コンポーネントで使用するサンプル作品データ */
const sampleContent: WorkDetail = {
  id: 1,
  key: 'symphony',
  title: 'Symphony',
  description: '気象情報APIと3D UIを連携したインタラクティブなWeb表現。',
  slug: 'symphony',
  created_at: '2024-01-01T00:00:00Z',
  introduction_title: '3D インタラクティブ表現',
  introduction_description:
    'Three.jsとGSAPを活用した3Dインタラクティブな作品。操作パネルで3Dモデルを制御できます。スクロールしてコントロールパネルを確認してください。',
  controls_title: '操作パネル',
  controls_description: 'モデルの各部位をクリックしてアニメーションを確認できます。',
  controls: [],
};

/**
 * Introduction コンポーネントのラッパー。ref を注入して表示する。
 */
const IntroductionWithRef = ({
  isLoading,
  viewerStatus,
  isFingerVisible,
}: {
  isLoading: boolean;
  viewerStatus: ViewerStatus;
  isFingerVisible: boolean;
}) => {
  const introductionRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLDivElement | null>(null);
  return (
    <Introduction
      content={sampleContent}
      introductionRef={introductionRef}
      isLoading={isLoading}
      viewerStatus={viewerStatus}
      isFingerVisible={isFingerVisible}
      toggleButtonRef={toggleButtonRef}
      dispatch={fn()}
    />
  );
};

/**
 * Introduction コンポーネントの Storybook 定義。
 *
 * 3D 作品詳細ページの紹介セクション。
 * タイトル・説明文・FingerPress ガイド・ToggleButton を縦に並べて表示する。
 * isLoading が false になったとき GSAP によるフェードイン＋スライドアニメーションが実行される。
 */
const meta = {
  title: 'Components/Works/WorkThreeD/Introduction',
  component: Introduction,
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
    introductionRef: { control: false, table: { disable: true } },
    toggleButtonRef: { control: false, table: { disable: true } },
    dispatch: { control: false, table: { disable: true } },
    isLoading: {
      control: 'boolean',
      description: '3D モデルのロード中フラグ。false でアニメーションが初期化される',
      table: { type: { summary: 'boolean' } },
    },
    viewerStatus: {
      control: 'select',
      options: ['passive', 'entering', 'active', 'exiting'],
      description: 'ビュワーモードの状態',
      table: { type: { summary: "'passive' | 'entering' | 'active' | 'exiting'" } },
    },
    isFingerVisible: {
      control: 'boolean',
      description: '指アイコンの表示フラグ',
      table: { type: { summary: 'boolean' } },
    },
  },
} satisfies Meta<typeof Introduction>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Passive（初期状態）。モデルロード完了・ビュワー無効の状態。スクロール促進テキストが表示される。
 */
export const Passive: Story = {
  name: 'Passive（初期状態）',
  render: () => (
    <IntroductionWithRef isLoading={false} viewerStatus="passive" isFingerVisible={false} />
  ),
};

/**
 * Active（ビュワー有効）。指アイコンが表示された状態。
 */
export const ActiveWithFinger: Story = {
  name: 'Active（指アイコン表示）',
  render: () => (
    <IntroductionWithRef isLoading={false} viewerStatus="active" isFingerVisible={true} />
  ),
};

/**
 * Active（指アイコン非表示）。指アイコンをクリックして非表示になった状態。
 */
export const ActiveWithoutFinger: Story = {
  name: 'Active（指アイコン非表示）',
  render: () => (
    <IntroductionWithRef isLoading={false} viewerStatus="active" isFingerVisible={false} />
  ),
};

/**
 * モバイル（〜768px）。
 */
export const Mobile: Story = {
  name: 'モバイル（〜768px）',
  render: () => (
    <IntroductionWithRef isLoading={false} viewerStatus="passive" isFingerVisible={false} />
  ),
  globals: { viewport: { value: 'mobile2' } },
};
