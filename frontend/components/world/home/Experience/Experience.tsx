'use client';

import { BakeShadows } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useRef, useEffect } from 'react';
import {
  DirectionalLight,
  DirectionalLightHelper,
  Fog as ThreeFog,
  Group,
  Mesh,
  PointLight,
  PointLightHelper,
} from 'three';
import { useControls } from 'leva';
import type { useCreateStore } from 'leva';

import {
  Clouds,
  Door,
  Fog,
  Lightning,
  Model,
  Ocean,
  RigCamera,
  Star,
  SunLight,
  WeatherEnvironment,
} from '@/components/world/home/modules';
import { OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import {
  HOME_WORLD_DEBUG_TIME_POINT_CONTROL,
  HOME_WORLD_DEBUG_FOG_CONTROLS,
  HOME_WORLD_DEBUG_CLOUD_CONTROLS,
  HOME_WORLD_DEBUG_LIGHT_HELPER_CONTROLS,
  HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE,
} from '@/constants/world';

/** Props の型定義 */
type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;

  /** 時間帯（朝昼晩）を更新する関数 */
  setTimePoint: React.Dispatch<React.SetStateAction<TimePoint>>;

  /** Leva ストア */
  // levaStore: ReturnType<typeof useCreateStore>;
};

const Experience = React.memo(
  ({ currentWeatherData, timePoint, setTimePoint /** levaStore */ }: Props) => {
    /** ドアの参照 Ref */
    const doorRef = useRef<Group | null>(null);

    /** 太陽光の参照 Ref */
    const sunLightRef = useRef<DirectionalLight | null>(null);

    /** 雷の参照 Ref */
    const lightningRef = useRef<PointLight | null>(null);

    /** 霧の参照 Ref */
    const fogRef = useRef<ThreeFog | null>(null);

    /** 薄雲の参照 Ref */
    const thinCloudRef = useRef<Mesh | null>(null);

    /** 厚雲の参照 Ref */
    const thickCloudRef = useRef<Mesh | null>(null);

    const { scene } = useThree();

    // /** ヘルパーの更新（開発環境のみ） */
    // useFrame(() => {
    //   if (process.env.NODE_ENV !== 'development') return;

    //   /** 太陽光ヘルパーの更新 */
    //   const sunLightHelper = scene.getObjectByName(
    //     'sun_light_helper',
    //   ) as DirectionalLightHelper;
    //   sunLightHelper?.update();

    //   /** 雷ヘルパーの更新 */
    //   const lightningHelper = scene.getObjectByName(
    //     'lightning_helper',
    //   ) as PointLightHelper;
    //   lightningHelper?.update();
    // });

    // /** タイムポイントコントロール（開発環境デバッグ用 leva コントロール） */
    // const { debugTimePoint } = useControls(
    //   'タイムポイント',
    //   {
    //     debugTimePoint: HOME_WORLD_DEBUG_TIME_POINT_CONTROL,
    //   },
    //   { store: levaStore },
    // );

    // /** 霧コントロール（開発環境デバッグ用 leva コントロール） */
    // const { fogNear, fogFar } = useControls(
    //   '霧',
    //   {
    //     fogNear: HOME_WORLD_DEBUG_FOG_CONTROLS.near,
    //     fogFar: HOME_WORLD_DEBUG_FOG_CONTROLS.far,
    //   },
    //   { store: levaStore },
    // );

    // /** 雲の表示コントロール（開発環境デバッグ用 leva コントロール） */
    // const { thinCloudVisible, thickCloudVisible } = useControls(
    //   '雲',
    //   {
    //     thinCloudVisible: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thinCloudVisible,
    //     thickCloudVisible: HOME_WORLD_DEBUG_CLOUD_CONTROLS.thickCloudVisible,
    //   },
    //   { store: levaStore },
    // );

    // /** ライトヘルパーの表示コントロール（開発環境デバッグ用 leva コントロール） */
    // const { sunLightHelperVisible, lightningHelperVisible } = useControls(
    //   'ライトヘルパー',
    //   {
    //     sunLightHelperVisible:
    //       HOME_WORLD_DEBUG_LIGHT_HELPER_CONTROLS.sunLightHelperVisible,
    //     lightningHelperVisible:
    //       HOME_WORLD_DEBUG_LIGHT_HELPER_CONTROLS.lightningHelperVisible,
    //   },
    //   { store: levaStore },
    // );

    // /**
    //  * タイムポイントの leva コントロール値を context へ同期する。
    //  * 開発環境のみ実行し、本番ビルドでは早期リターンする。
    //  */
    // useEffect(() => {
    //   if (process.env.NODE_ENV !== 'development') return;
    //   setTimePoint(debugTimePoint as TimePoint);
    // }, [setTimePoint, debugTimePoint]);

    // /**
    //  * 霧の leva コントロール値を Three.js オブジェクトへ同期する。
    //  * 開発環境のみ実行し、本番ビルドでは早期リターンする。
    //  */
    // useEffect(() => {
    //   if (process.env.NODE_ENV !== 'development' || !fogRef.current) return;
    //   fogRef.current.near = fogNear;
    //   fogRef.current.far = fogFar;
    // }, [fogNear, fogFar]);

    // /**
    //  * 薄雲・厚雲の表示状態を Three.js オブジェクトへ同期する。
    //  * 開発環境のみ実行し、本番ビルドでは早期リターンする。
    //  */
    // useEffect(() => {
    //   if (process.env.NODE_ENV !== 'development') return;
    //   if (thinCloudRef.current) thinCloudRef.current.visible = thinCloudVisible;
    //   if (thickCloudRef.current) thickCloudRef.current.visible = thickCloudVisible;
    // }, [thinCloudVisible, thickCloudVisible, timePoint, currentWeatherData]);

    // /**
    //  * ライトヘルパーを生成してシーンに追加する。
    //  * アンマウント時にシーンからヘルパーを削除する。
    //  * 開発環境のみ実行し、本番ビルドでは早期リターンする。
    //  */
    // useEffect(() => {
    //   /** Three.js コンストラクタに null を渡すと matrixWorld アクセスでクラッシュするため早期リターン */
    //   if (
    //     process.env.NODE_ENV !== 'development' ||
    //     !sunLightRef.current ||
    //     !lightningRef.current
    //   )
    //     return;

    //   /** 太陽光ヘルパーの生成 */
    //   const sunHelper = new DirectionalLightHelper(
    //     sunLightRef.current,
    //     HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE,
    //   );
    //   sunHelper.name = 'sun_light_helper';
    //   sunHelper.visible = true;
    //   scene.add(sunHelper);

    //   /** 雷ヘルパーの生成 */
    //   const lgHelper = new PointLightHelper(
    //     lightningRef.current,
    //     HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE,
    //   );
    //   lgHelper.name = 'lightning_helper';
    //   lgHelper.visible = true;
    //   scene.add(lgHelper);

    //   return () => {
    //     scene.remove(sunHelper);
    //     scene.remove(lgHelper);
    //   };
    // }, [scene]);

    // /**
    //  * ライトヘルパーの表示状態を leva コントロール値に同期する。
    //  * 開発環境のみ実行し、本番ビルドでは早期リターンする。
    //  */
    // useEffect(() => {
    //   if (process.env.NODE_ENV !== 'development') return;

    //   /** 太陽光ヘルパーの表示状態を更新 */
    //   const sunHelper = scene.getObjectByName('sun_light_helper');
    //   if (sunHelper) sunHelper.visible = sunLightHelperVisible;

    //   /** 雷ヘルパーの表示状態を更新 */
    //   const lgHelper = scene.getObjectByName('lightning_helper');
    //   if (lgHelper) lgHelper.visible = lightningHelperVisible;
    // }, [scene, sunLightHelperVisible, lightningHelperVisible]);

    return (
      <>
        {/* 薄曇、散在雲、切雲、厚雲のとき追加。曇り度によって透明度を制御 */}
        <WeatherEnvironment timePoint={timePoint} />

        {/* 霧 */}
        <Fog currentWeatherData={currentWeatherData} timePoint={timePoint} ref={fogRef} />

        {/* 太陽 */}
        <SunLight
          currentWeatherData={currentWeatherData}
          timePoint={timePoint}
          ref={sunLightRef}
        />

        {/* メイン */}
        <group name="models">
          {/* 薄曇、散在雲、切雲、厚雲、晴れ、雨の状態によって環境光の輝度を制御 */}
          <Model currentWeatherData={currentWeatherData} timePoint={timePoint} />

          {/* ドア */}
          <Door
            currentWeatherData={currentWeatherData}
            timePoint={timePoint}
            ref={doorRef}
          />

          {/* 雨の時、シーンに追加 */}
          <Ocean currentWeatherData={currentWeatherData} />
        </group>

        {/* 星 */}
        <Star currentWeatherData={currentWeatherData} timePoint={timePoint} />

        {/* 薄曇、散在雲、切雲のときはBrokenCloudでそれ以外はCloud */}
        <Clouds
          currentWeatherData={currentWeatherData}
          timePoint={timePoint}
          thinCloudRef={thinCloudRef}
          thickCloudRef={thickCloudRef}
        />

        {/* 雷 */}
        <Lightning currentWeatherData={currentWeatherData} ref={lightningRef} />

        {/* カメラ */}
        <RigCamera ref={doorRef} />

        {/* シャドウベイク */}
        <BakeShadows />
      </>
    );
  },
);

Experience.displayName = 'Experience';

export default Experience;
