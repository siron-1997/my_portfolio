import React from 'react';
import { Fog as ThreeFog } from 'three';

import { TIME_POINT_ENV_COLORS } from '@/constants/colors';
import { BREAK_POINTS } from '@/constants/common';
import { OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import { useWindowSize } from '@/hooks';

/** Props の型定義 */
type Props = {
  /** Open Wather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;

  /** 霧の参照 Ref */
  ref: React.RefObject<ThreeFog | null>;
};

const Fog = React.memo(({ currentWeatherData, timePoint, ref }: Props) => {
  /** ウィンドウ幅を取得 */
  const { width } = useWindowSize();

  /** 湿度を取得 */
  const humidity = currentWeatherData?.main?.humidity || 0;

  return (
    <fog
      ref={ref}
      attach="fog"
      args={[
        /** 時間帯に応じた霧の色 */
        TIME_POINT_ENV_COLORS[timePoint].fog,
        /** 湿度に応じて霧の最少距離を制御 */
        width! > BREAK_POINTS.XS ? 4 : 5,
        /** 湿度に応じて霧の最大距離を制御 */
        width! > BREAK_POINTS.XS ? 140 - humidity : 160 - humidity,
      ]}
      color={TIME_POINT_ENV_COLORS[timePoint].fog}
      /** 湿度に応じて霧の最少距離を制御 */
      near={width! > BREAK_POINTS.XS ? 4 : 5}
      /** 湿度に応じて霧の最大距離を制御 */
      far={width! > BREAK_POINTS.XS ? 140 - humidity : 160 - humidity}
    />
  );
});

Fog.displayName = 'Fog';

export default Fog;
