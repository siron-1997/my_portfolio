'use client';

import { Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';

import { portalAnimation } from '@/animations/about';

type Props = {
  /** ポータルのタイトル */
  title: string;
};

const Portal = React.memo(({ title }: Props) => {
  /** ポータルタイトルの参照 Ref */
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    /** ポータルタイトルのアニメーションコンテキスト */
    const ctx = portalAnimation({ title: ref.current, titleRef: ref });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <Typography
      component="h1"
      variant="h1"
      ref={ref}
      sx={{ textAlign: 'center', width: '100%' }}
    >
      {title}
    </Typography>
  );
});

Portal.displayName = 'Portal';

export default Portal;
