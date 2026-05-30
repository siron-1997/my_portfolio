import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useForm } from 'react-hook-form';

import InputFields from '@/components/contact/InputFields';
import {
  CONTACT_DEFAULT_VALUES,
  contactSchema,
  type ContactFormValues,
} from '@/constants/contact';

/**
 * InputFields コンポーネントの Storybook 定義。
 *
 * お問い合わせフォームの name / E-mail / Message フィールドを含む入力エリア。
 * 各フィールドは formStep に応じて編集可能（INPUT）または読み取り専用（CONFIRM）に切り替わる。
 * react-hook-form の register・formState を受け取るため、
 * render 関数内のラッパーコンポーネントで useForm を使用している。
 */
const meta = {
  title: 'Components/Contact/InputFields',
  component: InputFields,
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
    formStep: {
      control: 'select',
      options: ['INPUT', 'CONFIRM'],
      description: '現在のフォームステップ',
      table: { type: { summary: "'INPUT' | 'CONFIRM'" } },
    },
    hasAttemptedAdvance: {
      control: 'boolean',
      description:
        '「入力内容の確認」ボタンをクリックしたフラグ。true のときバリデーションエラーを表示する',
      table: { type: { summary: 'boolean' } },
    },
  },
} satisfies Meta<typeof InputFields>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 入力ステップ（空フィールド）を表示するラッパーコンポーネント。
 */
const InputStepEmpty = () => {
  const { register, formState } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: CONTACT_DEFAULT_VALUES,
  });
  return (
    <InputFields
      register={register}
      formState={formState}
      formStep="INPUT"
      hasAttemptedAdvance={false}
    />
  );
};

/**
 * 入力ステップ（バリデーションエラー表示）を表示するラッパーコンポーネント。
 * setError で各フィールドのエラーを擬似的に設定する。
 */
const InputStepWithError = () => {
  const { register, formState, setError } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: CONTACT_DEFAULT_VALUES,
  });

  /** マウント時にバリデーションエラーを擬似的に設定 */
  useEffect(() => {
    setError('name', { message: '名前を入力してください。' });
    setError('email', { message: 'メールアドレスを入力してください。' });
    setError('message', { message: 'メッセージを入力してください。' });
  }, [setError]);

  return (
    <InputFields
      register={register}
      formState={formState}
      formStep="INPUT"
      hasAttemptedAdvance={true}
    />
  );
};

/**
 * 確認ステップ（読み取り専用）を表示するラッパーコンポーネント。
 * 入力値をサンプルデータで設定する。
 */
const ConfirmStep = () => {
  const { register, formState } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: {
      name: '山田 太郎',
      email: 'taro.yamada@example.com',
      message:
        'Webサイトのデザイン・開発についてご相談させてください。\n詳細はお電話でもお伝えできます。',
    },
  });
  return (
    <InputFields
      register={register}
      formState={formState}
      formStep="CONFIRM"
      hasAttemptedAdvance={false}
    />
  );
};

/**
 * 入力ステップ。各フィールドが空の状態。
 */
export const Input: Story = {
  name: '入力ステップ（空フィールド）',
  render: () => <InputStepEmpty />,
};

/**
 * 入力ステップ（バリデーションエラー）。全フィールドにエラーメッセージを表示。
 */
export const InputError: Story = {
  name: '入力ステップ（バリデーションエラー）',
  render: () => <InputStepWithError />,
};

/**
 * 確認ステップ。フィールドが読み取り専用になる。
 */
export const Confirm: Story = {
  name: '確認ステップ（読み取り専用）',
  render: () => <ConfirmStep />,
};
