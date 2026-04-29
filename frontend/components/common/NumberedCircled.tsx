'use client';

import React, { type JSX, useEffect, useRef } from 'react';

import { type SxProps, type Theme, Typography } from '@mui/material';

import { navigationVisibleAnimation } from '@/animations/workWorld';

type Props = {
  /** 表示するインデックス番号 */
  index: number;

  /** MUI のインラインスタイル（位置・色などを外部から指定） */
  sx: SxProps<Theme>;

  /** ナビゲーションクリック時のコールバック */
  onClick: () => void;

  /** ナビゲーションの表示フラグ */
  isNavigationVisible: boolean;
};

const NumberedCircled = React.memo(
  ({ index, sx, onClick, isNavigationVisible }: Props): JSX.Element => {
    /** ナビゲーションの参照 Ref */
    const ref = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
      if (!ref.current) return;

      /** ナビゲーションの表示アニメーションを初期化 */
      const ctx = navigationVisibleAnimation({
        ref,
        isVisible: isNavigationVisible,
      });

      return () => {
        ctx.revert();
      };
    }, [isNavigationVisible]);

    return (
      <Typography
        component="span"
        ref={ref}
        sx={{
          ...sx,
          display: isNavigationVisible ? 'block' : 'none',
          lineHeight: 1.2,
          letterSpacing: 1,
          borderRadius: 8,
          cursor: 'pointer',
          backgroundColor: 'rgb(0, 0, 0, 0.3)',
        }}
        onClick={onClick}
      >
        {index + 1}
      </Typography>
    );
  },
);

NumberedCircled.displayName = 'NumberedCircled';

export default NumberedCircled;
