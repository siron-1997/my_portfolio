import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import CategoryFilter from '@/components/works/CategoryFilter';
import { type WorkCategory } from '@/types/api';

/** カテゴリフィルターで使用するサンプルデータ */
const sampleCategories: WorkCategory[] = [
  { id: 1, key: 'web', name: 'Web Design' },
  { id: 2, key: 'app', name: 'Application' },
  { id: 3, key: '3d', name: '3D' },
  { id: 4, key: 'branding', name: 'Branding' },
  { id: 5, key: 'other', name: 'Other' },
];

/**
 * CategoryFilter コンポーネントの Storybook 定義。
 *
 * 作品一覧ページに表示するカテゴリフィルターコンポーネント。
 * MUI Autocomplete（複数選択・チップ表示）と GSAP アニメーションを組み合わせる。
 */
const meta = {
  title: 'Components/Works/CategoryFilter',
  component: CategoryFilter,
  decorators: [
    (Story) =>
      React.createElement(
        'div',
        {
          style: {
            width: '800px',
            padding: '40px',
            backgroundColor: '#1D1730',
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
    data: {
      control: false,
      description: 'フィルタリング対象のカテゴリデータ配列',
      table: { type: { summary: 'WorkCategory[]' } },
    },
    setSelectedCategories: {
      control: false,
      description: '選択されたカテゴリを更新する関数',
      table: { type: { summary: 'Dispatch<SetStateAction<WorkCategory[]>>' } },
    },
  },
  args: {
    data: sampleCategories,
    setSelectedCategories: fn(),
  },
} satisfies Meta<typeof CategoryFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト。全カテゴリが選択済みの初期状態。
 */
export const Default: Story = {
  name: 'デフォルト（全選択）',
};

/**
 * モバイル（〜768px）。チップの表示数が 2 に制限される。
 */
export const Mobile: Story = {
  name: 'モバイル（〜768px）',
  globals: { viewport: { value: 'mobile2' } },
};

/**
 * デスクトップ（1024px〜）。チップの表示数が 4 に制限される。
 */
export const Desktop: Story = {
  name: 'デスクトップ（1024px〜）',
  globals: { viewport: { value: 'desktop' } },
};
