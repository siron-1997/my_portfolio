import cn from 'classnames';
import React from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';

import { ContactFormValues } from '@/constants/contact';
import Label from '@/components/contact/Label';
import { FormStep } from '@/types/contact';
import s from '@/styles/contact/InputFields.module.css';

type Props = {
  /** RHF の register 関数 */
  register: UseFormRegister<ContactFormValues>;

  /** RHF のフォーム状態 */
  formState: FormState<ContactFormValues>;

  /** 現在のフォームステップ */
  formStep: FormStep;

  /**「入力内容確認」ボタンをクリックしたフラグ */
  hasAttemptedAdvance: boolean;
};

const InputFields = React.memo(
  ({ register, formState, formStep, hasAttemptedAdvance }: Props) => {
    const { errors } = formState;

    /** 確認ステップかどうか */
    const isConfirmStep = formStep === 'CONFIRM';

    const inputNameClassNames = cn(s.text_field, {
      /** デフォルトのクラス名 (※確認ステップ以外、かつエラーがない場合) */
      [s.default_text_field]: !isConfirmStep && !(hasAttemptedAdvance && errors.name),
      /** 編集時のクラス名 (※確認ステップ以外でエラーがない場合) */
      [s.edit_text_field]: !isConfirmStep,
      /** エラー発生時のクラス名 (※エラーがある場合) */
      [s.error_text_field]: hasAttemptedAdvance && !!errors.name,
    });

    const inputEmailClassNames = cn(s.text_field, {
      /** デフォルトのクラス名 (※確認ステップ以外、かつエラーがない場合) */
      [s.default_text_field]: !isConfirmStep && !(hasAttemptedAdvance && errors.email),
      /** 編集時のクラス名 (※確認ステップ以外でエラーがない場合) */
      [s.edit_text_field]: !isConfirmStep,
      /** エラー発生時のクラス名 (※エラーがある場合) */
      [s.error_text_field]: hasAttemptedAdvance && !!errors.email,
    });

    const inputMessageClassNames = cn(s.textarea, {
      /** デフォルトのクラス名 (※確認ステップ以外、かつエラーがない場合) */
      [s.default_text_field]: !isConfirmStep && !(hasAttemptedAdvance && errors.message),
      /** 編集時のクラス名 (※確認ステップ以外でエラーがない場合) */
      [s.edit_text_field]: !isConfirmStep,
      /** エラー発生時のクラス名 (※エラーがある場合) */
      [s.error_text_field]: hasAttemptedAdvance && !!errors.message,
    });

    return (
      <>
        {/* name (名前の入力フィールド) */}
        <div className={s.input_container}>
          <Label title="name" id="input-name" isConfirmStep={isConfirmStep} />
          <input
            id="input-name"
            type="text"
            readOnly={isConfirmStep}
            className={inputNameClassNames}
            suppressHydrationWarning
            {...register('name')}
          />

          {/* 名前の入力エラー発生時に表示する */}
          {hasAttemptedAdvance && errors.name && (
            <div className={s.error}>{errors.name.message}</div>
          )}
        </div>

        {/* email (メールの入力フィールド) */}
        <div className={s.input_container}>
          <Label title="E-mail" id="input-email" isConfirmStep={isConfirmStep} />
          <input
            id="input-email"
            type="email"
            readOnly={isConfirmStep}
            className={inputEmailClassNames}
            suppressHydrationWarning
            {...register('email')}
          />

          {/* メールの入力エラー発生時に表示する */}
          {hasAttemptedAdvance && errors.email && (
            <div className={s.error}>{errors.email.message}</div>
          )}
        </div>

        {/* message (メッセージの入力フィールド) */}
        <div className={s.input_container}>
          <Label title="Message" id="input-textarea" isConfirmStep={isConfirmStep} />
          <textarea
            id="input-textarea"
            readOnly={isConfirmStep}
            className={inputMessageClassNames}
            suppressHydrationWarning
            {...register('message')}
          />

          {/* メッセージの入力エラー発生時に表示する */}
          {hasAttemptedAdvance && errors.message && (
            <div className={s.error}>{errors.message.message}</div>
          )}
        </div>
      </>
    );
  },
);

InputFields.displayName = 'InputFields';

export default InputFields;
