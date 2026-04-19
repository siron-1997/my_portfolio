'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useRef } from 'react';
import type { JSX, Dispatch } from 'react';

import { KeyboardArrowDown } from '@mui/icons-material';
import { Typography } from '@mui/material';

import { fingerPressAnimation } from '@/animations/workThreeD';
import { BREAK_POINTS } from '@/constants/common';
import { useWindowSize } from '@/hooks';
import { type WorkThreeDAction } from '@/types/contexts';
import s from '@/styles/works/workThreeD/workThreeDmodule.css';

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
            src="/icons/finger_press_48x48.svg"
            alt="finger press"
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
            「Start」をタップすると3Dビュワーモードが開始します。
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
