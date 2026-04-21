'use client';

import React, { type JSX, useCallback, useEffect } from 'react';
import Link from 'next/link';

import { Typography } from '@mui/material';
import axios from 'axios';
import cn from 'classnames';
import {
  type FormState,
  type UseFormHandleSubmit,
  type UseFormRegister,
  type UseFormTrigger,
} from 'react-hook-form';

import { Button } from '@/components/common';
import InputFields from '@/components/contact/InputFields';
import { APP_THEME_COLORS } from '@/constants/colors';
import {
  BUTTON_LABELS,
  CONFIRM_MESSAGE,
  type ContactFormValues,
  RESULT_MESSAGES,
} from '@/constants/contact';
import s from '@/styles/contact.module.css';
import { type ContactFormAction, type FormStep } from '@/types/contact';

type Props = {
  /** RHF の register 関数 */
  register: UseFormRegister<ContactFormValues>;

  /** RHF のフォーム状態 */
  formState: FormState<ContactFormValues>;

  /** バリデーションを実行する関数 (確認ステップ移行前に実行) */
  trigger: UseFormTrigger<ContactFormValues>;

  /** RHF の handleSubmit 関数（送信前バリデーションラッパー） */
  handleSubmit: UseFormHandleSubmit<ContactFormValues>;

  /** フォームステップ・送信状態を更新する関数 */
  dispatch: React.Dispatch<ContactFormAction>;

  /** 現在のフォームステップ */
  formStep: FormStep;

  /**「入力内容確認」ボタンをクリックしたフラグ */
  hasAttemptedAdvance: boolean;
};

const ContactForm = React.memo(
  ({
    register,
    formState,
    trigger,
    handleSubmit,
    dispatch,
    formStep,
    hasAttemptedAdvance,
  }: Props): JSX.Element => {
    const classNames = cn(s.form_custom_container, 'shadow_container', {
      /** 最終ステップのときのみクラス名を適用 */
      [s.end_form]: formStep === 'RESULT',
    });

    /** 送信結果のメッセージ */
    const result =
      RESULT_MESSAGES[formState.isSubmitSuccessful ? 'success' : 'failure'];

    /** 入力内容を検証して「確認」ステップへ進める処理 */
    const handleEndInput = useCallback(async (): Promise<void> => {
      /** 「入力内容確認」ボタンをクリックしたフラグを設定 */
      dispatch({ type: 'SET_ATTEMPTED_ADVANCE', payload: true });

      /** 検証エラーが発生している場合は処理を中断 */
      const isValid = await trigger();
      if (!isValid) {
        dispatch({ type: 'SET_HAS_VALIDATION_ERROR', payload: true });
        return;
      }

      /** 「内容確認」ステップに移動 */
      dispatch({ type: 'SET_FORM_STEP', payload: 'CONFIRM' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [trigger, dispatch]);

    /** 「確認」ステップから「入力」ステップに戻る処理 */
    const handleGoBackToInput = useCallback((): void => {
      dispatch({ type: 'SET_FORM_STEP', payload: 'INPUT' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [dispatch]);

    /** フォーム送信時の処理
     *
     * react-hook-form の handleSubmit でラップした送信ハンドラ。
     * zod バリデーション通過後に /api/contact へリクエストを送る。
     *
     * @param data フォームの入力値
     */
    const onSubmit = handleSubmit(
      async (data: ContactFormValues): Promise<void> => {
        try {
          await axios.post(
            process.env.NEXT_PUBLIC_BASE_URL + '/api/contact',
            data,
            {
              headers: { 'Content-Type': 'application/json' },
            },
          );
        } finally {
          dispatch({ type: 'FINISH_SENDING' });
        }
      },
    );

    /** ブラウザの戻る/更新を検知して警告 */
    useEffect(() => {
      /** ページ離脱時の警告メッセージを表示する処理
       *
       * ユーザーが入力途中でページを離れようとした際に、確認ダイアログを表示して誤操作を防止する。
       *
       * @param e BeforeUnloadEvent オブジェクト
       * @returns 確認メッセージ（ブラウザによっては表示されない）
       */
      const handleBeforeUnload = (e: BeforeUnloadEvent): void => {
        e.preventDefault();
      };

      /** ブラウザの戻る操作を検知して警告を表示する処理
       *
       * ユーザーがブラウザの戻るボタンを押した際に、確認ダイアログを表示して誤操作を防止する。
       */
      const handlePopstate = (): void => {
        /** 確認ダイアログで OK なら履歴を戻し、キャンセルなら現在の URL を履歴に追加して遷移を防ぐ */
        if (window.confirm(CONFIRM_MESSAGE)) {
          window.history.back();
        } else {
          history.pushState(null, '', null);
        }
      };

      /** 入力済みかつ送信完了前の場合のみイベントリスナーを登録 */
      if (formState.isDirty && formStep !== 'RESULT') {
        history.pushState(null, '', null);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopstate);
      }

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopstate);
      };
    }, [formState.isDirty, formStep]);

    return (
      <div className={s.form_container}>
        <div
          className={classNames}
          style={{ backgroundColor: APP_THEME_COLORS.bgColor.dark.sub }}
        >
          {/** 最終ステップ以外のときはフォームを表示 */}
          {formStep !== 'RESULT' ? (
            <form className={s.form} onSubmit={onSubmit} name="form" noValidate>
              <InputFields
                register={register}
                formState={formState}
                formStep={formStep}
                hasAttemptedAdvance={hasAttemptedAdvance}
              />
              <div className={s.btn_container}>
                {/** 確認ステップのときは修正・送信ボタンを表示 */}
                {formStep === 'CONFIRM' ? (
                  <>
                    <Button type="button" onClick={handleGoBackToInput}>
                      {BUTTON_LABELS.EDIT}
                    </Button>
                    <Button type="submit">{BUTTON_LABELS.SUBMIT}</Button>
                  </>
                ) : (
                  /** 入力ステップのときは確認ボタンを表示 */
                  <Button type="button" onClick={handleEndInput}>
                    {BUTTON_LABELS.CHECK_INPUT}
                  </Button>
                )}
              </div>
            </form>
          ) : (
            /** 最終ステップのときは送信結果を表示 */
            <>
              <div className={s.txt_container}>
                {/** 送信結果のメッセージタイトル */}
                <Typography component="h3" variant="h3">
                  {result.title}
                </Typography>

                {/** 送信結果のメッセージ内容 */}
                <Typography component="p" variant="p">
                  {result.description}
                </Typography>

                <br />

                {/** 送信結果の補足メッセージ */}
                {result.notes.map((note) => (
                  <Typography key={note} component="p" variant="p">
                    {note}
                  </Typography>
                ))}
              </div>

              {/** ホームへ戻るボタン */}
              <div className={s.btn_container}>
                <Link href="/">
                  <Button>{BUTTON_LABELS.BACK_HOME}</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
);

ContactForm.displayName = 'ContactForm';

export default ContactForm;
