'use client';

import React, { useEffect,useRef } from 'react';

import { Typography } from '@mui/material';

import { portalAnimation } from '@/animations/works';

/**
 * Portal コンポーネントの Props。
 * 作品一覧ページ上部に表示するタイトルテキスト。
 */
type Props = {
  /** ポータルに表示するタイトル文字列 */
  title: string;
};

const Portal = React.memo(({ title }: Props) => {
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
