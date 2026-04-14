import { z } from 'zod';

import { type SectionHeader } from '@/types/common';
import { type StepStates } from '@/types/contact';

/** セクションの紹介文 */
export const INTRODUCTION: SectionHeader = {
  title: 'Contact',
  description: '質問、依頼などのお問合せはこちら。',
};

/** 確認メッセージ */
export const CONFIRM_MESSAGE =
  'このページを離れようとしています。変更内容は保存されません。';

/** ステップの状態 */
export const STEP_STATUS: StepStates = {
  NOT_STARTED: 'not_started',
  CURRENT: 'current',
  ERROR: 'error',
  COMPLETED: 'completed',
};

/** プログレスバーの各ステップに表示するラベル文言 */
export const STEP_LABELS = {
  INPUT: '内容入力',
  CONFIRM: '内容確認',
  SEND: '送信',
  SEND_SUCCESS: '送信完了',
  SEND_FAILURE: '送信失敗',
} as const;

/** お問い合わせフォームのボタンラベル */
export const BUTTON_LABELS = {
  EDIT: '修正する',
  SUBMIT: '送信',
  CHECK_INPUT: '入力内容の確認',
  BACK_HOME: 'Homeへ戻る',
} as const;

/** 送信結果のメッセージ */
export const RESULT_MESSAGES = {
  success: {
    title: '送信完了',
    description: 'お問い合わせは正常に送信されました。',
    notes: [
      'ご返信は土日祝を除く 1〜2 営業日以内を目安にしております。',
      '迷惑メールフォルダに振り分けられている場合がありますのでご確認ください。',
      'サーバートラブル等でメールが届かない場合は junpei.oue@gmail.com へ直接ご連絡ください。',
    ],
  },
  failure: {
    title: '送信エラー',
    description: '送信に失敗しました。',
    notes: [
      '時間をおいてから再度送信をお試しください。',
      'ネットワーク接続をご確認のうえ、ページをリロードしてお試しください。',
      '問題が解決しない場合は junpei.oue@gmail.com へ直接ご連絡ください。',
    ],
  },
} as const;

/**
 * お問い合わせフォームの Zod バリデーションスキーマ。
 * RFC 5322 準拠のメールアドレス検証を含む。
 */
export const contactSchema = z.object({
  /** 氏名（必須） */
  name: z.string().min(1, '名前を入力してください。'),

  /** メールアドレス（必須・フォーマット検証） */
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください。')
    .pipe(z.email('メールアドレスの形式が正しくありません。')),

  /** お問い合わせ本文（必須） */
  message: z.string().min(1, 'メッセージを入力してください。'),
});

/**
 * contactSchema から推論されるフォーム入力値の型。
 * react-hook-form の useForm ジェネリクスに使用する。
 */
export type ContactFormValues = z.infer<typeof contactSchema>;

/** お問い合わせフォームの初期値 */
export const CONTACT_DEFAULT_VALUES: ContactFormValues = {
  name: '',
  email: '',
  message: '',
};
