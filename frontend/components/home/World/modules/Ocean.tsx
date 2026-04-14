'use client';

import React, { type JSX,useEffect, useMemo, useRef } from 'react';

import { useTexture } from '@react-three/drei';
import { extend, type ThreeElement, useFrame,useThree } from '@react-three/fiber';
import type { useCreateStore } from 'leva';
import { buttonGroup,useControls } from 'leva';
import {
  MathUtils,
  PlaneGeometry,
  RepeatWrapping,
  type Texture,
  Vector3,
  type WebGLRenderer,
} from 'three';
/** @ts-expect-error -- three/examples/jsm モジュールに型定義が存在しないため */
import { Water } from 'three/examples/jsm/objects/Water';

import { COLOR_PALETTE } from '@/constants/colors';
import {
  HOME_WORLD_DEBUG_OCEAN_CONTROLS,
  HOME_WORLD_OCEAN_GEOMETRY_SIZE,
  HOME_WORLD_OCEAN_TEXTURE_SIZE,
  HOME_WORLD_WATER_NORMALS_TEXTURE,
} from '@/constants/home';
import { type OpenWeatherCurrentData } from '@/types/api';

extend({ Water });

/** TypeScript に water コンポーネントを認識させるための宣言 */
declare module '@react-three/fiber' {
  interface ThreeElements {
    water: ThreeElement<typeof Water>;
  }
}

type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** Leva ストア */
  levaStore: ReturnType<typeof useCreateStore>;
};

/**
 * Water オブジェクトの設定型。
 * three/examples/jsm の Water コンストラクタに渡すオプション。
 */
type WaterConfig = {
  /** テクスチャの幅（px） */
  textureWidth: number;

  /** テクスチャの高さ（px） */
  textureHeight: number;

  /** 水面の法線マップテクスチャ */
  waterNormals: Texture;

  /** 太陽光方向ベクトル */
  sunDirection: Vector3;

  /** 太陽光の色 */
  sunColor: string;

  /** 水面の色 */
  waterColor: string;

  /** ディストーションスケール */
  distortionScale: number;

  /** 霧の影響を受けるか */
  fog: boolean;

  /** WebGL レンダラー */
  format: WebGLRenderer;
};

import { IS_DEV } from '@/constants/common';

const Ocean = React.memo(
  ({ currentWeatherData, levaStore }: Props): JSX.Element => {
    /** 水面オブジェクトへの参照 Ref */
    const ref = useRef<Water | null>(null);

    /** 水面の法線マップを読み込む */
    const waterNormals = useTexture(HOME_WORLD_WATER_NORMALS_TEXTURE);

    /** WebGL レンダラー */
    const gl = useThree((state) => state.gl);

    /** 水面のジオメトリ */
    const geom = useMemo(
      () =>
        new PlaneGeometry(
          HOME_WORLD_OCEAN_GEOMETRY_SIZE,
          HOME_WORLD_OCEAN_GEOMETRY_SIZE,
        ),
      [],
    );

    /** デフォルト値（天候依存） */
    const defaults = {
      visible: currentWeatherData?.rain !== undefined,
      color: COLOR_PALETTE.oceanWater,
      distortionScale: HOME_WORLD_DEBUG_OCEAN_CONTROLS.distortionScale.value,
      speed: HOME_WORLD_DEBUG_OCEAN_CONTROLS.speed.value,
    };

    /** 水面コントロール（開発環境デバッグ用） */
    const { debugVisible, debugColor, debugDistortionScale, debugSpeed } =
      useControls(
        '水面',
        {
          debugVisible: {
            ...HOME_WORLD_DEBUG_OCEAN_CONTROLS.visible,
            value: defaults.visible,
          },
          debugColor: {
            ...HOME_WORLD_DEBUG_OCEAN_CONTROLS.color,
            value: defaults.color,
          },
          debugDistortionScale: {
            ...HOME_WORLD_DEBUG_OCEAN_CONTROLS.distortionScale,
            value: defaults.distortionScale,
          },
          debugSpeed: {
            ...HOME_WORLD_DEBUG_OCEAN_CONTROLS.speed,
            value: defaults.speed,
          },
          _oceanReset: buttonGroup({
            リセット: () =>
              levaStore.set(
                {
                  '水面.debugVisible': defaults.visible,
                  '水面.debugColor': defaults.color,
                  '水面.debugDistortionScale': defaults.distortionScale,
                  '水面.debugSpeed': defaults.speed,
                },
                false,
              ),
          }),
        },
        { collapsed: true },
        { store: levaStore },
      );

    /** 表示状態 */
    const visible = IS_DEV ? debugVisible : defaults.visible;
    /** 水面色 */
    const color = IS_DEV ? debugColor : defaults.color;
    /** 波の粗さ */
    const distortionScale = IS_DEV
      ? debugDistortionScale
      : defaults.distortionScale;
    /** 波の速度 */
    const speed = IS_DEV ? debugSpeed : defaults.speed;

    /** Water オブジェクトの設定 */
    const config: WaterConfig = useMemo(
      () => ({
        textureWidth: HOME_WORLD_OCEAN_TEXTURE_SIZE,
        textureHeight: HOME_WORLD_OCEAN_TEXTURE_SIZE,
        waterNormals,
        sunDirection: new Vector3(),
        sunColor: COLOR_PALETTE.oceanSun,
        waterColor: color,
        distortionScale,
        fog: true,
        format: gl,
      }),
      [waterNormals, gl, color, distortionScale],
    );

    /** フレームごとに水面アニメーションを進める */
    useFrame((_, delta) => {
      if (!ref.current) return;
      ref.current.material.uniforms['time'].value += delta * speed;
    });

    /** テクスチャーの繰り返し設定 */
    useEffect(() => {
      waterNormals.wrapS = RepeatWrapping;
      waterNormals.wrapT = RepeatWrapping;
    }, [waterNormals]);

    /** 天気データが変わったときに水面の表示状態をリセットする（開発環境のみ） */
    useEffect(() => {
      if (!IS_DEV) return;
      levaStore.set({ '水面.debugVisible': defaults.visible }, false);
    }, [currentWeatherData?.rain, levaStore]);

    return (
      <group name="water" visible={visible} position-y={-0.095}>
        <water
          ref={ref}
          args={[geom, config]}
          rotation-x={MathUtils.degToRad(-90)}
        />
      </group>
    );
  },
);

Ocean.displayName = 'Ocean';

useTexture.preload(HOME_WORLD_WATER_NORMALS_TEXTURE);

export default Ocean;
