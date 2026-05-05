'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import type { JSX, Dispatch, RefObject } from 'react';

import { Typography } from '@mui/material';
import cn from 'classnames';

import { toggleButtonAnimation } from '@/animations/workThreeD';
import {
  WORK_THREE_D_TOGGLE_END_LABEL,
  WORK_THREE_D_TOGGLE_START_LABEL,
} from '@/constants/workThreeD';
import s from '@/styles/common/button/Toggle.module.css';
import { type WorkThreeDAction, type ViewerStatus } from '@/types/contexts';

type Props = {
  /** ビュワーモードの状態 */
  viewerStatus: ViewerStatus;

  /** トグルボタンの参照 Ref */
  toggleButtonRef: RefObject<HTMLDivElement | null>;

  /** work 個別ページの状態 (3D) を更新する関数 */
  dispatch: Dispatch<WorkThreeDAction>;
};

export const ToggleButton = React.memo(
  ({ viewerStatus, toggleButtonRef, dispatch }: Props): JSX.Element => {
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

    /** 終了ボタンクリック時のハンドラ（即時 exiting に遷移してボタンを Start 側に戻す） */
    const handleEndClick = useCallback((): void => {
      dispatch({ type: 'SET_VIEWER_STATUS', payload: 'exiting' });
    }, [dispatch]);

    useEffect(() => {
      if (!toggleButtonRef.current || !bgButtonRef.current) return;

      /** トグルボタンのアニメーションを初期化 */
      const ctx = toggleButtonAnimation({
        bgButton: bgButtonRef.current,
        ref: toggleButtonRef,
        viewerStatus,
      });

      return () => {
        ctx.revert();
      };
    }, [viewerStatus]);

    return (
      <div
        ref={toggleButtonRef}
        className={s.toggle}
        id="toggle-button"
        style={{ marginTop: viewerStatus !== 'passive' ? 'auto' : '0' }}
      >
        {/* 背景 */}
        <div className={s.bg} ref={bgButtonRef} />

        {/* 開始ボタン */}
        <div className={startClassNames}>
          <Typography
            id="start"
            component="span"
            sx={textStyle}
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
