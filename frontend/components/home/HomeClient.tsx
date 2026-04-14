'use client';

import React, { type JSX,useRef, useState } from 'react';

import { PageHeader } from '@/components/common';
import Portal from '@/components/home/Portal';
import Works from '@/components/home/Works';
import { World } from '@/components/home/World';
import s from '@/styles/home/index.module.css';
import { type WorkSummary } from '@/types/api';

type Props = {
  /** 作品のサマリーリスト */
  worksData: WorkSummary[];
};

const HomeClient = React.memo(({ worksData }: Props): JSX.Element => {
  /** portal 要素の参照 Ref */
  const ref = useRef<HTMLDivElement | null>(null);

  /** Canvas の準備状態フラグ */
  const [isCanvasReady, setIsCanvasReady] = useState<boolean>(false);

  return (
    <>
      <div className={s.world_container}>
        {/* Home の 3D ワールド */}
        <World
          portalRef={ref}
          isCanvasReady={isCanvasReady}
          setIsCanvasReady={setIsCanvasReady}
        />
      </div>

      <PageHeader id="3d-page-header" figcaptionClassName={s.figcaption}>
        <Portal portalRef={ref} isCanvasReady={isCanvasReady} />
      </PageHeader>

      {/* 作品リスト */}
      <Works data={worksData} />
    </>
  );
});

HomeClient.displayName = 'HomeClient';

export default HomeClient;
