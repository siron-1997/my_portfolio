'use client';

import React, { type JSX } from 'react';

import { Environment } from '@react-three/drei';
import { BackSide } from 'three';

import { TIME_POINT_ENV_COLORS } from '@/constants/colors';
import { HOME_WORLD_SCENE_NAME_ENV_CUBE } from '@/constants/home';
import { type TimePoint } from '@/types/api';

type Props = {
  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;
};

const WeatherEnvironment = React.memo(({ timePoint }: Props): JSX.Element => {
  return (
    <Environment background>
      <mesh name={HOME_WORLD_SCENE_NAME_ENV_CUBE}>
        <boxGeometry args={[200, 200, 200]} />

        <meshBasicMaterial
          /** 時間帯に応じた環境プリセットカラーを設定 */
          color={TIME_POINT_ENV_COLORS[timePoint].environment}
          side={BackSide}
          transparent
          opacity={0.2}
        />
      </mesh>
    </Environment>
  );
});

WeatherEnvironment.displayName = 'WeatherEnvironment';

export default WeatherEnvironment;
