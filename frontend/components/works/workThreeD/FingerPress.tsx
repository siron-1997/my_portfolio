'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';

import { KeyboardArrowDown } from '@mui/icons-material';
import { Typography } from '@mui/material';
import type { Dispatch,JSX } from 'react';

import { fingerPressAnimation } from '@/animations/workThreeD';
import { BREAK_POINTS } from '@/constants/common';
import {
  WORK_THREE_D_FINGER_PRESS_ICON_ALT,
  WORK_THREE_D_FINGER_PRESS_ICON_PATH,
  WORK_THREE_D_FINGER_PRESS_TEXT,
} from '@/constants/workThreeD';
import { useWindowSize } from '@/hooks';
import s from '@/styles/workThreeD.module.css';
import { type WorkThreeDAction } from '@/types/contexts';

type Props = {
  /** 指アイコン表示フラグ */
  isFingerVisible: boolean;

  /** ビュワーアクティブフラグ */
  isViewerActive: boolean;

  /** work 個別ページの状態 (3D) を更新する関数 */
  dispatch: Dispatch<WorkThreeDAction>;
};

const FingerPress = React.memo(
  ({ isFingerVisible, isViewerActive, dispatch }: Props): JSX.Element => {
    /** 指アイコンの参照 Ref */
    const fingerPressRef = useRef<HTMLDivElement | null>(null);

    /** 指アイコン画像の参照 Ref */
    const imageRef = useRef<HTMLImageElement | null>(null);

    /** 説明文の参照 Ref */
    const textRef = useRef<HTMLParagraphElement | null>(null);

    /** ウィンドウ幅を取得 */
    const { width } = useWindowSize();

    /** 指アイコンを押したときのハンドラ */
    const handleFingerPress = useCallback(() => {
      dispatch({ type: 'SET_FINGER_VISIBLE', payload: false });
    }, [dispatch]);

    useEffect(() => {
      if (!fingerPressRef.current || !imageRef.current || !textRef.current)
        return;

      /** モバイルかどうか */
      const isBreakPointMB = width! < BREAK_POINTS.XS;

      /** 現在の幅 */
      const currentWidth = isBreakPointMB ? 130 : 250;

      /** 指アイコンのアニメーションを初期化 */
      const ctx = fingerPressAnimation({
        image: imageRef.current,
        text: textRef.current,
        ref: fingerPressRef,
        currentWidth,
        isFingerVisible,
      });

      return () => {
        ctx.revert();
      };
    }, [width, isFingerVisible, isViewerActive]);

    return (
      <div className={s.finger_press} id="finger-press" ref={fingerPressRef}>
        {isViewerActive ? (
          <Image
            ref={imageRef}
            src={WORK_THREE_D_FINGER_PRESS_ICON_PATH}
            alt={WORK_THREE_D_FINGER_PRESS_ICON_ALT}
            width={95}
            height={95}
            quality={1}
            onMouseDown={handleFingerPress}
            onTouchStart={handleFingerPress}
            style={{ display: !isFingerVisible ? 'none' : 'block' }}
            className={s.icon}
          />
        ) : (
          <Typography component="p" sx={{ fontWeight: 600 }} ref={textRef}>
            {WORK_THREE_D_FINGER_PRESS_TEXT}
            <br />
            <KeyboardArrowDown sx={{ width: 45, height: 45 }} />
          </Typography>
        )}
      </div>
    );
  },
);

FingerPress.displayName = 'FingerPress';

export default FingerPress;
