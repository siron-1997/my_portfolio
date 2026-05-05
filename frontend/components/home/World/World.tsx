'use client';

import React, {
  type Dispatch,
  type JSX,
  type RefObject,
  type SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';

import { Canvas } from '@react-three/fiber';
import axios from 'axios';
import { LevaPanel, useCreateStore } from 'leva';
import { PCFShadowMap, ReinhardToneMapping } from 'three';

import { Loading } from '@/components/common';
import Experience from '@/components/home/World/Experience';
import { Rain } from '@/components/home/World/modules';
import { TIME_POINT_ENV_COLORS } from '@/constants/colors';
import { DEFAULT_COORDINATES, IS_DEV } from '@/constants/common';
import {
  HOME_WORLD_CAMERA_FAR,
  HOME_WORLD_CAMERA_FOV,
  HOME_WORLD_CAMERA_NEAR,
  HOME_WORLD_CANVAS_DPR,
  HOME_WORLD_WEATHER_FETCH_INTERVAL_MS,
} from '@/constants/home';
import { useGeolocation } from '@/hooks';
import s from '@/styles/home.module.css';
import { type OpenWeatherCurrentData } from '@/types/api';
import { type TimePoint } from '@/types/api';
import { disableScroll } from '@/utils';

type Props = {
  /** portal セクション要素の参照 Ref */
  portalRef: RefObject<HTMLDivElement | null>;

  /** Canvas の準備状態フラグ */
  isCanvasReady: boolean;

  /** Canvas の準備状態を更新する関数 */
  setIsCanvasReady: Dispatch<SetStateAction<boolean>>;
};

/** r3f-perf は内部で useLayoutEffect + createRoot を使用するため SSR を無効化 */
const Perf = dynamic(() => import('r3f-perf').then((mod) => mod.Perf), {
  ssr: false,
});

const World = React.memo(
  ({ portalRef, isCanvasReady, setIsCanvasReady }: Props): JSX.Element => {
    /** 現在の天気データ */
    const [currentWeatherData, setCurrentWeatherData] =
      useState<OpenWeatherCurrentData | null>(null);

    /** デバッグ上書き後の天気データの状態 */
    const [effectiveWeatherData, setEffectiveWeatherData] =
      useState<OpenWeatherCurrentData | null>(null);

    /** カメラが扉を通過した際に雨を非表示にするフラグ */
    const [isInsideRoom, setIsInsideRoom] = useState<boolean>(false);

    /** 時間帯（デフォルトは夜） */
    const [timePoint, setTimePoint] = useState<TimePoint>('night');

    /** 天気情報取得の実施フラグ */
    const [hasWeatherFetched, setHasWeatherFetched] = useState<boolean>(false);

    /** 位置情報取得フック */
    const { coordinates, isPermissionHandled } =
      useGeolocation(DEFAULT_COORDINATES);

    /** Leva のストアを作成 */
    const levaStore = useCreateStore();

    /** デバッグ上書き後の天気データの状態を更新するコールバック */
    const handleEffectiveWeatherDataChange = useCallback(
      (data: OpenWeatherCurrentData | null) => setEffectiveWeatherData(data),
      [],
    );

    /** カメラが扉を通過した際の屋内状態変化コールバック */
    const handleInsideRoomChange = useCallback(
      (isInside: boolean) => setIsInsideRoom(isInside),
      [],
    );

    /** 現在の天気情報を取得する処理 */
    const fetchCurrentWeatherData = useCallback(async (): Promise<void> => {
      try {
        const res = await axios.post('/api/getCurrentWeather', {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
        /** 取得に成功したとき */
        if (res.data.success) {
          setCurrentWeatherData(res.data.data.data);
          setTimePoint(res.data.data.timePoint);
        } else {
          /** 取得に失敗したとき */
          if (IS_DEV) console.error('API response error:', res.data.message);
        }
      } catch (error) {
        /** 取得中にエラーが発生した場合の処理 */
        if (IS_DEV) console.error('current weather data error', error);
      } finally {
        setHasWeatherFetched(true);
      }
    }, [coordinates.latitude, coordinates.longitude]);

    useEffect(() => {
      /** 位置情報の共有操作が完了していない場合は取得を中断 */
      if (!isPermissionHandled) return;
      fetchCurrentWeatherData();

      /** 天気情報の再取得間隔 */
      const intervalId = setInterval(
        fetchCurrentWeatherData,
        HOME_WORLD_WEATHER_FETCH_INTERVAL_MS,
      );

      return () => clearInterval(intervalId);
    }, [isPermissionHandled, fetchCurrentWeatherData]);

    /**  天気取得・Canvas 初期化いずれかが未完了の間スクロールを禁止する */
    useLayoutEffect(() => {
      return disableScroll(!hasWeatherFetched || !isCanvasReady);
    }, [hasWeatherFetched, isCanvasReady]);

    /** 天気情報取得前はローディングを表示 */
    if (!hasWeatherFetched) return <Loading isLoading scrollLock={false} />;

    return (
      <>
        {/* Canvas の準備が完了していない場合もローディングを表示 */}
        {!isCanvasReady && <Loading isLoading scrollLock={false} />}

        {/** 開発環境のみ Leva デバッグパネルを表示。ヘッダー高さ分を下にオフセット */}
        {IS_DEV &&
          createPortal(
            <LevaPanel
              store={levaStore}
              titleBar={{ position: { x: 0, y: 70 } }}
              theme={{ sizes: { rootWidth: '380px' } }}
            />,
            document.body,
          )}

        <div className={s.home_world}>
          <Canvas
            shadows={{ type: PCFShadowMap }}
            dpr={HOME_WORLD_CANVAS_DPR}
            gl={{
              antialias: true,
              toneMapping: ReinhardToneMapping,
              logarithmicDepthBuffer: true,
            }}
            camera={{
              fov: HOME_WORLD_CAMERA_FOV,
              near: HOME_WORLD_CAMERA_NEAR,
              far: HOME_WORLD_CAMERA_FAR,
            }}
            className={s.canvas}
            style={{
              /** 時間帯に応じて背景色を設定 */
              background: TIME_POINT_ENV_COLORS[timePoint].background,
            }}
            onCreated={() => setIsCanvasReady(true)}
          >
            {/** 開発環境のみパフォーマンスモニターを表示。ヘッダー高さ分を下にオフセット */}
            {IS_DEV && (
              <Perf
                position="top-left"
                style={{ top: '70px', position: 'fixed', zIndex: 9999 }}
              />
            )}

            <Suspense fallback={null}>
              <Experience
                portalRef={portalRef}
                currentWeatherData={currentWeatherData}
                timePoint={timePoint}
                setTimePoint={setTimePoint}
                levaStore={levaStore}
                onEffectiveWeatherDataChange={handleEffectiveWeatherDataChange}
                onInsideRoomChange={handleInsideRoomChange}
              />
            </Suspense>
          </Canvas>

          {/* 雨 - メイン Canvas 初期化後にマウントし、Leva パネル内の制御グループが最下部に表示されることを保証する */}
          {isCanvasReady && (
            <Rain
              currentWeatherData={effectiveWeatherData ?? currentWeatherData}
              levaStore={levaStore}
              isInsideRoom={isInsideRoom}
            />
          )}
        </div>
      </>
    );
  },
);

World.displayName = 'World';

export default World;
