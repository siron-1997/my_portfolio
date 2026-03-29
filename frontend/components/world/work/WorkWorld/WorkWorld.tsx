'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFShadowMap } from 'three';
import { Experience } from '@/components/world/work/Experience';
import { WorkDetail } from '@/types/api';
import s from '@/styles/works/workThreeD/WorkWorld.module.css';
import useWorkWorld from './useWorkWorld';

type Props = {
  content: WorkDetail;
};

const WorkWorld = ({ content }: Props) => {
  const { handleCreated, handlePointerDown } = useWorkWorld();

  return (
    <>
      {/* ページ遷移時の自動スクロールリセットをスキップさせないため空 div を配置 */}
      <div></div>
      <div className={s.portal}>
        <Canvas
          shadows={{ type: PCFShadowMap }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 2,
            outputColorSpace: 'srgb',
          }}
          className={s.canvas}
          onCreated={handleCreated}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        >
          <Experience content={content} />
        </Canvas>
      </div>
    </>
  );
};

export default React.memo(WorkWorld);
