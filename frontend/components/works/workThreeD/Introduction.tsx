'use client';

import React, { useEffect } from 'react';
import type { JSX, Dispatch, RefObject } from 'react';

import { Typography } from '@mui/material';
import cn from 'classnames';

import { introductionAnimation } from '@/animations/workThreeD';
import { Container } from '@/components/common';
import FingerPress from '@/components/works/workThreeD/FingerPress';
import ToggleButton from '@/components/works/workThreeD/ToggleButton';
import s from '@/styles/works/workThreeD/workThreeDodule.css';
import { type WorkDetail } from '@/types/api';
import { type WorkThreeDAction } from '@/types/contexts';

type Props = {
  /** 表示する作品の詳細データ */
  content: WorkDetail;

  /** Introduction セクションの参照 Ref */
  introductionRef: RefObject<HTMLDivElement | null>;

  /** 3Dモデルのロード中フラグ */
  isLoading: boolean;

  /** ビュワーアクティブフラグ */
  isViewerActive: boolean;

  /** 指アイコン表示フラグ */
  isFingerVisible: boolean;

  /** トグルボタンの参照 Ref */
  toggleButtonRef: RefObject<HTMLDivElement | null>;

  /** work 個別ページの状態 (3D) を更新する関数 */
  dispatch: Dispatch<WorkThreeDAction>;
};

const Introduction = React.memo(
  ({
    content,
    introductionRef,
    isLoading,
    isViewerActive,
    isFingerVisible,
    toggleButtonRef,
    dispatch,
  }: Props): JSX.Element => {
    const classNames = cn('root_container', s.introduction, {
      [s.not_active]: !isViewerActive,
    });

    useEffect(() => {
      if (isLoading || !introductionRef.current) return;

      /** イントロダクションアニメーションの初期化 */
      const ctx = introductionAnimation({
        section: introductionRef.current.querySelector('section')!,
        ref: introductionRef,
      });

      return () => {
        ctx.revert();
      };
    }, [isLoading, introductionRef]);

    return (
      <div className={classNames} id="introduction" ref={introductionRef}>
        <Container style={{ position: 'relative', height: '100%' }}>
          <section>
            {/** タイトル */}
            <Typography component="h2" variant="h2">
              {content.introduction_title}
            </Typography>

            {/** 説明文 */}
            <Typography component="p" variant="p" sx={{ maxWidth: 650 }}>
              {content.introduction_description}
            </Typography>

            {/** 操作ガイド */}
            <FingerPress
              isFingerVisible={isFingerVisible}
              isViewerActive={isViewerActive}
              dispatch={dispatch}
            />

            {/** トグルボタン */}
            <ToggleButton
              isViewerActive={isViewerActive}
              toggleButtonRef={toggleButtonRef}
              dispatch={dispatch}
            />
          </section>
        </Container>
      </div>
    );
  },
);

Introduction.displayName = 'Introduction';

export default Introduction;
