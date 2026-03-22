'use client';

import { WorkDetail } from '@/types/api';
import { usePortal } from './usePortal';

type Props = {
  content: WorkDetail;
};

const Portal = ({ content }: Props) => {
  const { portalRef } = usePortal();

  return (
    <section ref={portalRef} id="model-viewer" style={{ height: '100%' }}>
      <h1>{content.title}</h1>
      <p>{content.description}</p>
    </section>
  );
};

export default Portal;
