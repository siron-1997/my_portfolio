import cn from 'classnames';
import { useContactFormContext } from '@/contexts';
import { EMAIL_VALIDATION } from '@/constants/contact';
import s from '@/styles/contact/InputFields.module.css';

/**
 * コンタクトフォームの入力値検証と入力ハンドラを提供する。
 *
 * @returns 入力状態、エラー状態、入力ハンドラ群
 */
const useInputFields = () => {
  const {
    formStep,
    isNotNameEmpty,
    isNotEmailValid,
    emailErrorMessage,
    isNotMessageEmpty,
    isValidationError,
    isInitialValidationCheck,
    dispatch,
  } = useContactFormContext();

  /** 入力フィールドのクラス名 */
  const isFinishedFirstStep = formStep === 'SECOND_STEP';
  const inputNameClassNames = cn(s.text_field, {
    [s.default_text_field]: !isFinishedFirstStep && isNotNameEmpty,
    [s.edit_text_field]: !isFinishedFirstStep,
    [s.error_text_field]: isValidationError && !isNotNameEmpty,
  });
  const inputEmailClassNames = cn(s.text_field, {
    [s.default_text_field]: !isFinishedFirstStep && isNotEmailValid,
    [s.edit_text_field]: !isFinishedFirstStep,
    [s.error_text_field]: isValidationError && !isNotEmailValid,
  });
  const inputMessageClassNames = cn(s.textarea, {
    [s.default_text_field]: !isFinishedFirstStep && isNotMessageEmpty,
    [s.edit_text_field]: !isFinishedFirstStep,
    [s.error_text_field]: isValidationError && !isNotMessageEmpty,
  });

  /** 名前の変更時に実行する処理
   * @param e {React.ChangeEvent<HTMLInputElement>} イベントオブジェクト
   */
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const trimmedValue = e.target.value.trim();
    dispatch({
      type: 'CHANGE_NAME',
      payload: { value: trimmedValue, isValid: trimmedValue !== '' },
    });
  };

  /** Eメールの変更時に実行する処理
   * @param e {React.ChangeEvent<HTMLInputElement>} イベントオブジェクト
   */
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const trimmedValue = e.target.value.trim();

    if (trimmedValue === '') {
      dispatch({
        type: 'CHANGE_EMAIL',
        payload: {
          value: trimmedValue,
          isValid: false,
          errorMessage: 'メールアドレスを入力してください。',
        },
      });
    } else if (!EMAIL_VALIDATION.test(trimmedValue)) {
      dispatch({
        type: 'CHANGE_EMAIL',
        payload: {
          value: trimmedValue,
          isValid: false,
          errorMessage: 'メールアドレスの形式が正しくありません。',
        },
      });
    } else {
      dispatch({
        type: 'CHANGE_EMAIL',
        payload: { value: trimmedValue, isValid: true, errorMessage: '' },
      });
    }
  };

  /** メッセージの変更時に実行する処理
   * @param e {React.ChangeEvent<HTMLTextAreaElement>} イベントオブジェクト
   */
  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const trimmedValue = e.target.value.trim();
    dispatch({
      type: 'CHANGE_MESSAGE',
      payload: { value: trimmedValue, isValid: trimmedValue !== '' },
    });
  };

  return {
    emailErrorMessage,
    isNotNameEmpty,
    isNotEmailValid,
    isNotMessageEmpty,
    isValidationError,
    isFinishedFirstStep,
    isInitialValidationCheck,
    inputNameClassNames,
    inputEmailClassNames,
    inputMessageClassNames,
    handleChangeName,
    handleChangeEmail,
    handleChangeMessage,
  };
};

export default useInputFields;
