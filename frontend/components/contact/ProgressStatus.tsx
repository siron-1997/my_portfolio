'use client';

import { Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';

import { progressStatusAnimation } from '@/animations/contact';
import { INTRODUCTION } from '@/constants/contact';
import { FormStep } from '@/types/contact';
import StepProgressBar from '@/components/contact/StepProgressBar';
import s from '@/styles/contact/ProgressStatus.module.css';

type Props = {
  /** 現在のフォームステップ */
  formStep: FormStep;

  /** 送信結果の成功フラグ */
  isSubmitSuccessful: boolean;

  /** バリデーションエラーの発生フラグ */
  hasValidationError: boolean;
};

const ProgressStatus = React.memo(
  ({ formStep, isSubmitSuccessful, hasValidationError }: Props) => {
    /** 進捗ステータスの参照 Ref */
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!ref.current) return;

      /** 進捗ステータスのアニメーションを初期化 */
      const ctx = progressStatusAnimation({
        title: ref.current.querySelector('h1') as HTMLHeadingElement,
        progressBar: ref.current.querySelector('div') as HTMLDivElement,
        progressStatusRef: ref,
      });

      return () => {
        ctx.revert();
      };
    }, []);

    return (
      <div className={s.contact_txt} ref={ref}>
        {/* タイトル */}
        <Typography component="h1" variant="h1">
          {INTRODUCTION.title}
        </Typography>

        {/* ステップ進行バー */}
        <div className={s.step_progress_bar_container}>
          <StepProgressBar
            formStep={formStep}
            isSubmitSuccessful={isSubmitSuccessful}
            hasValidationError={hasValidationError}
            wrapperClassName={s.wrapper}
            progressClassName={s.progress}
            labelClassName={s.progress_label}
            contentClassName={s.current_step_container}
            currentStepClassName={s.current_step}
          />
        </div>
      </div>
    );
  },
);

ProgressStatus.displayName = 'ProgressStatus';

export default ProgressStatus;
