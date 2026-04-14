'use client';

import React, { useEffect, useRef } from 'react';

import { Typography } from '@mui/material';

import { introductionAnimation } from '@/animations/about';
import { INTRODUCTION } from '@/constants/about';
import s from '@/styles/about/Introduction.module.css';

const Introduction = React.memo(() => {
  /** 紹介セクションの参照 Ref */
  const ref = useRef<HTMLDivElement | null>(null);

  /** 紹介セクションの ID */
  const sectionId = 'about-introduction-section';

  useEffect(() => {
    if (!ref.current) return;

    /** 紹介セクションのアニメーションコンテキスト */
    const ctx = introductionAnimation({
      section: ref.current.querySelector(`#${sectionId}`) as HTMLElement,
      introductionRef: ref,
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className={s.introduction} ref={ref}>
      <section className={s.profile_text} id={sectionId}>
        {/* 紹介タイトル */}
        <Typography component="h3" variant="h3">
          {INTRODUCTION.title}
        </Typography>

        {/* 紹介説明 */}
        <Typography component="p" variant="p">
          {INTRODUCTION.description}
        </Typography>
      </section>
    </div>
  );
});

Introduction.displayName = 'Introduction';

export default Introduction;
