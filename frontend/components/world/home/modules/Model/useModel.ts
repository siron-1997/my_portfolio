import { useMemo, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Mesh, Color, MeshStandardMaterial } from 'three';
import { WeatherItem } from '@/types/api';
import { TimePoint } from '@/types/world';
import { HOME_WORLD_MOUNTAIN_MATERIALS, WEATHER_TYPES } from '@/constants/world';
import { getEnvMapIntensity } from '@/utils/world/home';

type Props = {
  weather: WeatherItem[];
  timePoint: TimePoint;
};

/**
 * HomeWorld のモデル（山）のロジックを管理するカスタムフック
 * @param weather - 天気情報
 * @param timePoint - 時間帯
 */
const useModel = ({ weather, timePoint }: Props) => {
  const { scene } = useThree();

  // オブジェクトを読み込み、名前を設定
  const model = useGLTF('models/gltf/mountain.glb');
  model.scene.name = 'mountain';

  const children = useMemo(() => [...model.scene.children], [model.scene]);
  // console.log('Model children:', children);

  // 現在の天気を取得
  const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

  // 環境マップと環境光の強度を取得
  const envMapIntensity = useMemo(
    () => getEnvMapIntensity(currentWeather!, timePoint, 'model'),
    [currentWeather, timePoint],
  );

  // マテリアルを初期化
  const initializedMaterials = useMemo(() => {
    Object.values(HOME_WORLD_MOUNTAIN_MATERIALS).forEach((material) => {
      material.envMap = scene.environment;
      material.envMapIntensity = envMapIntensity;
    });
    return HOME_WORLD_MOUNTAIN_MATERIALS;
  }, [scene.environment, envMapIntensity]);

  // 新しいマテリアルを作成する関数
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

  useEffect(() => {
    children.forEach((child) => {
      // メッシュオブジェクト、かつスタンダードマテリアルの場合は、
      // マテリアルを設定 (木と葉を想定)
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        // マテリアル名で判別して適切なマテリアルを割り当て
        switch (child.material.name) {
          // Tree_2
          case initializedMaterials.treeMat_1.name:
            child.material.roughness = initializedMaterials.treeMat_1.roughness;
            child.material.name = initializedMaterials.treeMat_1.name;
            break;
          // Tree_2
          case initializedMaterials.treeMat_2.name:
            child.material.roughness = initializedMaterials.treeMat_2.roughness;
            child.material.name = initializedMaterials.treeMat_2.name;
            break;
          // Leaves_1
          case initializedMaterials.leavesMat_1.name:
            child.material.roughness = initializedMaterials.leavesMat_1.roughness;
            child.material.name = initializedMaterials.leavesMat_1.name;
            break;
          // Leaves_2
          case initializedMaterials.leavesMat_2.name:
            child.material.roughness = initializedMaterials.leavesMat_2.roughness;
            child.material.name = initializedMaterials.leavesMat_2.name;
            break;
          // Leaves_3
          case initializedMaterials.leavesMat_3.name:
            child.material.roughness = initializedMaterials.leavesMat_3.roughness;
            child.material.name = initializedMaterials.leavesMat_3.name;
            break;
          // Leaves_4
          case initializedMaterials.leavesMat_4.name:
            child.material.roughness = initializedMaterials.leavesMat_4.roughness;
            child.material.name = initializedMaterials.leavesMat_4.name;
            break;
          // Leaves_5
          case initializedMaterials.leavesMat_5.name:
            child.material.roughness = initializedMaterials.leavesMat_5.roughness;
            child.material.name = initializedMaterials.leavesMat_5.name;
            break;
          // Leaves_6
          case initializedMaterials.leavesMat_6.name:
            child.material.roughness = initializedMaterials.leavesMat_6.roughness;
            child.material.name = initializedMaterials.leavesMat_6.name;
            break;
          default:
            break;
        }
        // すべての子メッシュに共通の設定を適用
        child.material.envMap = scene.environment;
        child.material.envMapIntensity = envMapIntensity;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
        // メッシュ以外はグループオブジェクトを想定 (ground)
      } else {
        child.children.forEach((c) => {
          // メッシュオブジェクトの場合、マテリアルを初期化し、シャドウを設定
          if (c instanceof Mesh) {
            c.material = createMaterial(c.material.color, c.material.name);
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });
      }
    });
  }, []);

  // コンポーネントにはモデルオブジェクトのみを返す
  return { model };
};

export default useModel;
