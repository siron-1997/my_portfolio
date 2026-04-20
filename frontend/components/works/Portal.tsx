'use client';

import React, { type JSX, useEffect, useRef } from 'react';

import { Typography } from '@mui/material';

import { portalAnimation } from '@/animations/works';

type Props = {
  /** ポータルに表示するタイトル文字列 */
  title: string;
};

const Portal = React.memo(({ title }: Props): JSX.Element => {
  /** ポータルタイトル参照 Ref */
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    /** ポータルアニメーションの初期化 */
    const ctx = portalAnimation({ title: ref.current, titleRef: ref });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <Typography ref={ref} variant="h1" style={{ textAlign: 'center' }}>
      {title}
    </Typography>
  );
});

Portal.displayName = 'Portal';

export default Portal;
