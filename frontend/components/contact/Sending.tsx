'use client';

import { useEffect } from 'react';
import { Typography } from '@mui/material';
import cn from 'classnames';

import { useContactFormContext } from '@/contexts';
import s from '@/styles/contact/Sending.module.css';

const Sending = () => {
  const { isSending } = useContactFormContext();
  const classNames = cn(s.sending, { [s.sending_visible]: !isSending });

  useEffect(() => {
    const html = document.getElementsByTagName('html')[0];
    const body = document.body;

    if (isSending) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      html.style.overflow = 'auto';
      body.style.overflow = 'auto';
    }

    return () => {
      html.style.overflow = 'auto';
      body.style.overflow = 'auto';
    };
  }, [isSending]);

  return (
    <>
      {/* ページ遷移時の自動スクロールリセットをスキップさせないため空 div を配置 */}
      <div></div>
      <div className={classNames}>
        <div className={s.sending_container}>
          <Typography component="h1" variant="h1">
            送信中
          </Typography>
          <div id={s['fountainG']}>
            <div id={s['fountainG_1']} className={s.fountainG} />
            <div id={s['fountainG_2']} className={s.fountainG} />
            <div id={s['fountainG_3']} className={s.fountainG} />
            <div id={s['fountainG_4']} className={s.fountainG} />
            <div id={s['fountainG_5']} className={s.fountainG} />
            <div id={s['fountainG_6']} className={s.fountainG} />
            <div id={s['fountainG_7']} className={s.fountainG} />
            <div id={s['fountainG_8']} className={s.fountainG} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sending;
