import React, { useMemo } from 'react';
import { MathUtils } from 'three';

import { OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import { useIsIos } from '@/hooks';

type MaterialParams = {
  /** 星のサイズ */
  size: number;

  /** 星の透明度 */
  opacity: number;
};

type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;
};

/** 星の数 */
const START_COUNT = 9500;

const Star = React.memo(({ currentWeatherData, timePoint }: Props) => {
  /** iOS 判定 */
  const isIos = useIsIos();

  /** 雲量を取得。データがない場合は 0 */
  const opacity = currentWeatherData?.clouds?.all || 0;

  /** 星の位置を格納する配列 */
  const positions = useMemo<Float32Array>(() => {
    const arr = new Float32Array(START_COUNT * 3);

    /** 星の位置をランダムに設定 */
    for (let i = 0; i < START_COUNT * 3; i += 3) {
      /** X座標 (-200 から 200 の範囲) */
      arr[i] = MathUtils.randFloatSpread(400);
      /** Y座標 (-250 から 250 の範囲) */
      arr[i + 1] = MathUtils.randFloatSpread(500);
      /** Z座標 (-100 から -50 の範囲) */
      arr[i + 2] = Math.random() * 50 - 100;
    }

    return arr;
  }, []);

  /** 星のマテリアルパラメータを計算 */
  const materialParams = useMemo<MaterialParams>(() => {
    /** 星のサイズを設定 */
    const size = timePoint === 'lunch' ? 0 : 0.35;

    /**
     * IOS の場合
     * TODO: 100 - opacity は 1 を超える可能性があるため、調査が必要
     */
    if (isIos) {
      return { size, opacity: Math.max(0, 100 - opacity) };
    }

    /** 夜の場合は雲量に応じて徐々に星を見えにくくする */
    if (timePoint === 'night') {
      return { size, opacity: Math.max(0, 1 - opacity / 500) };
    }

    /** 夕方は固定で半分の明るさ */
    if (timePoint === 'evening') {
      return { size, opacity: 0.4 };
    }

    /** 昼は完全に見えない */
    return { size, opacity: 0 };
  }, [timePoint, isIos, opacity]);

  return (
    <group renderOrder={1} name="star-container">
      <points name="star">
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            /** positions 配列を頂点属性として設定。3 は各頂点が x, y, z の 3 要素で構成されていることを示す。 */
            args={[positions, 3]}
          />
        </bufferGeometry>

        <pointsMaterial
          color="#fff"
          size={materialParams.size}
          transparent
          opacity={materialParams.opacity}
          fog={false}
          depthWrite={false}
        />
      </points>
    </group>
  );
});

Star.displayName = 'Star';

export default Star;
