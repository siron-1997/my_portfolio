import React, { useMemo, useRef } from 'react';
import { extend, ThreeElement, useThree, useLoader, useFrame } from '@react-three/fiber';
import {
  Texture,
  TextureLoader,
  PlaneGeometry,
  RepeatWrapping,
  Vector3,
  WebGLRenderer,
  MathUtils,
} from 'three';
/** @ts-expect-error -- three/examples/jsm モジュールに型定義が存在しないため */
import { Water } from 'three/examples/jsm/objects/Water';
import { OpenWeatherCurrentData } from '@/types/api';
import { COLOR_PALETTE } from '@/constants/colors';

extend({ Water });

/** TypeScript に water コンポーネントを認識させるための宣言 */
declare module '@react-three/fiber' {
  interface ThreeElements {
    water: ThreeElement<typeof Water>;
  }
}

/**
 * Ocean コンポーネントの Props
 */
type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;
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

const Ocean = React.memo(({ currentWeatherData }: Props) => {
  /** 水面オブジェクトへの参照 Ref */
  const ref = useRef<Water | null>(null);

  /** WebGL レンダラー */
  const gl = useThree((state) => state.gl);

  /** 雨データがある場合のみ水面を表示 */
  const isVisible = useMemo(() => {
    return currentWeatherData?.rain !== undefined;
  }, [currentWeatherData]);

  /** 水面の法線マップを読み込む */
  const waterNormals = useLoader(TextureLoader, 'images/textures/waternormals.jpg');

  /** テクスチャーの繰り返し設定 */
  useMemo(() => {
    waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
  }, [waterNormals]);

  /** 水面のジオメトリ */
  const geom = useMemo(() => new PlaneGeometry(15, 15), []);

  /** Water オブジェクトの設定 */
  const config: WaterConfig = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new Vector3(),
      sunColor: COLOR_PALETTE.oceanSun,
      waterColor: COLOR_PALETTE.oceanWater,
      distortionScale: 1.6,
      fog: true,
      format: gl,
    }),
    [waterNormals, gl],
  );

  /** フレームごとに水面アニメーションを進める */
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.uniforms['time'].value += delta * 0.2;
    }
  });

  return (
    <group name="water" visible={isVisible} position-y={-0.095}>
      <water ref={ref} args={[geom, config]} rotation-x={MathUtils.degToRad(-90)} />
    </group>
  );
});

Ocean.displayName = 'Ocean';

export default Ocean;
