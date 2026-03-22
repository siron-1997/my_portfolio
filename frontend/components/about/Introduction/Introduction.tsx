'use client';

import { Typography } from '@mui/material';
import { INTRODUCTION } from '@/constants/about';
import useIntroduction from './useIntroduction';
import s from '@/styles/about/Introduction.module.css';

const Introduction = () => {
  const { introductionRef, sectionId } = useIntroduction();

  return (
    <div className={s.introduction} ref={introductionRef}>
      <section className={s.profile_text} id={sectionId}>
        <Typography component="h3" variant="h3">
          {INTRODUCTION.title}
        </Typography>
        <Typography component="p" variant="p">
          {INTRODUCTION.description}
        </Typography>
      </section>
    </div>
  );
};

export default Introduction;
