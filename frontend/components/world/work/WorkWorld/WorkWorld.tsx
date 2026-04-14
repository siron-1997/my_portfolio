'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { ACESFilmicToneMapping, PCFShadowMap } from 'three';

import { Experience } from '@/components/world/work/Experience';
import s from '@/styles/works/workThreeD/WorkWorld.module.css';
import { type WorkDetail } from '@/types/api';

import useWorkWorld from './useWorkWorld';

/** r3f-perf は内部で useLayoutEffect + createRoot を使用するため SSR を無効化 */
const Perf = dynamic(() => import('r3f-perf').then((mod) => mod.Perf), {
  ssr: false,
});

/** Props の型定義 */
type Props = {
  /** content */
  content: WorkDetail;
};

const WorkWorld = ({ content }: Props) => {
  const { handleCreated, handlePointerDown } = useWorkWorld();

  return (
    <>
      {/** ページ遷移時の自動スクロールリセットをスキップさせないため空 div を配置 */}
      <div></div>
      {/** 開発環境のみ leva デバッグパネルを表示。ヘッダー高さ（最大 70px）分を下にオフセット */}
      {process.env.NODE_ENV === 'development' && (
        <Leva titleBar={{ position: { x: 0, y: 70 } }} />
      )}
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
          {/** 開発環境のみパフォーマンスモニターを表示。ヘッダー高さ（最大 70px）分を下にオフセット */}
          {process.env.NODE_ENV === 'development' && (
            <Perf position="top-left" style={{ top: '70px' }} />
          )}
          <Experience content={content} />
        </Canvas>
      </div>
    </>
  );
};

export default React.memo(WorkWorld);
