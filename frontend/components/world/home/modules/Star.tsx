import React, { useMemo, useEffect } from 'react';
import { BufferGeometry, BufferAttribute, PointsMaterial, Points } from 'three';
import { OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import { useIsIos } from '@/hooks';

/**
 * Star コンポーネントの Props
 */
type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;
};

const Star = React.memo(({ currentWeatherData, timePoint }: Props) => {
  const isIos = useIsIos();

  const starCount = 9500;

  /** 雲量を取得。データがない場合は 0 */
  const opacity = currentWeatherData?.clouds?.all || 0;

  /** 星の Points オブジェクトを生成 */
  const star = useMemo(() => {
    /** 星の位置をランダムに設定 */
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = Math.random() * 400 - 200;
      positions[i + 1] = Math.random() * 500 - 250;
      positions[i + 2] = Math.random() * 50 - 100;
    }

    /** Geometry を作成 */
    const starGeom = new BufferGeometry();
    starGeom.setAttribute('position', new BufferAttribute(positions, 3));

    /** Material を作成 */
    const starMaterial = new PointsMaterial({
      color: '#fff',
      /** 昼は非表示 */
      size: timePoint === 'lunch' ? 0 : 0.35,
      transparent: true,
      /** iOS とその他で透明度の計算方法を分ける */
      opacity: isIos
        ? 100 - opacity
        : timePoint === 'night'
          ? 1 - opacity / 500
          : timePoint === 'evening'
            ? 0.4
            : 0,
      /** 霧の影響を受けない */
      fog: false,
    });

    /** Points を作成 */
    const starObj = new Points(starGeom, starMaterial);
    starObj.name = 'star';

    return starObj;
  }, [starCount, timePoint, isIos, opacity]);

  /** コンポーネントのアンマウント時にジオメトリとマテリアルを破棄 */
  useEffect(() => {
    return () => {
      if (star.geometry) {
        star.geometry.dispose();
      }
      if (Array.isArray(star.material)) {
        star.material.forEach((mat) => mat.dispose());
      } else {
        star.material.dispose();
      }
    };
  }, [star]);

  return (
    <group renderOrder={1} name="star-container">
      <primitive object={star} />
    </group>
  );
});

Star.displayName = 'Star';

export default Star;
