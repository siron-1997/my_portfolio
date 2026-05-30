import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Sending from '@/components/contact/Sending';

/**
 * Sending コンポーネントの Storybook 定義。
 *
 * フォーム送信中に表示するフルスクリーンオーバーレイ。
 * 「送信中」テキストとドットのローディングアニメーションを含む。
 * isSending が false のとき display:none で非表示になる。
 */
const meta = {
  title: 'Components/Contact/Sending',
  component: Sending,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isSending: {
      control: 'boolean',
      description: '送信中フラグ。true のときオーバーレイを表示する',
      table: { type: { summary: 'boolean' } },
    },
  },
} satisfies Meta<typeof Sending>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 送信中の状態。フルスクリーンオーバーレイが表示される。
 */
export const Visible: Story = {
  name: '送信中（表示）',
  args: {
    isSending: true,
  },
};

/**
 * 送信中でない状態。オーバーレイは display:none で非表示。
 */
export const Hidden: Story = {
  name: '非表示',
  args: {
    isSending: false,
  },
};
