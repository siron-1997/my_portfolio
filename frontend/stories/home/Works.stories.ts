import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Works from '@/components/home/Works';
import { type WorkSummary } from '@/types/api';

/** Works コンポーネントで使用するサンプル作品データ */
const sampleWorks: WorkSummary[] = [
  {
    id: 1,
    title: 'Symphony',
    description:
      '気象情報APIと3D UIを連携したインタラクティブなWeb表現。Three.jsとGSAPを活用して制作。',
    slug: 'symphony',
    created: '2024-01-01',
    created_at: '2024-01-01T00:00:00Z',
    image_url: 'https://picsum.photos/seed/symphony/600/400',
    alternative_text: 'Symphony のサムネイル',
    category_key: 'three-d',
    category_name: '3D',
  },
  {
    id: 2,
    title: 'Portfolio',
    description:
      'Next.js と Three.js を使用したポートフォリオサイト。GSAP でアニメーションを実装。',
    slug: 'portfolio',
    created: '2023-12-01',
    created_at: '2023-12-01T00:00:00Z',
    image_url: 'https://picsum.photos/seed/portfolio/600/400',
    alternative_text: 'Portfolio のサムネイル',
    category_key: 'web',
    category_name: 'Web',
  },
  {
    id: 3,
    title: 'RC Plane',
    description:
      'コンセプト RC 飛行機の設計・制作プロジェクト。3D モデリングと実機テストを実施。',
    slug: 'rc-plane',
    created: '2023-06-01',
    created_at: '2023-06-01T00:00:00Z',
    image_url: 'https://picsum.photos/seed/rcplane/600/400',
    alternative_text: 'RC Plane のサムネイル',
    category_key: 'hardware',
    category_name: 'Hardware',
  },
];

/**
 * Works（Home）コンポーネントの Storybook 定義。
 *
 * Home ページの作品紹介セクション。
 * `data` に渡された `WorkSummary[]` をカード形式で横並び表示し、
 * 各カードから作品詳細ページへリンクする。
 * GSAP の ScrollTrigger によるタイトル＋カードのフェードインアニメーションが
 * マウント時に実行される。
 */
const meta = {
  title: 'Components/Home/Works',
  component: Works,
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
    data: {
      control: false,
      description: 'ホームページに表示する作品データの配列',
      table: { type: { summary: 'WorkSummary[]' } },
    },
  },
} satisfies Meta<typeof Works>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 3 件表示。通常の作品カードリスト。
 */
export const ThreeWorks: Story = {
  name: '作品 3 件',
  args: {
    data: sampleWorks,
  },
};

/**
 * 1 件表示。
 */
export const OneWork: Story = {
  name: '作品 1 件',
  args: {
    data: sampleWorks.slice(0, 1),
  },
};

/**
 * モバイル（〜768px）。
 */
export const Mobile: Story = {
  name: 'モバイル（〜768px）',
  args: {
    data: sampleWorks,
  },
  globals: { viewport: { value: 'mobile2' } },
};
