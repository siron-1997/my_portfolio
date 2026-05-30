import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Contents from '@/components/works/Contents';
import { type WorkCategory, type WorkSummary } from '@/types/api';

/** Contents コンポーネントで使用するサンプルデータ */
const sampleWorks: WorkSummary[] = [
  {
    id: 1,
    title: 'Symphony',
    description:
      '気象情報APIと3D UIを連携し、環境とオブジェクトが調和するインタラクティブなWeb表現。Three.jsとGSAPを活用。',
    slug: 'symphony',
    created: '2024-01-15',
    created_at: '2024-01-15T00:00:00Z',
    image_url: 'https://picsum.photos/520/390?random=10',
    alternative_text: 'Symphony - 気象情報APIと3D UIを連携したインタラクティブなWeb表現',
    category_key: '3d',
    category_name: '3D',
  },
  {
    id: 2,
    title: 'Portfolio v1',
    description:
      '前バージョンのポートフォリオサイト。Next.jsとTailwind CSSで構築したシンプルなデザイン。',
    slug: 'portfolio-v1',
    created: '2023-08-20',
    created_at: '2023-08-20T00:00:00Z',
    image_url: 'https://picsum.photos/520/390?random=20',
    alternative_text: 'Portfolio v1 - 旧ポートフォリオサイト',
    category_key: 'web',
    category_name: 'Web Design',
  },
  {
    id: 3,
    title: 'Brand Identity',
    description:
      'スタートアップ企業のブランドアイデンティティ設計。ロゴからデザインシステムまで一貫して制作。',
    slug: 'brand-identity',
    created: '2023-05-10',
    created_at: '2023-05-10T00:00:00Z',
    image_url: 'https://picsum.photos/520/390?random=30',
    alternative_text: 'Brand Identity - ブランドアイデンティティプロジェクト',
    category_key: 'branding',
    category_name: 'Branding',
  },
];

/** フィルタリング用のサンプルカテゴリデータ */
const sampleCategories: WorkCategory[] = [
  { id: 3, key: '3d', name: '3D' },
];

/**
 * Contents コンポーネントの Storybook 定義。
 *
 * 作品一覧ページのカードグリッドを表示するコンポーネント。
 * selectedCategories が空の場合は全件表示、指定がある場合はカテゴリでフィルタリングする。
 * カードのスクロールインに GSAP アニメーションが適用される。
 */
const meta = {
  title: 'Components/Works/Contents',
  component: Contents,
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
      description: '作品一覧で表示するサマリーデータ',
      table: { type: { summary: 'WorkSummary[]' } },
    },
    selectedCategories: {
      control: false,
      description: '選択されたカテゴリの配列。空の場合は全件表示',
      table: { type: { summary: 'WorkCategory[]' } },
    },
  },
} satisfies Meta<typeof Contents>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 全件表示（カテゴリ未選択）。selectedCategories が空の場合は全作品を表示する。
 */
export const AllWorks: Story = {
  name: '全件表示（カテゴリ未選択）',
  args: {
    data: sampleWorks,
    selectedCategories: [],
  },
};

/**
 * カテゴリフィルタリング済み。「3D」カテゴリのみ表示する。
 */
export const Filtered: Story = {
  name: 'カテゴリフィルタリング（3D のみ）',
  args: {
    data: sampleWorks,
    selectedCategories: sampleCategories,
  },
};

/**
 * 該当なし。フィルタリング結果が 0 件の場合。
 */
export const Empty: Story = {
  name: '0件（該当なし）',
  args: {
    data: sampleWorks,
    selectedCategories: [{ id: 99, key: 'no-match', name: 'NoMatch' }],
  },
};
