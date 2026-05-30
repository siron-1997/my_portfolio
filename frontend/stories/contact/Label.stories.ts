import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Label from '@/components/contact/Label';

/**
 * Label コンポーネントの Storybook 定義。
 *
 * お問い合わせフォームの各入力フィールドに付与するラベル。
 * 入力ステップでは「※ 必須」バッジを表示し、確認ステップでは非表示にする。
 */
const meta = {
  title: 'Components/Contact/Label',
  component: Label,
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
      description: 'ラベルに表示するテキスト',
      table: { type: { summary: 'string' } },
    },
    id: {
      control: false,
      description: '対応する input 要素の id',
      table: { type: { summary: 'string' } },
    },
    isConfirmStep: {
      control: 'boolean',
      description:
        '確認ステップのとき true。true の場合「※ 必須」バッジを非表示にする',
      table: { type: { summary: 'boolean' } },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 入力ステップのラベル。「※ 必須」バッジを表示する。
 */
export const Input: Story = {
  name: '入力ステップ（※ 必須あり）',
  args: {
    title: 'name',
    id: 'input-name',
    isConfirmStep: false,
  },
};

/**
 * 確認ステップのラベル。「※ 必須」バッジを非表示にする。
 */
export const Confirm: Story = {
  name: '確認ステップ（※ 必須なし）',
  args: {
    title: 'name',
    id: 'input-name',
    isConfirmStep: true,
  },
};
