import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ProgressStatus from '@/components/contact/ProgressStatus';

/**
 * ProgressStatus コンポーネントの Storybook 定義。
 *
 * コンタクトページのヘッダー領域に表示する「Contact」タイトルと
 * StepProgressBar を組み合わせたコンポーネント。
 * ページロード時に GSAP によるフェードインアニメーションが実行される。
 */
const meta = {
  title: 'Components/Contact/ProgressStatus',
  component: ProgressStatus,
  decorators: [
    (Story) =>
      React.createElement(
        'div',
        { style: { width: '600px' } },
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
    formStep: {
      control: 'select',
      options: ['INPUT', 'CONFIRM', 'RESULT'],
      description: '現在のフォームステップ',
      table: { type: { summary: "'INPUT' | 'CONFIRM' | 'RESULT'" } },
    },
    isSubmitSuccessful: {
      control: 'boolean',
      description:
        '送信結果の成功フラグ。formStep が RESULT のときのみ参照される',
      table: { type: { summary: 'boolean' } },
    },
    hasValidationError: {
      control: 'boolean',
      description:
        'バリデーションエラー発生フラグ。formStep が INPUT のときのみ参照される',
      table: { type: { summary: 'boolean' } },
    },
  },
} satisfies Meta<typeof ProgressStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Step 1：内容入力（通常）。最初のステップが現在アクティブな状態。
 */
export const Step1Input: Story = {
  name: 'Step 1 - 内容入力（通常）',
  args: {
    formStep: 'INPUT',
    isSubmitSuccessful: false,
    hasValidationError: false,
  },
};

/**
 * Step 1：内容入力（バリデーションエラー）。Step 1 がエラー状態。
 */
export const Step1InputError: Story = {
  name: 'Step 1 - 内容入力（バリデーションエラー）',
  args: {
    formStep: 'INPUT',
    isSubmitSuccessful: false,
    hasValidationError: true,
  },
};

/**
 * Step 2：内容確認。Step 1 が完了、Step 2 がアクティブな状態。
 */
export const Step2Confirm: Story = {
  name: 'Step 2 - 内容確認',
  args: {
    formStep: 'CONFIRM',
    isSubmitSuccessful: false,
    hasValidationError: false,
  },
};

/**
 * Step 3：送信完了（成功）。全ステップ完了・成功状態。
 */
export const Step3ResultSuccess: Story = {
  name: 'Step 3 - 送信完了（成功）',
  args: {
    formStep: 'RESULT',
    isSubmitSuccessful: true,
    hasValidationError: false,
  },
};

/**
 * Step 3：送信失敗（エラー）。Step 3 がエラー状態。
 */
export const Step3ResultFailure: Story = {
  name: 'Step 3 - 送信失敗（エラー）',
  args: {
    formStep: 'RESULT',
    isSubmitSuccessful: false,
    hasValidationError: false,
  },
};
