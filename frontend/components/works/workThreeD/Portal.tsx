'use client';

import React, { useEffect } from 'react';

import type { JSX, RefObject } from 'react';

import { portalAnimation } from '@/animations/workThreeD';
import { type WorkDetail } from '@/types/api';

type Props = {
  /** 表示する作品の詳細データ */
  content: WorkDetail;

  /** Portal セクションの参照 Ref */
  portalRef: RefObject<HTMLElement | null>;

  /** 3Dモデルのロード中フラグ */
  isLoading: boolean;
};

const Portal = React.memo(
  ({ content, portalRef, isLoading }: Props): JSX.Element => {
    useEffect(() => {
      if (isLoading || !portalRef.current) return;

      /** ポータルアニメーションの初期化 */
      const ctx = portalAnimation({
        portal: portalRef.current,
        ref: portalRef,
      });

      return () => {
        ctx.revert();
      };
    }, [isLoading, portalRef]);

    return (
      <section ref={portalRef} id="model-viewer" style={{ height: '100%' }}>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </section>
    );
  },
);

Portal.displayName = 'Portal';

export default Portal;
