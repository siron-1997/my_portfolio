import React, { useReducer } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { FormState } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import ContactForm from '@/components/contact/ContactForm';
import {
  CONTACT_DEFAULT_VALUES,
  contactSchema,
  type ContactFormValues,
} from '@/constants/contact';
import { type ContactFormAction, type FormStep } from '@/types/contact';

/**
 * ContactForm コンポーネントの Storybook 定義。
 *
 * お問い合わせページのフォーム本体。
 * INPUT / CONFIRM / RESULT の 3 ステップに応じて
 * 入力フォーム・確認表示・送信結果画面を切り替えて表示する。
 * react-hook-form の register・formState などは
 * render 関数内のラッパーコンポーネントで useForm を使用している。
 */
const meta = {
  title: 'Components/Contact/ContactForm',
  component: ContactForm,
  decorators: [
    (Story) =>
      React.createElement(
        'div',
        { style: { width: '480px' } },
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
    register: { control: false, table: { disable: true } },
    formState: { control: false, table: { disable: true } },
    trigger: { control: false, table: { disable: true } },
    handleSubmit: { control: false, table: { disable: true } },
    dispatch: { control: false, table: { disable: true } },
    formStep: {
      control: 'select',
      options: ['INPUT', 'CONFIRM', 'RESULT'],
      description: '現在のフォームステップ',
      table: { type: { summary: "'INPUT' | 'CONFIRM' | 'RESULT'" } },
    },
    hasAttemptedAdvance: {
      control: 'boolean',
      description: '「入力内容の確認」ボタンをクリックしたフラグ',
      table: { type: { summary: 'boolean' } },
    },
  },
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** フォームステップの状態型 */
type ContactFormState = {
  /** 現在のフォームステップ */
  formStep: FormStep;

  /** 「入力内容確認」ボタンをクリックしたフラグ */
  hasAttemptedAdvance: boolean;

  /** バリデーションエラーの発生フラグ */
  hasValidationError: boolean;
};

/**
 * Story 用のフォームステップ状態管理 reducer。
 *
 * @param state 現在の状態
 * @param action 状態更新のアクション
 * @returns 更新後の状態
 */
const contactFormReducer = (
  state: ContactFormState,
  action: ContactFormAction,
): ContactFormState => {
  switch (action.type) {
    case 'SET_FORM_STEP':
      return {
        ...state,
        formStep: action.payload,
        hasAttemptedAdvance: false,
        hasValidationError: false,
      };
    case 'SET_ATTEMPTED_ADVANCE':
      return { ...state, hasAttemptedAdvance: action.payload };
    case 'SET_HAS_VALIDATION_ERROR':
      return { ...state, hasValidationError: action.payload };
    case 'FINISH_SENDING':
      return { ...state, formStep: 'RESULT' };
    default:
      return state;
  }
};

/**
 * Step 1：入力ステップを表示するラッパーコンポーネント。
 * ボタン操作で Step 2（確認）へ遷移できる。
 */
const InputStep = () => {
  const [state, dispatch] = useReducer(contactFormReducer, {
    formStep: 'INPUT',
    hasAttemptedAdvance: false,
    hasValidationError: false,
  });
  const { register, formState, trigger, handleSubmit } =
    useForm<ContactFormValues>({
      resolver: zodResolver(contactSchema),
      mode: 'onChange',
      defaultValues: CONTACT_DEFAULT_VALUES,
    });
  return (
    <ContactForm
      register={register}
      formState={formState}
      trigger={trigger}
      handleSubmit={handleSubmit}
      dispatch={dispatch}
      formStep={state.formStep}
      hasAttemptedAdvance={state.hasAttemptedAdvance}
    />
  );
};

/**
 * Step 2：確認ステップを表示するラッパーコンポーネント。
 * フィールドが読み取り専用になる。修正・送信ボタンを表示する。
 */
const ConfirmStep = () => {
  const [state, dispatch] = useReducer(contactFormReducer, {
    formStep: 'CONFIRM',
    hasAttemptedAdvance: false,
    hasValidationError: false,
  });
  const { register, formState, trigger, handleSubmit } =
    useForm<ContactFormValues>({
      resolver: zodResolver(contactSchema),
      mode: 'onChange',
      defaultValues: {
        name: '山田 太郎',
        email: 'taro.yamada@example.com',
        message: 'Webサイトのデザイン・開発についてご相談させてください。',
      },
    });
  return (
    <ContactForm
      register={register}
      formState={formState}
      trigger={trigger}
      handleSubmit={handleSubmit}
      dispatch={dispatch}
      formStep={state.formStep}
      hasAttemptedAdvance={state.hasAttemptedAdvance}
    />
  );
};

/**
 * Step 3：送信完了（成功）を表示するラッパーコンポーネント。
 * 成功メッセージと「Home へ戻る」ボタンを表示する。
 */
const ResultSuccess = () => {
  const [, dispatch] = useReducer(contactFormReducer, {
    formStep: 'RESULT',
    hasAttemptedAdvance: false,
    hasValidationError: false,
  });
  const { register, formState, trigger, handleSubmit } =
    useForm<ContactFormValues>({
      resolver: zodResolver(contactSchema),
      mode: 'onChange',
      defaultValues: CONTACT_DEFAULT_VALUES,
    });

  /** isSubmitSuccessful は RHF の内部状態のため true に上書きして渡す */
  const patchedFormState: FormState<ContactFormValues> = {
    ...formState,
    isSubmitSuccessful: true,
  };

  return (
    <ContactForm
      register={register}
      formState={patchedFormState}
      trigger={trigger}
      handleSubmit={handleSubmit}
      dispatch={dispatch}
      formStep="RESULT"
      hasAttemptedAdvance={false}
    />
  );
};

/**
 * Step 3：送信失敗（エラー）を表示するラッパーコンポーネント。
 * エラーメッセージと「Home へ戻る」ボタンを表示する。
 */
const ResultFailure = () => {
  const [, dispatch] = useReducer(contactFormReducer, {
    formStep: 'RESULT',
    hasAttemptedAdvance: false,
    hasValidationError: false,
  });
  const { register, formState, trigger, handleSubmit } =
    useForm<ContactFormValues>({
      resolver: zodResolver(contactSchema),
      mode: 'onChange',
      defaultValues: CONTACT_DEFAULT_VALUES,
    });
  return (
    <ContactForm
      register={register}
      formState={formState}
      trigger={trigger}
      handleSubmit={handleSubmit}
      dispatch={dispatch}
      formStep="RESULT"
      hasAttemptedAdvance={false}
    />
  );
};

/**
 * Step 1：内容入力フォーム。「入力内容の確認」ボタンで Step 2 へ遷移できる。
 */
export const InputStepStory: Story = {
  name: 'Step 1 - 内容入力',
  render: () => <InputStep />,
};

/**
 * Step 2：内容確認画面。フィールドが読み取り専用。修正・送信ボタンを表示する。
 */
export const ConfirmStepStory: Story = {
  name: 'Step 2 - 内容確認',
  render: () => <ConfirmStep />,
};

/**
 * Step 3：送信完了（成功）画面。成功メッセージを表示する。
 */
export const ResultSuccessStory: Story = {
  name: 'Step 3 - 送信完了（成功）',
  render: () => <ResultSuccess />,
};

/**
 * Step 3：送信失敗（エラー）画面。エラーメッセージを表示する。
 */
export const ResultFailureStory: Story = {
  name: 'Step 3 - 送信失敗（エラー）',
  render: () => <ResultFailure />,
};
