import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import StepProgressBar from '@/components/contact/StepProgressBar';
import s from '@/styles/contact.module.css';

/**
 * StepProgressBar コンポーネントの Storybook 定義。
 *
 * お問い合わせフォームの進行状況を 3 ステップで可視化するプログレスバー。
 * ステップの状態（未開始 / 現在 / 完了 / エラー）とラベルは formStep・
 * isSubmitSuccessful・hasValidationError の組み合わせで自動導出される。
 *
 * ステップ一覧:
 *   1. 内容入力（INPUT）
 *   2. 内容確認（CONFIRM）
 *   3. 送信 / 送信完了 / 送信失敗（RESULT）
 */
const meta = {
  title: 'Components/Contact/StepProgressBar',
  component: StepProgressBar,
  decorators: [
    (Story) =>
      React.createElement(
        'div',
        { style: { width: '480px', paddingBottom: '60px' } },
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
  args: {
    labelClassName: s.progress_label,
    contentClassName: s.current_step_container,
    currentStepClassName: s.current_step,
  },
  argTypes: {
    formStep: {
      control: 'select',
      options: ['INPUT', 'CONFIRM', 'RESULT'],
      description: '現在のフォームステップ',
      table: {
        type: { summary: "'INPUT' | 'CONFIRM' | 'RESULT'" },
      },
    },
    isSubmitSuccessful: {
      control: 'boolean',
      description:
        '送信結果の成功フラグ。formStep が RESULT のときのみ参照される',
      table: {
        type: { summary: 'boolean' },
      },
    },
    hasValidationError: {
      control: 'boolean',
      description:
        'バリデーションエラー発生フラグ。formStep が INPUT のときのみ参照される',
      table: {
        type: { summary: 'boolean' },
      },
    },
    wrapperClassName: {
      control: false,
      description: 'プログレスバー全体のラッパーに追加するクラス名',
    },
    progressClassName: {
      control: false,
      description: 'ステップリストに追加するクラス名',
    },
    labelClassName: {
      control: false,
      description: '各ステップラベルに追加するクラス名',
    },
    contentClassName: {
      control: false,
      description:
        'モバイル用の現在ステップコンテンツラッパーに追加するクラス名',
    },
    currentStepClassName: {
      control: false,
      description: 'モバイル用の現在ステップラベルに追加するクラス名',
    },
  },
} satisfies Meta<typeof StepProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ステップ 1「内容入力」が現在地の通常状態。
 * バリデーションエラーなし。
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
 * ステップ 1「内容入力」でバリデーションエラーが発生した状態。
 * ステップ 1 のポイントがエラー表示（赤・シェークアニメーション）になる。
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
 * ステップ 2「内容確認」が現在地の状態。
 * ステップ 1 が完了済み（緑）、ステップ 2 がアクティブ（青）。
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
 * ステップ 3「送信完了」の成功状態。
 * 全ステップが完了済みのうえ、最終ステップが「送信完了」ラベルで緑表示。
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
 * ステップ 3「送信失敗」のエラー状態。
 * ステップ 1・2 は完了済みで、最終ステップが「送信失敗」ラベルで赤表示。
 */
export const Step3ResultFailure: Story = {
  name: 'Step 3 - 送信失敗（エラー）',
  args: {
    formStep: 'RESULT',
    isSubmitSuccessful: false,
    hasValidationError: false,
  },
};

// ===== モバイルブレークポイント（〜768px） =====

/**
 * モバイル（〜768px）: ステップ 1「内容入力」通常状態。
 * step_label が非表示になり、現在ステップのラベルをコンテンツ下に表示。
 */
export const MobileStep1Input: Story = {
  name: 'Mobile（〜768px）- Step 1 通常',
  args: {
    formStep: 'INPUT',
    isSubmitSuccessful: false,
    hasValidationError: false,
  },
  globals: { viewport: { value: 'mobile2' } },
};

/**
 * モバイル（〜768px）: ステップ 1「内容入力」バリデーションエラー状態。
 */
export const MobileStep1InputError: Story = {
  name: 'Mobile（〜768px）- Step 1 エラー',
  args: {
    formStep: 'INPUT',
    isSubmitSuccessful: false,
    hasValidationError: true,
  },
  globals: { viewport: { value: 'mobile2' } },
};

/**
 * モバイル（〜768px）: ステップ 2「内容確認」状態。
 */
export const MobileStep2Confirm: Story = {
  name: 'Mobile（〜768px）- Step 2',
  args: {
    formStep: 'CONFIRM',
    isSubmitSuccessful: false,
    hasValidationError: false,
  },
  globals: { viewport: { value: 'mobile2' } },
};

/**
 * モバイル（〜768px）: ステップ 3「送信完了（成功）」状態。
 */
export const MobileStep3ResultSuccess: Story = {
  name: 'Mobile（〜768px）- Step 3 成功',
  args: {
    formStep: 'RESULT',
    isSubmitSuccessful: true,
    hasValidationError: false,
  },
  globals: { viewport: { value: 'mobile2' } },
};

/**
 * モバイル（〜768px）: ステップ 3「送信失敗（エラー）」状態。
 */
export const MobileStep3ResultFailure: Story = {
  name: 'Mobile（〜768px）- Step 3 エラー',
  args: {
    formStep: 'RESULT',
    isSubmitSuccessful: false,
    hasValidationError: false,
  },
  globals: { viewport: { value: 'mobile2' } },
};
