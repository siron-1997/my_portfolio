import { useState, useEffect } from 'react';
import axios from 'axios';
import cn from 'classnames';
import { useContactFormContext } from '@/contexts';
import { CONFIRM_MESSAGE } from '@/constants/contact';
import s from '@/styles/contact/ContactForm.module.css';

/**
 * コンタクトフォーム全体のアクションと送信ロジックを管理する。
 *
 * @returns フォーム描画に必要な状態とイベントハンドラ
 */
const useContactForm = () => {
  const {
    name,
    email,
    message,
    formStep,
    isSended,
    isNotNameEmpty,
    isNotEmailValid,
    isNotMessageEmpty,
    isInitialValidationCheck,
    dispatch,
  } = useContactFormContext();

  const [sendMessage, setSendMessage] = useState({
    title: '',
    description: '',
  });

  const classNames = cn(s.form_custom_container, 'shadow_container', {
    [s.end_form]: formStep === 'LAST_STEP',
  });

  /**
   * 入力内容を検証して次ステップへ進める。
   * @returns {void} 戻り値は返さない
   */
  const handleEndInput = () => {
    /** 初回バリデーションチェックが未実施の場合 */
    if (!isInitialValidationCheck) {
      dispatch({ type: 'SET_INITIAL_VALIDATION_CHECK', payload: true });
    }

    /** Eメールが未入力、かつ入力検証で問題がある場合 (初回時を想定) */
    if (email === '' && !isNotEmailValid) {
      dispatch({
        type: 'SET_EMAIL_ERROR_MESSAGE',
        payload: 'メールアドレスを入力してください。',
      });
    }

    /** 名前、Eメール、メッセージの入力内容の検証 */
    if (!isNotNameEmpty || !isNotEmailValid || !isNotMessageEmpty) {
      dispatch({ type: 'SET_VALIDATION_ERROR', payload: true });
      dispatch({ type: 'SET_FORM_STEP', payload: 'FIRST_STEP' });
      return;
    }

    dispatch({ type: 'SET_VALIDATION_ERROR', payload: false });
    dispatch({ type: 'SET_FORM_STEP', payload: 'SECOND_STEP' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 入力ステップへ戻す。
   * @returns {void} 戻り値は返さない
   */
  const handleGoBackToInput = () => {
    dispatch({ type: 'SET_FORM_STEP', payload: 'FIRST_STEP' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * お問い合わせ内容を送信する。
   * @param e - フォーム送信イベント
   * @returns {Promise<void>} 送信完了までの Promise
   
 *
 * @example
 * await handleSubmit(e);
 */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({ type: 'START_SENDING' });
    let sendedResult: boolean | undefined;
    try {
      const values = { name, email, message };
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + '/api/sendGridEmail',
        values,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (response.status === 200) {
        sendedResult = true;
        setSendMessage({
          title: '送信完了',
          description: 'お問い合わせは正常に送信されました。',
        });
      }
    } catch (_error) {
      sendedResult = false;
      setSendMessage({
        title: '送信エラー',
        description: '送信に失敗しました。時間をおいて再度お試し下さい。',
      });
    } finally {
      dispatch({ type: 'FINISH_SENDING', payload: { isSended: sendedResult } });
    }
  };

  /** ブラウザの戻る/更新を検知して警告 */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = CONFIRM_MESSAGE;
      return CONFIRM_MESSAGE;
    };

    const handlePopstate = () => {
      if (window.confirm(CONFIRM_MESSAGE)) {
        window.history.back();
      } else {
        history.pushState(null, '', null);
      }
    };

    const hasUnsavedChanges = name !== '' || email !== '' || message !== '';
    if (hasUnsavedChanges) {
      history.pushState(null, '', null);
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopstate);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [name, email, message]);

  return {
    isSended,
    classNames,
    formStep,
    sendMessage,
    handleEndInput,
    handleGoBackToInput,
    handleSubmit,
  };
};

export default useContactForm;
