import React, { useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { World } from '@/components/works/workThreeD/World';
import { type WorkDetail } from '@/types/api';

/**
 * World コンポーネントで使用するサンプル作品データ。
 *
 * ⚠️ Storybook 環境では `/api/supabase/model/{key}` は利用不可のため、
 * 作品固有の 3D モデルは読み込まれない。
 * ただし Room モデル・環境マップ・ライト・カメラは正常に描画される。
 */
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
  controls_description: 'モデルの各部位をクリックしてアニメーションを確認できます。',
  controls: [],
};

type WrapperProps = {
  /** 3D モデルのロード中フラグ */
  isLoading: boolean;
  /** 初期コントロール状態フラグ */
  isInitialControl: boolean;
  /** コントロール開始フラグ */
  isStartControls: boolean;
  /** ビュワーモード */
  viewerStatus: 'passive' | 'entering' | 'active' | 'exiting';
  /** 現在選択中のコントロールインデックス */
  currentIndex: number;
  /** カメラアニメーション完了フラグ */
  isCameraReady: boolean;
};

/**
 * World コンポーネントのラッパー。
 * 4 つの DOM ref を生成して World に注入する。
 */
const WorldWithRefs = ({
  isLoading,
  isInitialControl,
  isStartControls,
  viewerStatus,
  currentIndex,
  isCameraReady,
}: WrapperProps) => {
  const portalRef = useRef<HTMLElement | null>(null);
  const introductionRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLDivElement | null>(null);

  return (
    <World
      content={sampleContent}
      isLoading={isLoading}
      isInitialControl={isInitialControl}
      isStartControls={isStartControls}
      viewerStatus={viewerStatus}
      currentIndex={currentIndex}
      isCameraReady={isCameraReady}
      dispatch={fn()}
      portalRef={portalRef}
      introductionRef={introductionRef}
      controlsRef={controlsRef}
      toggleButtonRef={toggleButtonRef}
      onControlsSorted={fn()}
    />
  );
};

/**
 * World（workThreeD）コンポーネントの Storybook 定義。
 *
 * R3F `<Canvas>` + `<Experience>` で構成される 3D シーン。
 * Canvas は `position: fixed` で全画面を占有する。
 *
 * **Storybook 上の制約**:
 * - 作品モデル (`/api/supabase/model/symphony`) は Next.js API Route のため
 *   Storybook 環境では 404 となりロードされない。
 * - Room モデル・環境マップ・ライト・OrbitControls は正常に描画される。
 */
const meta = {
  title: 'Components/Works/WorkThreeD/World',
  component: WorldWithRefs,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    docs: {
      description: {
        component:
          '3D ビュワー本体。R3F `<Canvas>` をフルスクリーンで表示する。Storybook では作品固有モデルは未表示（Room・環境マップは表示）。',
      },
    },
  },
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'true: ロード中（フェードイン前）',
    },
    isInitialControl: {
      control: 'boolean',
      description: 'true: Controls セクション到達前の初期状態',
    },
    isStartControls: {
      control: 'boolean',
      description: 'true: Controls セクションに到達済み',
    },
    viewerStatus: {
      control: { type: 'radio' },
      options: ['passive', 'entering', 'active', 'exiting'],
      description: 'ビュワーの動作モード',
    },
    currentIndex: {
      control: { type: 'number', min: 0, step: 1 },
      description: '選択中のコントロールインデックス',
    },
    isCameraReady: {
      control: 'boolean',
      description: 'true: カメラアニメーション完了済み',
    },
  },
} satisfies Meta<typeof WorldWithRefs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 初期状態（ビュワー非アクティブ・ロード中）。
 * Canvas は表示されるが、ポータルは未フェードイン。
 */
export const Passive: Story = {
  args: {
    isLoading: true,
    isInitialControl: true,
    isStartControls: false,
    viewerStatus: 'passive',
    currentIndex: 0,
    isCameraReady: false,
  },
};

/**
 * ロード完了後のパッシブ状態。
 * Portal のフェードインアニメーションが完了した状態。
 */
export const PassiveLoaded: Story = {
  args: {
    isLoading: false,
    isInitialControl: true,
    isStartControls: false,
    viewerStatus: 'passive',
    currentIndex: 0,
    isCameraReady: false,
  },
};

/**
 * ビュワー起動済み（アクティブ）状態。
 * OrbitControls が有効になり、マウス/タッチでカメラを操作できる。
 */
export const Active: Story = {
  args: {
    isLoading: false,
    isInitialControl: false,
    isStartControls: true,
    viewerStatus: 'active',
    currentIndex: 0,
    isCameraReady: true,
  },
};
