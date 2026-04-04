import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { MathUtils, Mesh, MeshStandardMaterial, BackSide, Group } from 'three';
import { OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import { COLOR_PALETTE } from '@/constants/colors';
import { DEFAULT_WEATHER, WEATHER_TYPES } from '@/constants/world';
import { getEnvMapIntensity } from '@/utils/world/home';

/**
 * Door コンポーネントの Props
 */
type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;

  /** ドアグループへの Ref */
  ref: React.RefObject<Group | null>;
};

const Door = React.memo(({ currentWeatherData, timePoint, ref }: Props) => {
  /** ドアモデルのノードを取得 */
  const { nodes } = useGLTF('/models/gltf/door.glb');
  /** 環境マップを取得 */
  const environment = useThree((state) => state.scene.environment);

  /** グループのスケール */
  const groupScale = 0.02;
  /** メッシュのスケール */
  const meshScale = 0.1;
  /** メッシュの回転角度 */
  const meshAngle = 90;

  /** 天気情報リスト（API 成功時は取得値、未取得・失敗時はデフォルト値） */
  const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;

  /** 現在の天気を取得 */
  const currentWeather = useMemo(
    () => weather.find((w) => WEATHER_TYPES.includes(w.main)),
    [weather],
  );

  /** 環境光の輝度を取得 */
  const envMapIntensity = useMemo(
    () => getEnvMapIntensity(currentWeather!, timePoint, 'model'),
    [currentWeather, timePoint],
  );

  return (
    <group
      ref={ref}
      name="Door"
      scale={[groupScale, groupScale, groupScale]}
      rotation-y={MathUtils.degToRad(-90)}
      position={[-3.6, 0.002, 4.2]}
    >
      {/* 部屋 */}
      <mesh
        name={nodes?.room?.name}
        geometry={(nodes.room as Mesh).geometry}
        rotation-x={MathUtils.degToRad(meshAngle)}
        scale={meshScale}
      >
        <meshBasicMaterial
          map={((nodes.room as Mesh).material as MeshStandardMaterial).map}
          side={BackSide}
          transparent={true}
          opacity={0}
        />
      </mesh>

      {/* 扉 */}
      <group name="door-container" position={[1.2, 0, 5.9]}>
        {/* ドアノブ */}
        <mesh
          name={nodes.handle.name}
          geometry={(nodes.handle as Mesh).geometry}
          position={[-1.2, 0, -5.9]}
          rotation-x={MathUtils.degToRad(meshAngle)}
          scale={meshScale}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={((nodes.handle as Mesh).material as MeshStandardMaterial).color}
            envMap={environment}
            envMapIntensity={envMapIntensity}
          />
        </mesh>

        {/* パネル */}
        <mesh
          name={nodes.door.name}
          geometry={(nodes.door as Mesh).geometry}
          position={[-1.2, 0, -5.9]}
          rotation-x={MathUtils.degToRad(meshAngle)}
          scale={meshScale}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={((nodes.door as Mesh).material as MeshStandardMaterial).color}
            envMap={environment}
            envMapIntensity={envMapIntensity}
          />
        </mesh>
      </group>

      {/* 扉フレーム */}
      <mesh
        name={nodes?.frame?.name}
        geometry={(nodes.frame as Mesh).geometry}
        rotation-x={MathUtils.degToRad(meshAngle)}
        scale={meshScale}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={((nodes.frame as Mesh).material as MeshStandardMaterial).color}
          envMap={environment}
          envMapIntensity={envMapIntensity}
        />
      </mesh>

      <pointLight
        name="door-light"
        power={50}
        color={COLOR_PALETTE.doorLight}
        distance={0.8}
        decay={1}
        position={[10, 31, 0]}
      />
    </group>
  );
});

Door.displayName = 'Door';

export default Door;
