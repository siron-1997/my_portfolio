'use client';

import React, { type JSX, useCallback, useEffect, useMemo } from 'react';

import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { type Color, Mesh, MeshStandardMaterial } from 'three';

import { DRACO_DECODER_PATH } from '@/constants/common';
import {
  DEFAULT_WEATHER,
  ENV_MAP_MODEL_TYPE_MODEL,
  HOME_WORLD_MOUNTAIN_MATERIALS,
  HOME_WORLD_MOUNTAIN_MODEL_PATH,
  HOME_WORLD_SCENE_NAME_MOUNTAIN,
  WEATHER_TYPES,
} from '@/constants/home';
import { type OpenWeatherCurrentData } from '@/types/api';
import { type TimePoint } from '@/types/api';
import { getEnvMapIntensity } from '@/utils/world';

type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;

  /** モデルの表示・非表示（デバッグ比較用、省略時は表示） */
  visible?: boolean;
};

const Model = React.memo(
  ({ currentWeatherData, timePoint, visible = true }: Props): JSX.Element => {
    const { scene } = useThree();

    /** オブジェクトを読み込み、名前を設定 */
    const model = useGLTF(HOME_WORLD_MOUNTAIN_MODEL_PATH, true);
    model.scene.name = 'mountain';

    /** シーン子要素をメモ化して依存配列の安定性を確保 */
    const children = useMemo(() => [...model.scene.children], [model.scene]);

    /** 天気情報リスト（API 成功時は取得値、未取得・失敗時はデフォルト値） */
    const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;

    /** 現在の天気を取得 */
    const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

    /** 環境光の強度を取得 */
    const envMapIntensity = useMemo(
      () =>
        getEnvMapIntensity(
          currentWeather!,
          timePoint,
          ENV_MAP_MODEL_TYPE_MODEL,
        ),
      [currentWeather, timePoint],
    );

    /** マテリアルに環境マップと強度を適用して初期化 */
    const initializedMaterials = useMemo(() => {
      Object.values(HOME_WORLD_MOUNTAIN_MATERIALS).forEach((material) => {
        material.envMap = scene.environment;
        material.envMapIntensity = envMapIntensity;
      });
      return HOME_WORLD_MOUNTAIN_MATERIALS;
    }, [scene.environment, envMapIntensity]);

    /** 地面用の新しいマテリアルを生成する関数 */
    const createMaterial = useCallback(
      (color: Color, name: string) => {
        return new MeshStandardMaterial({
          color: color,
          envMap: scene.environment,
          envMapIntensity: envMapIntensity,
          roughness: 0.4,
          name: name,
        });
      },
      [scene.environment, envMapIntensity],
    );

    /** 山モデルの各子要素にマテリアルとシャドウを適用 */
    useEffect(() => {
      children.forEach((child) => {
        /** メッシュかつスタンダードマテリアルの場合（木・葉を想定） */
        if (
          child instanceof Mesh &&
          child.material instanceof MeshStandardMaterial
        ) {
          /** マテリアル名で判別して適切な roughness を割り当て */
          switch (child.material.name) {
            /** Tree_1 */
            case initializedMaterials.treeMat_1.name:
              child.material.roughness =
                initializedMaterials.treeMat_1.roughness;
              child.material.name = initializedMaterials.treeMat_1.name;
              break;
            /** Tree_2 */
            case initializedMaterials.treeMat_2.name:
              child.material.roughness =
                initializedMaterials.treeMat_2.roughness;
              child.material.name = initializedMaterials.treeMat_2.name;
              break;
            /** Leaves_1 */
            case initializedMaterials.leavesMat_1.name:
              child.material.roughness =
                initializedMaterials.leavesMat_1.roughness;
              child.material.name = initializedMaterials.leavesMat_1.name;
              break;
            /** Leaves_2 */
            case initializedMaterials.leavesMat_2.name:
              child.material.roughness =
                initializedMaterials.leavesMat_2.roughness;
              child.material.name = initializedMaterials.leavesMat_2.name;
              break;
            /** Leaves_3 */
            case initializedMaterials.leavesMat_3.name:
              child.material.roughness =
                initializedMaterials.leavesMat_3.roughness;
              child.material.name = initializedMaterials.leavesMat_3.name;
              break;
            /** Leaves_4 */
            case initializedMaterials.leavesMat_4.name:
              child.material.roughness =
                initializedMaterials.leavesMat_4.roughness;
              child.material.name = initializedMaterials.leavesMat_4.name;
              break;
            /** Leaves_5 */
            case initializedMaterials.leavesMat_5.name:
              child.material.roughness =
                initializedMaterials.leavesMat_5.roughness;
              child.material.name = initializedMaterials.leavesMat_5.name;
              break;
            /** Leaves_6 */
            case initializedMaterials.leavesMat_6.name:
              child.material.roughness =
                initializedMaterials.leavesMat_6.roughness;
              child.material.name = initializedMaterials.leavesMat_6.name;
              break;
            default:
              break;
          }

          /** すべての子メッシュに共通の設定を適用 */
          child.material.envMap = scene.environment;
          child.material.envMapIntensity = envMapIntensity;
          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;

          /** メッシュ以外はグループオブジェクトを想定（ground） */
        } else {
          child.children.forEach((c) => {
            /** メッシュオブジェクトの場合、マテリアルを初期化しシャドウを設定 */
            if (c instanceof Mesh) {
              c.material = createMaterial(c.material.color, c.material.name);
              c.castShadow = true;
              c.receiveShadow = true;
            }
          });
        }
      });
    }, [
      children,
      createMaterial,
      envMapIntensity,
      initializedMaterials,
      scene.environment,
    ]);

    return (
      <group
        renderOrder={0}
        name={HOME_WORLD_SCENE_NAME_MOUNTAIN}
        visible={visible}
      >
        <primitive object={model.scene} />
      </group>
    );
  },
);

Model.displayName = 'Model';

useGLTF.setDecoderPath(DRACO_DECODER_PATH);
useGLTF.preload(HOME_WORLD_MOUNTAIN_MODEL_PATH, true);

export default Model;
