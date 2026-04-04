import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React, { useMemo, useEffect } from 'react';
import { FrontSide, Mesh, RepeatWrapping, MathUtils, Vector3 } from 'three';

import { BREAK_POINTS } from '@/constants/common';
import { DEFAULT_WEATHER, WEATHER_TYPES } from '@/constants/world';
import { OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import { useIsIos, useWindowSize } from '@/hooks';
import { getEnvMapIntensity, getWeatherCategory } from '@/utils/world/home';

/**
 * Clouds コンポーネントの Props
 */
type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;

  /** 薄雲テクスチャを適用するメッシュへの Ref */
  thinCloudRef: React.RefObject<Mesh | null>;

  /** 厚雲テクスチャを適用するメッシュへの Ref */
  thickCloudRef: React.RefObject<Mesh | null>;
};

/** 厚雲の最大不透明度を約 91% に抑えるための除数（iOS 以外で使用） */
const THICK_CLOUD_OPACITY_DIVISOR = 110;

const Clouds = React.memo(
  ({ currentWeatherData, timePoint, thinCloudRef, thickCloudRef }: Props) => {
    /** iOS 判定 */
    const isIos = useIsIos();
    /** ウィンドウ幅を取得 */
    const { width } = useWindowSize();

    /** 環境マップを取得 */
    const environment = useThree((state) => state.scene.environment);
    /** 薄雲テクスチャーを読み込み */
    const thinTexture = useTexture('/images/textures/thin_cloud.png');
    /** 厚雲テクスチャーを読み込み */
    const thickTexture = useTexture('/images/textures/thick_cloud.png');

    /** 雲量を取得（デフォルトは0） */
    const cloudsAll = currentWeatherData?.clouds?.all || 0;
    /** 天気情報リスト（API 成功時は取得値、未取得・失敗時はデフォルト値） */
    const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;

    /** 現在の天気を取得 */
    const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

    /** 天気カテゴリ（描画ループ内での再計算を避けるため useMemo で保護） */
    const weatherCategory = useMemo(
      () => getWeatherCategory(currentWeather?.description),
      [currentWeather],
    );

    /** 薄雲・厚雲の表示フラグ */
    const visbles = {
      thinCloud: weatherCategory === 'thinCloud',
      thickCloud: weatherCategory === 'thickCloud',
    };

    /** 環境光の輝度を取得 */
    const envMapIntensity = useMemo(
      () => getEnvMapIntensity(currentWeather!, timePoint, 'cloud'),
      [currentWeather, timePoint],
    );

    /** テクスチャーの wrapS と wrapT を RepeatWrapping に設定（副作用のため useEffect を使用） */
    useEffect(() => {
      thinTexture.wrapS = thinTexture.wrapT = RepeatWrapping;
      thinTexture.repeat.set(1, 1);
      thickTexture.wrapS = thickTexture.wrapT = RepeatWrapping;
      thickTexture.repeat.set(7, 7);
    }, [thinTexture, thickTexture]);

    /** デバイス幅に応じてスケール・位置・角度を計算した雲設定 */
    const clouds = useMemo(
      () => ({
        /** 薄雲 */
        thin: {
          texture: thinTexture,
          /** デバイスに応じてスケールを切り替え */
          scale: width > BREAK_POINTS.XS ? 1 : 0.9,
          /** デバイスに応じて位置を切り替え */
          position:
            width > BREAK_POINTS.XS ? new Vector3(0, -0.5, -41) : new Vector3(-5, 18, 10),
          /** デバイスに応じて角度を切り替え */
          rotation:
            width > BREAK_POINTS.XS
              ? ([MathUtils.degToRad(75), 0, 0] as [number, number, number])
              : ([MathUtils.degToRad(55), 0, MathUtils.degToRad(180)] as [
                  number,
                  number,
                  number,
                ]),
        },
        /** 厚雲 */
        thick: {
          texture: thickTexture,
          /** デバイスに応じてスケールを切り替え */
          scale: width > BREAK_POINTS.XS ? 1.3 : 2,
          position: new Vector3(0, 5.3, -10),
          rotation: [MathUtils.degToRad(75), 0, MathUtils.degToRad(-90)] as [
            number,
            number,
            number,
          ],
        },
      }),
      [thinTexture, thickTexture, width],
    );

    return (
      <group name="clouds" renderOrder={2}>
        {/* 薄雲 */}
        <mesh
          ref={thinCloudRef}
          scale={clouds.thin.scale}
          position={clouds.thin.position}
          rotation={clouds.thin.rotation}
          visible={visbles.thinCloud}
          name="thin cloud"
        >
          <planeGeometry args={[85, 85]} />
          <meshStandardMaterial
            map={clouds.thin.texture}
            side={FrontSide}
            transparent={true}
            opacity={cloudsAll / 100}
            envMap={environment}
            envMapIntensity={
              width > BREAK_POINTS.XS ? envMapIntensity : envMapIntensity + 20
            }
            depthTest={true}
            depthWrite={true}
          />
        </mesh>

        {/* 厚雲 */}
        <mesh
          ref={thickCloudRef}
          scale={clouds.thick.scale}
          position={clouds.thick.position}
          rotation={clouds.thick.rotation}
          visible={visbles.thickCloud}
          name="thick cloud"
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            map={clouds.thick.texture}
            side={FrontSide}
            transparent={true}
            opacity={isIos ? 1.0 : cloudsAll / THICK_CLOUD_OPACITY_DIVISOR}
            envMap={environment}
            envMapIntensity={envMapIntensity}
            depthTest={true}
            depthWrite={true}
          />
        </mesh>
      </group>
    );
  },
);

Clouds.displayName = 'Clouds';

export default Clouds;
