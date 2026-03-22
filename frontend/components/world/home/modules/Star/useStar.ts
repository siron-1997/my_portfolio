import { useMemo, useEffect } from 'react';
import { BufferGeometry, BufferAttribute, PointsMaterial, Points } from 'three';
import { OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import { useIsIos } from '@/hooks';

type Props = {
  currentWeatherData: OpenWeatherCurrentData | null;
  timePoint: TimePoint;
};

/**
 * HomeWorld の星のロジックを管理するカスタムフック
 * @param currentWeatherData - 現在の天気APIデータ
 * @param timePoint - 時間帯
 */
const useStar = ({ currentWeatherData, timePoint }: Props) => {
  const isIos = useIsIos();
  const starCount = 9500;
  // 雲量を取得。データがない場合は 0
  const opacity = currentWeatherData?.clouds?.all || 0;

  // 星のポイントオブジェクトを生成
  const star = useMemo(() => {
    // 星の位置をランダムに設定
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = Math.random() * 400 - 200;
      positions[i + 1] = Math.random() * 500 - 250;
      positions[i + 2] = Math.random() * 50 - 100;
    }

    // Geometry を作成
    const starGeom = new BufferGeometry();
    starGeom.setAttribute('position', new BufferAttribute(positions, 3));

    // Material を作成
    const starMaterial = new PointsMaterial({
      color: '#fff',
      size: timePoint === 'lunch' ? 0 : 0.35, // 昼は非表示
      transparent: true,
      // iOS とその他で透明度の計算方法を分ける
      opacity: isIos
        ? 100 - opacity
        : timePoint === 'night'
          ? 1 - opacity / 500
          : timePoint === 'evening'
            ? 0.4
            : 0,
      fog: false, // 霧の影響を受けない
    });

    // Points を作成
    const star = new Points(starGeom, starMaterial);
    star.name = 'star';

    return star;
  }, [starCount, timePoint, isIos, opacity]);

  // コンポーネントのアンマウント時にジオメトリとマテリアルを破棄
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

  // コンポーネントには星オブジェクトのみを返す
  return { star };
};

export default useStar;
