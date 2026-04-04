'use client';

import { useEffect, useRef } from 'react';

import { useHomeContext } from '@/contexts/homeContext';
import { portalAnimation } from '@/animations/home';
import s from '@/styles/home/Portal.module.css';

const Portal = () => {
  /** Portal セクションの参照 Ref */
  const ref = useRef<HTMLDivElement>(null);

  const { portalRef, isLoading } = useHomeContext();

  useEffect(() => {
    if (!ref.current) return;

    if (isLoading) {
      window.scrollTo(0, 0);
      return;
    }

    /** Portal アニメーションを初期化 */
    const ctx = portalAnimation({
      title: ref.current.querySelector('#portal-title')!,
      portalRef: ref,
    });

    return () => {
      ctx.revert();
    };
  }, [isLoading]);

  return (
    <div className={s.portal} ref={ref}>
      <section>
        <h1 id="portal-title">Symphony</h1>
      </section>
    </div>
  );
};

export default Portal;
