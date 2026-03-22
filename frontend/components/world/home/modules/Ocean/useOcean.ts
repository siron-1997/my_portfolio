import { useMemo, useRef } from 'react';
import { useThree, useLoader, useFrame } from '@react-three/fiber';
import {
  Texture,
  TextureLoader,
  PlaneGeometry,
  RepeatWrapping,
  Vector3,
  WebGLRenderer,
} from 'three';
// @ts-expect-error -- three/examples/jsm モジュールに型定義が存在しないため
import { Water } from 'three/examples/jsm/objects/Water';
import { OpenWeatherCurrentData } from '@/types/api';
import { COLOR_PALETTE } from '@/constants/colors';

type Props = {
  currentWeatherData: OpenWeatherCurrentData | null;
};

type WaterConfig = {
  textureWidth: number;
  textureHeight: number;
  waterNormals: Texture;
  sunDirection: Vector3;
  sunColor: string;
  waterColor: string;
  distortionScale: number;
  fog: boolean;
  format: WebGLRenderer;
};

/**
 * HomeWorld の海のロジックを管理するカスタムフック
 * @param currentWeatherData - 現在の天気情報
 */
const useOcean = ({ currentWeatherData }: Props) => {
  const waterRef = useRef<Water>(null!);
  const gl = useThree((state) => state.gl);
  const isVisible = useMemo(() => {
    return currentWeatherData?.rain !== undefined;
  }, [currentWeatherData]);

  // 水面の法線マップを読み込む
  const waterNormals = useLoader(TextureLoader, 'images/textures/waternormals.jpg');

  useMemo(() => {
    waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
  }, [waterNormals]);

  const geom = useMemo(() => new PlaneGeometry(15, 15), []);
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

  useFrame((_, delta) => {
    if (waterRef.current) {
      waterRef.current.material.uniforms['time'].value += delta * 0.2;
    }
  });

  return { waterRef, geom, config, isVisible };
};

export default useOcean;
