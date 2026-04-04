'use client';

import { Typography, List } from '@mui/material';
import { Container } from '@/components/common';
import { WorkControl, WorkDetail } from '@/types/api';
import { BREAK_POINTS } from '@/constants/common';
import { APP_THEME_COLORS } from '@/constants/colors';
import ControlItems from './ControlItems';
import useControls from './useControls';
import s from '@/styles/works/workThreeD/Controls.module.css';

/** Props の型定義 */
type Props = {
  /** content */
  content: WorkDetail;
};

const Controls = ({ content }: Props) => {
  const { width, controlsRef, currentIndex, rootClassNames, handleClick } = useControls();

  return (
    <div className={rootClassNames} id="controls" ref={controlsRef}>
      <Container>
        <div>
          <section className={s.work_shadow}>
            <Typography component="h2" variant="h2">
              {content.controls_title}
            </Typography>
            <Typography component="p" variant="p" sx={{ maxWidth: 650 }}>
              {content.controls_description}
            </Typography>
          </section>
          {/* PC */}
          <div
            id="contents-pc"
            className={s.controls_contents_pc}
            style={{ display: width! >= BREAK_POINTS.SM ? 'flex' : 'none' }}
          >
            <List
              sx={{
                width: 350,
                padding: 0,
                mt:
                  width! >= BREAK_POINTS.SM && width! < BREAK_POINTS.LG
                    ? 6
                    : width! >= BREAK_POINTS.LG
                      ? 7
                      : 0,
              }}
            >
              {content.controls.map((item: WorkControl, i: number) => (
                <ControlItems
                  key={i}
                  index={i}
                  title={item.title}
                  description={item.description}
                  className={`${s.control_list} ${currentIndex === i && s.current}`}
                  onClick={() => handleClick(i)}
                />
              ))}
            </List>
          </div>
          {/* Mobile */}
          <div
            id="contents-mb"
            className={s.controls_contents_mb}
            style={{ display: width! < BREAK_POINTS.SM ? 'flex' : 'none' }}
          >
            <List
              sx={{ width: width! > BREAK_POINTS.LG ? 350 : 300 }}
              id="controls-mb-text"
            >
              {content.controls.map((item: WorkControl, i: number) => (
                <ControlItems
                  key={i}
                  index={i}
                  title={item.title}
                  description={item.description}
                  className={`${s.control_list} ${s.work_shadow} ${currentIndex === i && s.current}`}
                  style={{ display: currentIndex === i ? 'flex' : 'none' }}
                  onClick={() => handleClick(i)}
                />
              ))}
            </List>
            {/* Carousel */}
            <List
              sx={{
                display: 'flex',
                gap: width! >= BREAK_POINTS.XS ? 2.3 : 1.6,
                margin: '0 auto 30px auto',
                padding: '8px 16px',
              }}
              id="controls-mb-carousel"
            >
              {content.controls.map((_, i: number) => (
                <Typography
                  key={i}
                  component="span"
                  sx={{
                    width: width! >= BREAK_POINTS.XS ? 50 : 35,
                    height: width! >= BREAK_POINTS.XS ? 6 : 8,
                    borderRadius: 0.2,
                    bgcolor:
                      currentIndex === i
                        ? APP_THEME_COLORS.navigation
                        : APP_THEME_COLORS.text.dark,
                    opacity: currentIndex === i ? 1 : 0.35,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleClick(i)}
                />
              ))}
            </List>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Controls;
