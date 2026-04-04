import { Environment } from '@react-three/drei';
import React from 'react';
import { BackSide } from 'three';

import { TIME_POINT_ENV_COLORS } from '@/constants/colors';
import { TimePoint } from '@/types/world';

/**
 * WeatherEnvironment コンポーネントの Props
 */
type Props = {
  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;
};

const WeatherEnvironment = React.memo(({ timePoint }: Props) => {
  return (
    <Environment background={true}>
      <mesh name="env cube">
        <boxGeometry args={[200, 200, 200]} />
        <meshBasicMaterial
          /** 時間帯に応じた環境プリセットカラーを設定 */
          color={TIME_POINT_ENV_COLORS[timePoint].environment}
          side={BackSide}
          transparent={true}
          opacity={0.2}
        />
      </mesh>
    </Environment>
  );
});

WeatherEnvironment.displayName = 'WeatherEnvironment';

export default WeatherEnvironment;
