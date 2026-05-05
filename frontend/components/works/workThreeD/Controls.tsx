'use client';

import React, { useCallback, useEffect } from 'react';

import { List, Typography } from '@mui/material';
import cn from 'classnames';
import type { Dispatch, JSX, RefObject } from 'react';

import { controlsAnimation } from '@/animations/workThreeD';
import { Container } from '@/components/common';
import ControlItems from '@/components/works/workThreeD/ControlItems';
import { APP_THEME_COLORS } from '@/constants/colors';
import { BREAK_POINTS } from '@/constants/common';
import { useWindowSize } from '@/hooks';
import s from '@/styles/workThreeD.module.css';
import { type WorkControl, type WorkDetail } from '@/types/api';
import { type WorkThreeDAction } from '@/types/contexts';

type Props = {
  /** 表示する作品の詳細データ */
  content: WorkDetail;

  /** Controls セクションのルート要素の ref */
  controlsRef: RefObject<HTMLDivElement | null>;

  /** 現在選択中のコントロールインデックス */
  currentIndex: number;

  /** 3Dモデルのロード中フラグ */
  isLoading: boolean;

  /** work 個別ページの状態 (3D) を更新する関数 */
  dispatch: Dispatch<WorkThreeDAction>;
};

const Controls = React.memo(
  ({
    content,
    controlsRef,
    currentIndex,
    isLoading,
    dispatch,
  }: Props): JSX.Element => {
    /** ウィンドウ幅の取得 */
    const { width } = useWindowSize();

    const rootClassNames = cn('root_container', s.controls);

    /** コントロール項目のクリックハンドラ */
    const handleClick = useCallback(
      (index: number): void => {
        dispatch({ type: 'NAVIGATE_TO', payload: index });
      },
      [dispatch],
    );

    useEffect(() => {
      if (!isLoading || !controlsRef.current) return;

      /** Controls セクションのアニメーションを初期化 */
      const ctx = controlsAnimation({
        section: controlsRef.current.querySelector('section')!,
        listPC: controlsRef.current.querySelector('#contents-pc')!,
        listMB: controlsRef.current.querySelector('#contents-mb')!,
        ref: controlsRef,
      });

      return () => {
        ctx.revert();
      };
    }, [controlsRef, isLoading]);

    return (
      <div className={rootClassNames} id="controls" ref={controlsRef}>
        <Container>
          <div>
            <section className={s.work_shadow}>
              {/* タイトル */}
              <Typography component="h2" variant="h2">
                {content.controls_title}
              </Typography>

              {/* 説明文 */}
              <Typography component="p" variant="p" sx={{ maxWidth: 650 }}>
                {content.controls_description}
              </Typography>
            </section>

            {/* デバイス幅がSM以上の場合に表示 */}
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
                    onClick={handleClick}
                  />
                ))}
              </List>
            </div>

            {/* デバイス幅がSM未満の場合に表示 */}
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
                    onClick={handleClick}
                  />
                ))}
              </List>

              {/* カルーセル */}
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
  },
);

Controls.displayName = 'Controls';

export default Controls;
