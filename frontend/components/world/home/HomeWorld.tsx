'use client';

import { Canvas } from '@react-three/fiber';
import axios from 'axios';
import dynamic from 'next/dynamic';
import React, { Suspense, useEffect, useState } from 'react';
import { LevaPanel, useCreateStore } from 'leva';
import { PCFShadowMap, ReinhardToneMapping } from 'three';

import { DEFAULT_COORDINATES } from '@/constants/common';
import { TIME_POINT_ENV_COLORS } from '@/constants/colors';
import { useHomeContext } from '@/contexts/homeContext';
import { ModelViewerLoading } from '@/components/home';
import { Experience } from '@/components/world/home/Experience';
import { Rain } from '@/components/world/home/modules';
import { useGeolocation } from '@/hooks';
import { OpenWeatherCurrentData, GetCurrentWeatherAPIResponse } from '@/types/api';
import { TimePoint } from '@/types/world';
import s from '@/styles/home/HomeWorld.module.css';

/** r3f-perf は内部で useLayoutEffect + createRoot を使用するため SSR を無効化 */
const Perf = dynamic(() => import('r3f-perf').then((mod) => mod.Perf), { ssr: false });

const HomeWorld = React.memo(() => {
  /** 現在の天気データ */
  const [currentWeatherData, setCurrentWeatherData] =
    useState<OpenWeatherCurrentData | null>(null);

  /** 時間帯（デフォルトは夜（※timePointよりtimeSlotの方が正確？）） */
  const [timePoint, setTimePoint] = useState<TimePoint>('night');

  /** ビューワー準備完了状態 */
  const [isViewerReady, setIsViewerReady] = useState<boolean>(false);

  /** HomeContext からローディング制御関数を取得 */
  const { setIsLoading } = useHomeContext();

  /** 位置情報取得フック */
  const { coordinates, isPermissionHandled } = useGeolocation(DEFAULT_COORDINATES);

  /** Leva のストアを作成 */
  // const levaStore = useCreateStore();

  /** 天気情報取得副作用 */
  useEffect(() => {
    const getCurrentWeather = async () => {
      try {
        /** 現在の天気情報を API から取得 */
        const res = await axios.post(
          '/api/getCurrentWeather',
          {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
          {
            headers: {
              'Cache-Control': 'max-age=3600',
            },
          },
        );

        /** API レスポンスが成功した場合、状態を更新 */
        if (res.data.success) {
          const data: GetCurrentWeatherAPIResponse = res.data;
          setCurrentWeatherData(data.data.data);
          setTimePoint(data.data.timePoint);
        } else {
          /** API レスポンスが失敗した場合の処理 */
          if (process.env.NODE_ENV === 'development') {
            console.error('API response error:', res.data.message);
          }
        }
      } catch (error) {
        /** 天気情報取得中にエラーが発生した場合の処理 */
        if (process.env.NODE_ENV === 'development') {
          console.error('current weather data error', error);
        }
      } finally {
        setIsViewerReady(true);
      }
    };

    /** 位置情報の共有操作が完了した後に天気情報を取得 */
    if (isPermissionHandled) {
      getCurrentWeather();
    }
  }, [isPermissionHandled, coordinates.latitude, coordinates.longitude]);

  /** ビューワー準備完了前はローディング表示 */
  if (!isViewerReady) return <ModelViewerLoading />;

  return (
    <div className={s.home_world}>
      {/** 開発環境のみ leva デバッグパネルを表示。ヘッダー高さ（最大 70px）分を下にオフセット */}
      {/* {process.env.NODE_ENV === 'development' && (
        <LevaPanel store={levaStore} titleBar={{ position: { x: 0, y: 70 } }} />
      )} */}

      <Canvas
        shadows={{ type: PCFShadowMap }}
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: ReinhardToneMapping }}
        camera={{ fov: 45, near: 0.01, far: 200 }}
        className={s.canvas}
        style={{
          /** 時間帯に応じて背景色を設定 */
          background: TIME_POINT_ENV_COLORS[timePoint].background,
        }}
        onCreated={() => setIsLoading(() => false)}
      >
        {/** 開発環境のみパフォーマンスモニターを表示。ヘッダー高さ（最大 70px）分を下にオフセット */}
        {/* TODO: r3f-perf@7.2.3 が WebGL GPU タイマークエリと Environment のマルチレンダーパスが競合して
            "INVALID_OPERATION: getQueryParameter: query is currently active" を発生させるため一時無効化 */}
        {/* {process.env.NODE_ENV === 'development' && (
          <Perf
            position="top-left"
            style={{ top: '70px', position: 'fixed', zIndex: 9999 }}
          />
        )} */}

        {/** useGLTF 等のサスペンドを Canvas 内部で受け止め、Canvas 自体がアンマウントされないようにする */}
        <Suspense fallback={null}>
          <Experience
            currentWeatherData={currentWeatherData}
            timePoint={timePoint}
            setTimePoint={setTimePoint}
            // levaStore={levaStore}
          />
        </Suspense>
      </Canvas>

      {/* 雨 */}
      <Rain currentWeatherData={currentWeatherData} />
    </div>
  );
});

HomeWorld.displayName = 'HomeWorld';

export default HomeWorld;
