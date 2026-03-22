'use client';

import { Typography } from '@mui/material';
import { INTRODUCTION } from '@/constants/contact';
import { StepProgressBar } from '@/components/contact/StepProgressBar';
import useProgressStatus from './useProgressStatus';
import s from '@/styles/contact/ProgressStatus.module.css';

const ProgressStatus = () => {
  const { progressStatusRef, sendMessage } = useProgressStatus();

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
