'use client';

import { useEffect } from 'react';
import { Typography } from '@mui/material';
import cn from 'classnames';

import { Container } from '@/components/common';
import { ToggleButton } from '@/components/works/workThreeD/ToggleButton';
import { FingerPress } from '@/components/works/workThreeD/FingerPress';
import { useWorkThreeDContext } from '@/contexts';
import { introductionAnimation } from '@/animations/workThreeD';
import { WorkDetail } from '@/types/api';
import s from '@/styles/works/workThreeD/Introduction.module.css';

/**
 * Introduction コンポーネントの Props。
 * 3D ビューワーページの作品紹介テキストと操作ガイドを表示するセクション。
 */
type Props = {
  /** 表示する作品の詳細データ */
  content: WorkDetail;
};

const Introduction = ({ content }: Props) => {
  const {
    refs: { introductionRef },
    state: { isLoading, isViewerActive },
  } = useWorkThreeDContext();
  const classNames = cn('root_container', s.introduction, {
    [s.not_active]: !isViewerActive,
  });

  useEffect(() => {
    if (!isLoading) {
      const ctx = introductionAnimation({
        section: introductionRef.current.querySelector('section')!,
        introductionRef,
      });
      return () => {
        ctx.revert();
      };
    }
  }, [isLoading, introductionRef]);

  return (
    <div className={classNames} id="introduction" ref={introductionRef}>
      <Container style={{ position: 'relative', height: '100%' }}>
        <section>
          <Typography component="h2" variant="h2">
            {content.introduction_title}
          </Typography>
          <Typography component="p" variant="p" sx={{ maxWidth: 650 }}>
            {content.introduction_description}
          </Typography>
          <FingerPress />
          <ToggleButton />
        </section>
      </Container>
    </div>
  );
};

export default Introduction;
