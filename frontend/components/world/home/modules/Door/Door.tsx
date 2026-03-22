import React from 'react';
import { MathUtils, Mesh, MeshStandardMaterial, BackSide, Group } from 'three';
import { WeatherItem } from '@/types/api';
import { TimePoint } from '@/types/world';
import { COLOR_PALETTE } from '@/constants/colors';
import useDoor from './useDoor';

type Props = {
  weather: WeatherItem[];
  timePoint: TimePoint;
  doorRef: React.RefObject<Group>;
};

const Door: React.FC<Props> = ({ weather, timePoint, doorRef }) => {
  const {
    pointLightRef,
    nodes,
    environment,
    envMapIntensity,
    groupScale,
    meshScale,
    meshAngle,
  } = useDoor({ weather, timePoint });

  return (
    <group
      ref={doorRef}
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
        ref={pointLightRef}
        name="door-light"
        power={50}
        color={COLOR_PALETTE.doorLight}
        distance={0.8}
        decay={1}
        position={[10, 31, 0]}
      />
    </group>
  );
};

export default React.memo(Door);
