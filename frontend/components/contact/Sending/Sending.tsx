'use client';

import { Typography } from '@mui/material';
import useSending from './useSending';
import s from '@/styles/contact/Sending.module.css';

const Sending = () => {
  const { classNames } = useSending();

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
