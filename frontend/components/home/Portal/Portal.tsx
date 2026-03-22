'use client';

import usePortal from './usePortal';
import s from '@/styles/home/Portal.module.css';

const Portal = () => {
  const { portalRef } = usePortal();

  return (
    <div className={s.portal} ref={portalRef}>
      <section>
        <h1 id="portal-title">Symphony</h1>
      </section>
    </div>
  );
};

export default Portal;
