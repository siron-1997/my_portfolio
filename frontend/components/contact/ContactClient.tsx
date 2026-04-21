'use client';

import React, { useReducer } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Container } from '@/components/common';
import ContactForm from '@/components/contact/ContactForm';
import ProgressStatus from '@/components/contact/ProgressStatus';
import {
  CONTACT_DEFAULT_VALUES,
  type ContactFormValues,
  contactSchema,
} from '@/constants/contact';
import { type ContactFormAction, type FormStep } from '@/types/contact';

import Sending from './Sending';

type ContactFormState = {
  /** フォームの現在のステップ */
  formStep: FormStep;

  /**「入力内容確認」ボタンをクリックしたフラグ */
  hasAttemptedAdvance: boolean;

  /** バリデーションエラーの発生フラグ */
  hasValidationError: boolean;
};

/** 初期値 */
const initialState: ContactFormState = {
  formStep: 'INPUT',
  hasAttemptedAdvance: false,
  hasValidationError: false,
};

/** フォームステップ、進行ボタンクリック実績、バリデーションエラーを管理
 *
 * @param state 現在の状態
 * @param action 状態更新の内容
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

const ContactClient = () => {
  /** フォームステップ・送信状態の状態 */
  const [state, dispatch] = useReducer(contactFormReducer, initialState);

  /** react-hook-form のフック */
  const { register, formState, trigger, handleSubmit } =
    useForm<ContactFormValues>({
      resolver: zodResolver(contactSchema),
      mode: 'onChange',
      defaultValues: CONTACT_DEFAULT_VALUES,
    });

  return (
    <>
      {/** 送信中の画面 */}
      <Sending isSending={formState.isSubmitting} />

      <div className="root_container">
        <Container className="top_container">
          <div className="container">
            {/** フォームの進行状況 */}
            <ProgressStatus
              formStep={state.formStep}
              isSubmitSuccessful={formState.isSubmitSuccessful}
              hasValidationError={state.hasValidationError}
            />

            {/** フォーム本体 */}
            <ContactForm
              register={register}
              formState={formState}
              trigger={trigger}
              handleSubmit={handleSubmit}
              dispatch={dispatch}
              formStep={state.formStep}
              hasAttemptedAdvance={state.hasAttemptedAdvance}
            />
          </div>
        </Container>
      </div>
    </>
  );
};

ContactClient.displayName = 'ContactClient';

export default ContactClient;
