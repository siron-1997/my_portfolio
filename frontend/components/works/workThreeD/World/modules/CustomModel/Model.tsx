import React, { useEffect, useRef } from 'react';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Dispatch, JSX, SetStateAction } from 'react';
import type { AnimationClip, Group, Mesh, Object3D } from 'three';
import { AnimationMixer, FrontSide, LoopOnce } from 'three';

import { DRACO_DECODER_PATH } from '@/constants/common';
import {
  WORK_WORLD_ANIMATION_NAME_REGEX,
  WORK_WORLD_FLOOR_PLANE_REGEX,
  WORK_WORLD_MODEL_API_BASE_PATH,
} from '@/constants/workThreeD';
import { type WorkDetail } from '@/types/api';
import { type ModelChildren } from '@/types/world';

type Props = {
  /** 表示する作品の詳細データ */
  content: WorkDetail;

  /** モデル子要素の更新関数 */
  setModelChildren: Dispatch<SetStateAction<ModelChildren>>;

  /** 初期コントロール状態フラグ */
  isInitialControl: boolean;

  /** コントロール開始フラグ */
  isStartControls: boolean;

  /** 現在選択中のコントロールインデックス */
  currentIndex: number;
};

/** DRACO デコーダーパスを設定 */
useGLTF.setDecoderPath(DRACO_DECODER_PATH);

/**
 * 「アニメーション名」と 「アニメーションクリップ名」 の部位名を正規化する処理
 *
 * 正規化することで、AnimationClip.name に部位名以外の情報が含まれていても、
 * animationName と対応する AnimationClip を特定できるようにする。
 *
 * @param str - 正規化対象文字列
 * @returns {string} 記号除去・小文字化した文字列
 *
 * @example
 * normalize(str);
 */
const normalize = (str: string): string =>
  str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

const Model = React.memo(
  ({
    content,
    setModelChildren,
    isInitialControl,
    isStartControls,
    currentIndex,
  }: Props): JSX.Element => {
    /** AnimationMixer の参照 Ref */
    const actionsRef = useRef<AnimationMixer | null>(null);

    /** Group オブジェクトの参照 Ref */
    const groupRef = useRef<Group | null>(null);

    /** useGLTF でモデルをプロキシ経由で読み込む（Storage URL をクライアントに公開しない） */
    const gltf = useGLTF(
      `${WORK_WORLD_MODEL_API_BASE_PATH}${content.key}`,
      true,
    );

    /** アニメーションを更新 */
    useFrame((_, delta) => {
      if (!actionsRef.current) return;
      actionsRef.current.update(delta);
    });

    /** 裏面を非表示 */
    useEffect(() => {
      gltf.scene.traverse((child: Object3D) => {
        if (!(child as Mesh).isMesh) return;

        /** 影を有効化 */
        child.castShadow = true;
        child.receiveShadow = true;

        /** 床の場合は影を無効化 */
        if (WORK_WORLD_FLOOR_PLANE_REGEX.test(child.name)) {
          child.castShadow = false;
        }

        const mesh = child as Mesh;

        /** メッシュのマテリアルのサイドをフロントサイドに設定 */
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => {
            material.side = FrontSide;
          });
        } else {
          mesh.material.side = FrontSide;
        }
      });
    }, [gltf]);

    useEffect(() => {
      if (!groupRef.current) return;

      /** 現在のアニメーション名を取得 */
      const currentAnimName =
        content.controls[currentIndex]?.animation_name || '';

      /** 正規化されたアニメーション名を取得 */
      const normalizedAnimName = normalize(currentAnimName);

      /** AnimationMixer を初期化 */
      actionsRef.current = new AnimationMixer(groupRef.current);

      gltf.animations.forEach((animation: AnimationClip) => {
        /** アニメーション名部分を抽出 */
        const match = animation.name.match(WORK_WORLD_ANIMATION_NAME_REGEX);

        /** 部位名を取得 */
        const partName = match ? match[1] : '';

        /** 正規化された部位名を取得 */
        const normalizedPartName = normalize(partName);

        /** アニメーション名と部位名が一致するかを確認 */
        const action = actionsRef.current!.clipAction(animation);

        if (isStartControls && !isInitialControl) {
          /** 一致する部位名かつ _S_（開始）アニメーションを再生 */
          if (
            animation.name.includes('_S_') &&
            normalizedPartName.includes(normalizedAnimName)
          ) {
            /** ループ設定が無効な場合はアニメーションを1回だけ再生 */
            if (!content.controls[currentIndex].is_loop) {
              action.clampWhenFinished = true;
              action.setLoop(LoopOnce, 0);
            }
            /** アニメーションを開始位置から再生 */
            action.startAt(1);
            action.play();
          }

          /** 一致しない部位名の _E_（終了）アニメーションを再生 */
          if (
            animation.name.includes('_E_') &&
            !normalizedPartName.includes(normalizedAnimName)
          ) {
            action.play();
          } else {
            /** Controls セクションから離れたとき全ての_E_アニメーションを再生 */
            if (animation.name.includes('_E_')) {
              action.reset().play();
            }
          }
        }
      });
    }, [
      content.controls,
      currentIndex,
      isInitialControl,
      isStartControls,
      gltf,
    ]);

    /** モデル子要素の更新 */
    useEffect(() => {
      setModelChildren(groupRef.current!.children[0].children as ModelChildren);
    }, [setModelChildren]);

    return (
      <group name="model-container" ref={groupRef}>
        <primitive object={gltf.scene} />
      </group>
    );
  },
);

Model.displayName = 'Model';

export default Model;
