'use client';

import React, { type JSX, useEffect, useMemo } from 'react';

import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import {
  BackSide,
  type Group,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  PointLightHelper,
} from 'three';

import { DRACO_DECODER_PATH, IS_DEV } from '@/constants/common';
import {
  DEFAULT_WEATHER,
  ENV_MAP_MODEL_TYPE_MODEL,
  HOME_WORLD_DEBUG_DOOR_LIGHT_HELPER_SIZE,
  HOME_WORLD_DOOR_MODEL_PATH,
  HOME_WORLD_DOOR_PANEL_HINGE_OFFSET_X,
  HOME_WORLD_SCENE_NAME_DOOR,
  HOME_WORLD_SCENE_NAME_DOOR_CONTAINER,
  HOME_WORLD_SCENE_NAME_ROOM,
  WEATHER_TYPES,
} from '@/constants/home';
import { type OpenWeatherCurrentData, type TimePoint } from '@/types/api';
import { getEnvMapIntensity } from '@/utils/world';

type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;

  /** ドアグループへの Ref */
  ref: React.RefObject<Group | null>;
};

const Door = React.memo(
  ({ currentWeatherData, timePoint, ref }: Props): JSX.Element => {
    /** ドアモデルのノードを取得 */
    const { nodes } = useGLTF(HOME_WORLD_DOOR_MODEL_PATH, true);

    /** 環境マップを取得 */
    const environment = useThree((state) => state.scene.environment);

    /** Three.js シーン（GLB PoingLight ヘルパー追加用） */
    const threeScene = useThree((state) => state.scene);

    /** 天気情報リスト（API 成功時は取得値、未取得・失敗時はデフォルト値） */
    const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;

    /** 現在の天気を取得 */
    const currentWeather = useMemo(
      () => weather.find((w) => WEATHER_TYPES.includes(w.main)),
      [weather],
    );

    /** 環境光の輝度を取得 */
    const envMapIntensity = useMemo(
      () =>
        getEnvMapIntensity(
          currentWeather!,
          timePoint,
          ENV_MAP_MODEL_TYPE_MODEL,
        ),
      [currentWeather, timePoint],
    );

    /** GLB 内の PointLight にヘルパーを追加する（開発環境のみ） */
    useEffect(() => {
      if (!IS_DEV) return;

      const helpers: PointLightHelper[] = [];

      nodes.Lit_DoorLight?.traverse((obj) => {
        if (obj instanceof PointLight) {
          const helper = new PointLightHelper(
            obj,
            HOME_WORLD_DEBUG_DOOR_LIGHT_HELPER_SIZE,
          );
          threeScene.add(helper);
          helpers.push(helper);
        }
      });

      return () => {
        helpers.forEach((h) => {
          threeScene.remove(h);
          h.dispose();
        });
      };
    }, [nodes.Lit_DoorLight, threeScene]);

    /** 扉パネルのマテリアルを設定し、影を有効にする */
    useEffect(() => {
      if (!nodes.SM_DoorPanel) return;

      nodes.SM_DoorPanel.traverse((child) => {
        if (
          child instanceof Mesh &&
          child.material instanceof MeshStandardMaterial
        ) {
          child.material.envMap = environment;
          child.material.envMapIntensity = envMapIntensity;
          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }, [nodes.SM_DoorPanel, environment, envMapIntensity]);

    return (
      <group ref={ref} name={HOME_WORLD_SCENE_NAME_DOOR}>
        {/** 部屋 */}
        <mesh
          name={HOME_WORLD_SCENE_NAME_ROOM}
          geometry={(nodes.SM_Room as Mesh).geometry}
        >
          {/* 立体間を無くすため、BasicMaterial に変換 */}
          <meshBasicMaterial
            map={((nodes.SM_Room as Mesh).material as MeshStandardMaterial).map}
            side={BackSide}
            transparent
            opacity={0}
          />
        </mesh>

        {/**
         * 扉パネル（2プリミティブのため THREE.js が Group に変換 → primitive で描画）
         *
         * Geo_Door.glb の SM_DoorPanel はジオメトリ原点が扉中央（X: -0.3965〜+0.3965）のため
         * そのまま回転すると中心軸になってしまう。
         * ピボットトリックで door-container を X=+0.3965（正側ヒンジ端）に移動し、
         * 子グループで -0.3965 オフセットして見た目の位置を維持する。
         */}
        <group
          name={HOME_WORLD_SCENE_NAME_DOOR_CONTAINER}
          position={[-HOME_WORLD_DOOR_PANEL_HINGE_OFFSET_X, 0, 0]}
        >
          <group position={[HOME_WORLD_DOOR_PANEL_HINGE_OFFSET_X, 0, 0]}>
            <primitive object={nodes.SM_DoorPanel} />
          </group>
        </group>

        {/** 扉フレーム */}
        <mesh
          name={(nodes.SM_DoorFrame as Mesh).name}
          geometry={(nodes.SM_DoorFrame as Mesh).geometry}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={
              ((nodes.SM_DoorFrame as Mesh).material as MeshStandardMaterial)
                .color
            }
            envMap={environment}
            envMapIntensity={envMapIntensity}
          />
        </mesh>

        {/** GLB 内のポイントライト（KHR_lights_punctual → Three.js PointLight） */}
        <primitive object={nodes.Lit_DoorLight} />
      </group>
    );
  },
);

Door.displayName = 'Door';

useGLTF.setDecoderPath(DRACO_DECODER_PATH);
useGLTF.preload(HOME_WORLD_DOOR_MODEL_PATH, true);

export default Door;
