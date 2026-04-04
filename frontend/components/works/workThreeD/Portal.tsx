'use client';

import { useEffect } from 'react';

import { useWorkThreeDContext } from '@/contexts';
import { portalAnimation } from '@/animations/workThreeD';
import { WorkDetail } from '@/types/api';

/**
 * Portal コンポーネントの Props。
 * 3D ビューワーページの作品タイトル・説明を表示するポータルセクション。
 */
type Props = {
  /** 表示する作品の詳細データ */
  content: WorkDetail;
};

const Portal = ({ content }: Props) => {
  const {
    refs: { portalRef },
    state: { isLoading },
  } = useWorkThreeDContext();

  useEffect(() => {
    if (!isLoading) {
      const ctx = portalAnimation({
        portal: portalRef.current,
        portalRef,
      });
      return () => {
        ctx.revert();
      };
    }
  }, [isLoading, portalRef]);

  return (
    <section ref={portalRef} id="model-viewer" style={{ height: '100%' }}>
      <h1>{content.title}</h1>
      <p>{content.description}</p>
    </section>
  );
};

export default Portal;
