'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import { Typography } from '@mui/material';
import cn from 'classnames';
import type { Dispatch, JSX, RefObject } from 'react';

import { toggleButtonAnimation } from '@/animations/workThreeD';
import {
  WORK_THREE_D_TOGGLE_END_LABEL,
  WORK_THREE_D_TOGGLE_START_LABEL,
} from '@/constants/workThreeD';
import s from '@/styles/common/button/Toggle.module.css';
import { type WorkThreeDAction } from '@/types/contexts';

type Props = {
  /** ビュワーアクティブフラグ */
  isViewerActive: boolean;

  /** トグルボタンの参照 Ref */
  toggleButtonRef: RefObject<HTMLDivElement | null>;

  /** work 個別ページの状態 (3D) を更新する関数 */
  dispatch: Dispatch<WorkThreeDAction>;
};

export const ToggleButton = React.memo(
  ({ isViewerActive, toggleButtonRef, dispatch }: Props): JSX.Element => {
    /** トグルボタン背景の参照 Ref */
    const bgButtonRef = useRef<HTMLDivElement | null>(null);

    const startClassNames = cn(s.toggle_button, s.left);
    const endClassNames = cn(s.toggle_button, s.right);

    /** テキストスタイル */
    const textStyle = {
      display: 'block',
      position: 'relative',
      fontSize: 20,
      lineHeight: 2,
      width: 130,
      height: 45,
      transition: 'all 0.25s',
    };

    /** 開始ボタンクリック時のハンドラ */
    const handleStartClick = useCallback((): void => {
      dispatch({ type: 'TOGGLE_VIEWER', payload: true });
    }, [dispatch]);

    /** 終了ボタンクリック時のハンドラ */
    const handleEndClick = useCallback((): void => {
      dispatch({ type: 'TOGGLE_VIEWER', payload: false });
    }, [dispatch]);

    useEffect(() => {
      if (!toggleButtonRef.current || !bgButtonRef.current) return;

      /** トグルボタンのアニメーションを初期化 */
      const ctx = toggleButtonAnimation({
        bgButton: bgButtonRef.current,
        ref: toggleButtonRef,
        isViewerActive,
      });

      return () => {
        ctx.revert();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- toggleButtonRef は Props から渡される安定参照のため除外
    }, [isViewerActive]);

    return (
      <div
        ref={toggleButtonRef}
        className={s.toggle}
        id="toggle-button"
        style={{ marginTop: isViewerActive ? 'auto' : '0' }}
      >
        {/* 背景 */}
        <div className={s.bg} ref={bgButtonRef} />

        {/* 開始ボタン */}
        <div className={startClassNames}>
          <Typography
            id="start"
            component="span"
            sx={textStyle}
            onClick={handleStartClick}
          >
            {WORK_THREE_D_TOGGLE_START_LABEL}
          </Typography>
        </div>

        {/* 終了ボタン */}
        <div className={endClassNames}>
          <Typography
            id="end"
            component="span"
            sx={textStyle}
            onClick={handleEndClick}
          >
            {WORK_THREE_D_TOGGLE_END_LABEL}
          </Typography>
        </div>
      </div>
    );
  },
);

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;
