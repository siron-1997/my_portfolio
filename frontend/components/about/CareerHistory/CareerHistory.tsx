'use client';

import { Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import {
  Timeline,
  TimelineContent,
  TimelineConnector,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  timelineItemClasses,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from '@mui/lab';
import { CAREER_HISTORIES } from '@/constants/about';
import useCareerHistory from './useCareerHistory';
import s from '@/styles/about/CareerHistory.module.css';

const CareerHistory = () => {
  const { careerHistoryRef, isMobile } = useCareerHistory();

  return (
    <div className={s.container} ref={careerHistoryRef}>
      <Timeline
        sx={{
          padding: 0,
          // 年代表示エリアの幅を調整
          ...(!isMobile && {
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0, // 年代表示エリアの幅を調整
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
          <div key={i} className="career-history-item">
            <TimelineItem>
              {/* 年 (PC表示時) */}
              {!isMobile && (
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
              {/* タイムラインの接続部分 (線とビット) - 中央の軸 */}
              <TimelineSeparator>
                <TimelineDot color={history.color}>
                  {history.iconType === 'school' ? <SchoolIcon /> : <WorkIcon />}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              {/* 内容 (タイトルと説明) */}
              <TimelineContent sx={{ py: '12px', pl: 2, pr: 0 }}>
                {/* 年 (モバイル表示時) */}
                {isMobile && (
                  <Typography component="p" variant="p" fontWeight="bold">
                    {history.year}
                  </Typography>
                )}
                <Typography component="h5" variant="h5">
                  {history.title}
                </Typography>
                <Typography component="p" variant="p" sx={{ whiteSpace: 'pre-wrap' }}>
                  {history.description}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </div>
        ))}
      </Timeline>
    </div>
  );
};

export default CareerHistory;
