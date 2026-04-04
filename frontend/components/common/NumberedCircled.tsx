'use client';

import { useRef, useEffect } from 'react';
import { Typography, type SxProps, type Theme } from '@mui/material';

import { modelAnimation } from '@/animations/workWorld';

/**
 * NumberedCircled コンポーネントの Props。
 * 3D ビューワーの作品ナビゲーションに使用する丸付き番号ボタン。
 */
type Props = {
  /** 表示するインデックス番号（0 始まり、表示は +1） */
  index: number;

  /** MUI のインラインスタイル（位置・色などを外部から指定） */
  sx: SxProps<Theme>;

  /** ナビゲーションクリック時のコールバック */
  onClick: () => void;

  /** ナビゲーションを表示するかどうか */
  isNavigationVisible: boolean;
};

const NumberedCircled = ({ index, sx, onClick, isNavigationVisible }: Props) => {
  const navigationRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const navigation = navigationRef.current;
    const cleanup = modelAnimation(navigation, isNavigationVisible);
    return () => {
      cleanup();
    };
  }, [isNavigationVisible]);

  return (
    <Typography
      component="span"
      ref={navigationRef}
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
};

export default NumberedCircled;
