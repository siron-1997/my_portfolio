'use client';

import { useRef, useEffect } from 'react';
import { Typography } from '@mui/material';

import { INTRODUCTION } from '@/constants/contact';
import { StepProgressBar } from '@/components/contact/StepProgressBar';
import { useContactFormContext } from '@/contexts';
import { progressStatusAnimation } from '@/animations/contact';
import s from '@/styles/contact/ProgressStatus.module.css';

const ProgressStatus = () => {
  const progressStatusRef = useRef<HTMLDivElement>(null!);
  const { isSended } = useContactFormContext();

  let sendMessage = '';
  if (typeof isSended !== 'boolean') {
    sendMessage = '送信';
  } else {
    sendMessage = isSended ? '送信完了' : '送信失敗';
  }

  useEffect(() => {
    const ctx = progressStatusAnimation({
      title: progressStatusRef.current.querySelector('h1') as HTMLHeadingElement,
      progressBar: progressStatusRef.current.querySelector('div') as HTMLDivElement,
      progressStatusRef,
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={s.contact_txt} ref={progressStatusRef}>
      <Typography component="h1" variant="h1">
        {INTRODUCTION.title}
      </Typography>
      <div className={s.step_progress_bar_container}>
        <StepProgressBar
          wrapperClassName={s.wrapper}
          progressClassName={s.progress}
          labelClassName={s.progress_label}
          contentClassName={s.current_step_container}
          stepPoints={[
            {
              label: '内容入力',
              name: 'step 1',
              content: (
                <Typography component="p" variant="p" className={s.current_step}>
                  内容入力
                </Typography>
              ),
            },
            {
              label: '内容確認',
              name: 'step 2',
              content: (
                <Typography component="p" variant="p" className={s.current_step}>
                  内容確認
                </Typography>
              ),
            },
            {
              label: sendMessage,
              name: 'step 3',
              content: (
                <Typography component="p" variant="p" className={s.current_step}>
                  {sendMessage}
                </Typography>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ProgressStatus;
