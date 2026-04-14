'use client';

import React, { useEffect } from 'react';

import { Typography } from '@mui/material';
import cn from 'classnames';

import s from '@/styles/contact/Sending.module.css';

type Props = {
  /** 送信中フラグ */
  isSending: boolean;
};

const Sending = React.memo(({ isSending }: Props) => {
  const classNames = cn(
    s.sending,
    /** 送信中フラグに応じて表示を切り替え */
    { [s.sending_visible]: !isSending },
  );

  /** 送信中フラグに応じてスクロールを制御 */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    /** 送信中のときはスクロールを無効化 */
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
          {/* タイトル */}
          <Typography component="h1" variant="h1">
            送信中
          </Typography>

          {/* ローディングアニメーション (アイコン) */}
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
});

Sending.displayName = 'Sending';

export default Sending;
