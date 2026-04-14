'use client';

import React, { type JSX, useEffect } from 'react';

import { portalAnimation } from '@/animations/home';
import { HOME_PORTAL_TITLE } from '@/constants/home';
import s from '@/styles/home/Portal.module.css';

type Props = {
  /** Portal セクションの参照 Ref */
  portalRef: React.RefObject<HTMLDivElement | null>;

  /** Canvas の準備状態フラグ */
  isCanvasReady: boolean;
};

const Portal = React.memo(
  ({ portalRef, isCanvasReady }: Props): JSX.Element => {
    useEffect(() => {
      if (!portalRef.current) return;

      /** Canvas の準備が完了していない場合はスクロールをリセット */
      if (!isCanvasReady) {
        window.scrollTo(0, 0);
        return;
      }

      /** Portal アニメーションを初期化 */
      const ctx = portalAnimation({
        title: portalRef.current.querySelector('#portal-title')!,
        portalRef: portalRef,
      });

      return () => {
        ctx.revert();
      };
    }, [isCanvasReady]);

    return (
      <div className={s.portal} ref={portalRef}>
        <section>
          <h1 id="portal-title">{HOME_PORTAL_TITLE}</h1>
        </section>
      </div>
    );
  },
);

Portal.displayName = 'Portal';

export default Portal;
