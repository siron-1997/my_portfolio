'use client';

import React, { JSX, useEffect, useRef } from 'react';

import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  timelineItemClasses,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from '@mui/lab';
import { Typography } from '@mui/material';

import { careerHistoryAnimation } from '@/animations/about';
import {
  ABOUT_CAREER_HISTORY_ITEM_CLASS,
  CAREER_HISTORIES,
} from '@/constants/about';
import { BREAK_POINTS } from '@/constants/common';
import { useWindowSize } from '@/hooks';
import s from '@/styles/about.module.css';

const CareerHistory = React.memo((): JSX.Element => {
  /** 職務経歴の参照 Ref */
  const ref = useRef<HTMLDivElement | null>(null);

  /** ウィンドウ幅 */
  const { width } = useWindowSize();

  useEffect(() => {
    if (!ref.current) return;

    /** 職務経歴アニメーションの初期化 */
    const ctx = careerHistoryAnimation({
      elements: ref.current?.querySelectorAll(
        `.${ABOUT_CAREER_HISTORY_ITEM_CLASS}`,
      ) as NodeListOf<HTMLElement>,
      ref,
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className={s.career_history_container} ref={ref}>
      <Timeline
        sx={{
          padding: 0,
          /** 年代表示エリアの幅を調整、モバイル表示時は非表示 */
          ...(!(width && width <= BREAK_POINTS.XS) && {
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0,
              minWidth: '75px',
              paddingLeft: '0',
            },
          }),
          [`& .${timelineItemClasses.root}:before`]: {
            content: 'none',
            flex: 0,
            padding: 0,
          },
        }}
      >
        {CAREER_HISTORIES.map((history, i) => (
          <div key={i} className={ABOUT_CAREER_HISTORY_ITEM_CLASS}>
            <TimelineItem>
              {/** 年 (PC表示時) */}
              {!(width && width <= BREAK_POINTS.XS) && (
                <TimelineOppositeContent
                  sx={{
                    py: '18px',
                    px: 2,
                    fontWeight: 'bold',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {history.year}
                </TimelineOppositeContent>
              )}

              {/** タイムラインの接続部分 (線とドット) */}
              <TimelineSeparator>
                <TimelineDot color={history.color}>
                  {history.iconType === 'school' ? (
                    <SchoolIcon />
                  ) : (
                    <WorkIcon />
                  )}
                </TimelineDot>

                <TimelineConnector />
              </TimelineSeparator>

              {/** 内容 (タイトルと説明) */}
              <TimelineContent sx={{ py: '12px', pl: 2, pr: 0 }}>
                {/** 年 (モバイル表示時) */}
                {width && width <= BREAK_POINTS.XS && (
                  <Typography component="p" variant="p" fontWeight="bold">
                    {history.year}
                  </Typography>
                )}

                {/* タイトル */}
                <Typography component="h5" variant="h5">
                  {history.title}
                </Typography>

                {/* 説明 */}
                <Typography
                  component="p"
                  variant="p"
                  sx={{ whiteSpace: 'pre-wrap' }}
                >
                  {history.description}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </div>
        ))}
      </Timeline>
    </div>
  );
});

CareerHistory.displayName = 'CareerHistory';

export default CareerHistory;
