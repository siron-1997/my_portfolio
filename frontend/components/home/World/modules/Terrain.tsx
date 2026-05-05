'use client';

import React, { type JSX, useEffect, useMemo, useRef } from 'react';

import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { buttonGroup, useControls, type useCreateStore } from 'leva';
import {
  Color,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  Vector3,
} from 'three';
/** @ts-expect-error -- three/examples/jsm モジュールに型定義が存在しないため */
import { Water } from 'three/examples/jsm/objects/Water';

import {
  TERRAIN_LEAVES_COLORS,
  TERRAIN_TRUNK_COLORS,
  TIME_POINT_ENV_COLORS,
  WORLD_COLOR_PALETTE,
} from '@/constants/colors';
import { DRACO_DECODER_PATH, IS_DEV } from '@/constants/common';
import {
  DEFAULT_WEATHER,
  ENV_MAP_MODEL_TYPE_MODEL,
  HOME_WORLD_DEBUG_RIVER_CONTROLS,
  HOME_WORLD_RIVER_NORMALS_TEXTURE,
  HOME_WORLD_RIVER_TEXTURE_SIZE,
  HOME_WORLD_SCENE_NAME_TERRAIN,
  HOME_WORLD_TERRAIN_INSTANCED_TREE_NAME,
  HOME_WORLD_TERRAIN_MATERIAL_LEAVES,
  HOME_WORLD_TERRAIN_MATERIAL_TRUNK,
  HOME_WORLD_TERRAIN_MODEL_PATH,
  HOME_WORLD_TERRAIN_RIVER_NODE_NAME,
  HOME_WORLD_TERRAIN_TREE_NODE_PATTERN,
  HOME_WORLD_TERRAIN_TREE_SEED_PATTERN,
  WEATHER_CATEGORY_THICK_CLOUD,
  WEATHER_CATEGORY_THIN_CLOUD,
  WEATHER_TYPES,
} from '@/constants/home';
import { type OpenWeatherCurrentData, type TimePoint } from '@/types/api';
import { getEnvMapIntensity, getWeatherCategory } from '@/utils/world';

/**
 * シード付き疑似乱数（0〜1 の範囲）を返す。
 * Math.sin ハッシュを使用し、同一シードで常に同じ値を返す。
 *
 * @param {number} seed - 乱数のシード値
 * @returns {number} 0〜1 の疑似乱数
 */
const seededRandom = (seed: number): number => {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

type Props = {
  /** Open Weather API から返される現在の天候データのレスポンス全体 */
  currentWeatherData: OpenWeatherCurrentData | null;

  /** 時間帯（朝昼晩） */
  timePoint: TimePoint;

  /** Leva ストア */
  levaStore: ReturnType<typeof useCreateStore>;
};

const Model = React.memo(
  ({ currentWeatherData, timePoint, levaStore }: Props): JSX.Element => {
    /** 川水面 Water オブジェクトへの参照 Ref */
    const ref = useRef<Water | null>(null);

    /** Three.js のシーンと WebGL レンダラーを取得 */
    const threeScene = useThree((state) => state.scene);
    const gl = useThree((state) => state.gl);

    /** 地形モデルを読み込む */
    const { scene: modelScene } = useGLTF(HOME_WORLD_TERRAIN_MODEL_PATH, true);

    /** 川・海面共用の水面法線マップテクスチャ */
    const waterNormals = useTexture(HOME_WORLD_RIVER_NORMALS_TEXTURE);

    /** 天気情報リスト（API 成功時は取得値、未取得・失敗時はデフォルト値） */
    const weather = currentWeatherData?.weather ?? DEFAULT_WEATHER;

    /** デフォルト値 */
    const defaults = {
      color: WORLD_COLOR_PALETTE.riverWater,
      distortionScale: HOME_WORLD_DEBUG_RIVER_CONTROLS.distortionScale.value,
      flowSpeed: HOME_WORLD_DEBUG_RIVER_CONTROLS.flowSpeed.value,
    };

    /** 川水面コントロール（開発環境デバッグ用） */
    const { debugColor, debugDistortionScale, debugFlowSpeed } = useControls(
      '川',
      {
        debugColor: {
          ...HOME_WORLD_DEBUG_RIVER_CONTROLS.color,
          value: defaults.color,
        },
        debugDistortionScale: {
          ...HOME_WORLD_DEBUG_RIVER_CONTROLS.distortionScale,
          value: defaults.distortionScale,
        },
        debugFlowSpeed: {
          ...HOME_WORLD_DEBUG_RIVER_CONTROLS.flowSpeed,
          value: defaults.flowSpeed,
        },
        _riverReset: buttonGroup({
          リセット: () =>
            levaStore.set(
              {
                '川.debugColor': defaults.color,
                '川.debugDistortionScale': defaults.distortionScale,
                '川.debugFlowSpeed': defaults.flowSpeed,
              },
              false,
            ),
        }),
      },
      { collapsed: true },
      { store: levaStore },
    );

    /** 川水面の色 */
    const riverColor = IS_DEV ? debugColor : defaults.color;

    /** 川水面のディストーションスケール */
    const riverDistortionScale = IS_DEV
      ? debugDistortionScale
      : defaults.distortionScale;

    /** 川水面の波の変化速度 */
    const riverFlowSpeed = IS_DEV ? debugFlowSpeed : defaults.flowSpeed;

    /** 現在の天気を取得 */
    const currentWeather = weather.find((w) => WEATHER_TYPES.includes(w.main));

    /** 川水面の日光色（天気カテゴリ・時間帯から算出） */
    const riverSunColor = useMemo<string>(() => {
      const c = TIME_POINT_ENV_COLORS[timePoint];
      const category = getWeatherCategory(currentWeather?.description ?? '');
      if (category === WEATHER_CATEGORY_THICK_CLOUD) return c.thickCloud;
      if (category === WEATHER_CATEGORY_THIN_CLOUD) return c.thinCloud;
      return c.clearSky;
    }, [currentWeather, timePoint]);

    /** 川水面の色 Ref */
    const riverColorRef = useRef<string>(riverColor);

    /** 川水面のディストーションスケール Ref */
    const riverDistortionScaleRef = useRef<number>(riverDistortionScale);

    /** 川水面の日光色 Ref */
    const riverSunColorRef = useRef<string>(riverSunColor);

    /** 川水面パラメータの最新値 Ref */
    riverColorRef.current = riverColor;
    riverDistortionScaleRef.current = riverDistortionScale;
    riverSunColorRef.current = riverSunColor;

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

    /**
     * 川水面のアニメーション。
     * 毎フレーム Water シェーダーの time uniform を進め、水面が流れているように見せる。
     *
     * @param {Object} _ - R3F のステート（未使用）
     * @param {number} delta - 前フレームからの経過時間（秒）
     */
    useFrame((_, delta) => {
      if (!ref.current) return;
      ref.current.material.uniforms['time'].value += delta * riverFlowSpeed;
    });

    /**
     * モデル全体を走査し、各メッシュに envMap・影・木のランダムカラーを適用する。
     *
     * SM_Tree_A.N / SM_Tree_B.N ノードは 2 primitives（M_TrunkA・M_LeavesA）を持つため
     * Three.js GLTF ローダーが Group に展開する。
     * children.forEach でマテリアル名を判定し、旧 mountain.glb のカラーパレットから
     * シードに基づいて選択したカラーをクローン済みマテリアルに適用する。
     */
    useEffect(() => {
      /** Water 差し替え時に生成した River Water オブジェクト（cleanup 用） */
      let createdRiver: Water | null = null;

      /** 非表示にした元 River Mesh（cleanup 時に再表示する） */
      let hiddenRiverMesh: Mesh | null = null;

      modelScene.traverse((object) => {
        /**
         * GPU インスタンシング用の InstancedMesh 親グループを非表示にする。
         *
         * GLB は EXT_mesh_gpu_instancing で SM_Tree.0/SM_Tree.1 を作成するが、
         * 同じ位置に個別ノード（SM_Tree_A[N] / SM_Tree_B[N]）も存在するため
         * InstancedMesh を非表示にして個別ノードのみ使用する。
         */
        if (object.name === HOME_WORLD_TERRAIN_INSTANCED_TREE_NAME) {
          object.visible = false;
          return;
        }

        /**
         * 木ノード（SM_Tree_B1 / SM_Tree_A119 など）の処理。
         *
         * GLTF JSON 上のノード名は "SM_Tree_B.1" / "SM_Tree_A.119" だが、
         * Three.js GLTFLoader は PropertyBinding.sanitizeNodeName により
         * ドット（予約文字）を除去するため object.name は "SM_Tree_B1" 形式になる。
         *
         * Three.js の GLTFLoader は多くの場合 Group を生成するが、条件によっては
         * Object3D になる可能性があるため instanceof Group への依存を除去し、
         * 名前パターンのみで判定する。
         */
        if (HOME_WORLD_TERRAIN_TREE_NODE_PATTERN.test(object.name)) {
          /** ノード自体にも castShadow を設定（防御的措置） */
          object.castShadow = true;
          /** ノード名末尾の数値をシードとして使用 */
          const seed = Number(
            object.name.match(HOME_WORLD_TERRAIN_TREE_SEED_PATTERN)?.[0] ?? 0,
          );

          /** 各 primitive Mesh にカラー・envMap・影を適用 */
          object.children.forEach((child) => {
            if (
              !(child instanceof Mesh) ||
              !(child.material instanceof MeshStandardMaterial)
            )
              return;

            child.material = child.material.clone();
            const mat = child.material as MeshStandardMaterial;

            /** 幹カラー Tree_1 / Tree_2 パレットからシード選択 */
            if (mat.name === HOME_WORLD_TERRAIN_MATERIAL_TRUNK) {
              const idx = Math.floor(
                seededRandom(seed) * TERRAIN_TRUNK_COLORS.length,
              );
              mat.color = new Color(TERRAIN_TRUNK_COLORS[idx]);
            } else if (mat.name === HOME_WORLD_TERRAIN_MATERIAL_LEAVES) {
              /** 葉カラー: Leaves_1〜6 パレットからシード選択 */
              const idx = Math.floor(
                seededRandom(seed + 1) * TERRAIN_LEAVES_COLORS.length,
              );
              mat.color = new Color(TERRAIN_LEAVES_COLORS[idx]);
            }

            mat.envMap = threeScene.environment;
            mat.envMapIntensity = envMapIntensity;
            mat.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
          });

          return;
        }

        /**
         * River メッシュは Three.js Water シェーダーに差し替える。
         * 元メッシュを非表示にし、同ジオメトリを使った Water オブジェクトを
         * 同一親ノードに追加することで、地形内の川に水面エフェクトを適用する。
         */
        if (
          object instanceof Mesh &&
          object.name === HOME_WORLD_TERRAIN_RIVER_NODE_NAME
        ) {
          waterNormals.wrapS = RepeatWrapping;
          waterNormals.wrapT = RepeatWrapping;

          object.visible = false;
          hiddenRiverMesh = object;

          /** River Water オブジェクトを生成 */
          const river = new Water(object.geometry, {
            textureWidth: HOME_WORLD_RIVER_TEXTURE_SIZE,
            textureHeight: HOME_WORLD_RIVER_TEXTURE_SIZE,
            waterNormals,
            sunDirection: new Vector3(),
            sunColor: riverSunColorRef.current,
            waterColor: riverColorRef.current,
            distortionScale: riverDistortionScaleRef.current,
            fog: true,
            format: gl,
          });

          /** River Water オブジェクトの位置・回転・スケールを設定 */
          river.position.copy(object.position);
          river.rotation.copy(object.rotation);
          river.scale.copy(object.scale);

          river.receiveShadow = true;

          /** River Water オブジェクトを親ノードに追加 */
          object.parent?.add(river);

          /** River Water オブジェクトを保持 */
          createdRiver = river;
          ref.current = river;

          return;
        }

        /** 地形・川など木以外のメッシュに envMap と影を設定 */
        if (
          object instanceof Mesh &&
          object.material instanceof MeshStandardMaterial
        ) {
          object.material.envMap = threeScene.environment;
          object.material.envMapIntensity = envMapIntensity;
          object.material.needsUpdate = true;
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });

      return () => {
        createdRiver?.parent?.remove(createdRiver);
        if (hiddenRiverMesh) hiddenRiverMesh.visible = true;
        ref.current = null;
      };
    }, [modelScene, threeScene.environment, envMapIntensity, waterNormals, gl]);

    /**
     * 川水面の color・sunColor・distortionScale uniforms 更新する
     * デバッグコントロール操作や天気変化時に全走査を回避するため分離。
     */
    useEffect(() => {
      if (!ref.current) return;
      ref.current.material.uniforms['waterColor'].value.set(riverColor);
      ref.current.material.uniforms['sunColor'].value.set(riverSunColor);
      ref.current.material.uniforms['distortionScale'].value =
        riverDistortionScale;
    }, [riverColor, riverSunColor, riverDistortionScale]);

    return (
      <group renderOrder={0} name={HOME_WORLD_SCENE_NAME_TERRAIN}>
        <primitive object={modelScene} />
      </group>
    );
  },
);

Model.displayName = 'Model';

useGLTF.setDecoderPath(DRACO_DECODER_PATH);
useGLTF.preload(HOME_WORLD_TERRAIN_MODEL_PATH, true);

export default Model;
