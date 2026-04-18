'use client';

import React, { JSX, useEffect, useRef } from 'react';

import { Typography } from '@mui/material';

import { introductionAnimation } from '@/animations/about';
import { ABOUT_INTRODUCTION_SECTION_ID, INTRODUCTION } from '@/constants/about';
import s from '@/styles/about.module.css';

const Introduction = React.memo((): JSX.Element => {
  /** 紹介セクションの参照 Ref */
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    /** 紹介セクションのアニメーションコンテキスト */
    const ctx = introductionAnimation({
      section: ref.current.querySelector(
        `#${ABOUT_INTRODUCTION_SECTION_ID}`,
      ) as HTMLElement,
      ref,
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className={s.introduction} ref={ref}>
      <section className={s.profile_text} id={ABOUT_INTRODUCTION_SECTION_ID}>
        {/** 紹介タイトル */}
        <Typography component="h3" variant="h3">
          {INTRODUCTION.title}
        </Typography>

        {/** 紹介説明 */}
        <Typography component="p" variant="p">
          {INTRODUCTION.description}
        </Typography>
      </section>
    </div>
  );
});

Introduction.displayName = 'Introduction';

export default Introduction;
