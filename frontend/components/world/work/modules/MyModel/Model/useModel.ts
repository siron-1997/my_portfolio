import { useEffect, useRef } from 'react';

import { useFrame, useLoader } from '@react-three/fiber';
import type React from 'react';
import {
  type AnimationClip,
  AnimationMixer,
  FrontSide,
  type Group,
  LoopOnce,
  type Material,
  type Mesh,
  type Object3D,
} from 'three';
/** @ts-expect-error three/examples/jsm モジュールに型定義が存在しないため */
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
/** @ts-expect-error three/examples/jsm モジュールに型定義が存在しないため */
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * DRACOLoader シングルトン
 * useLoader のセットアップ関数が複数回呼ばれても WASM 仮想 FS を二重マウントしないよう
 * モジュールレベルで1インスタンスのみ生成する。
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

import { type WorkDetail } from '@/types/api';
import { type ModelChildren } from '@/types/world';

/** useModel Props の型定義 */
type Props = {
  /** 表示する作品の詳細データ */
  content: WorkDetail;

  /** モデル子要素の更新関数 */
  setModelChildren: React.Dispatch<React.SetStateAction<ModelChildren>>;

  /** 初期コントロール状態フラグ */
  isInitialControl: boolean;

  /** コントロール開始フラグ */
  isStartControls: boolean;

  /** 現在選択中のコントロールインデックス */
  currentIndex: number;
};

const useModel = ({
  content,
  setModelChildren,
  isInitialControl,
  isStartControls,
  currentIndex,
}: Props) => {
  const groupRef = useRef<Group>(null);

  /** GLTFLoader でモデルをプロキシ経由で読み込む（Storage URL をクライアントに公開しない） */
  const gltf = useLoader(
    GLTFLoader,
    `/api/supabase/model/${content.key}`,
    (loader) => {
      loader.setDRACOLoader(dracoLoader);
    },
  );

  /** 裏面を非表示 */
  gltf.scene.traverse((child: Object3D) => {
    if ((child as Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      /** 床の場合 */
      if (/_Plane$/.test(child.name)) {
        child.castShadow = false;
      }

      /** メッシュのマテリアルのサイドをフロントサイドに設定 */
      const mesh = child as Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material: Material) => {
          material.side = FrontSide;
        });
      } else {
        mesh.material.side = FrontSide;
      }
    }
  });

  let actions: AnimationMixer | null = null;

  /**
   * animationName と AnimationClip.name の部位名を正規化して比較しやすくする。
   * @param str - 正規化対象文字列
   * @returns {string} 記号除去・小文字化した文字列
   
 *
 * @example
 * normalize(str);
 */
  const normalize = (str: string) =>
    str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  /** 現在のアニメーション名 */
  const currentAnimName = content.controls[currentIndex]?.animation_name || '';
  const normalizedAnimName = normalize(currentAnimName);

  if (groupRef.current !== null) {
    actions = new AnimationMixer(groupRef.current);

    /** 命名規則: AS_{部位名}_{S|E}_N */
    /** _S_ が開始、_E_ が終了 */
    gltf.animations.forEach((animation: AnimationClip) => {
      /** 部位名部分を抽出 */
      const match = animation.name.match(/^AS_([^_]+)_[SE]_N/);
      const partName = match ? match[1] : '';
      const normalizedPartName = normalize(partName);
      const action = actions!.clipAction(animation);

      if (isStartControls && !isInitialControl) {
        /** 一致する部位名かつ _S_（開始）アニメーションを再生 */
        if (
          animation.name.includes('_S_') &&
          normalizedPartName.includes(normalizedAnimName)
        ) {
          if (!content.controls[currentIndex].is_loop) {
            action.clampWhenFinished = true;
            action.setLoop(LoopOnce, 0);
          }
          action.startAt(1);
          action.play();
        } else if (
          /** 一致しない部位名の _E_（終了）アニメーションを再生 */
          animation.name.includes('_E_') &&
          !normalizedPartName.includes(normalizedAnimName)
        ) {
          action.play();
        }
      } else {
        /** Controls セクションから離れたとき全ての_E_アニメーションを再生 */
        if (animation.name.includes('_E_')) {
          action.reset().play();
        }
      }
    });
  }

  useEffect(() => {
    setModelChildren(groupRef.current!.children[0].children as ModelChildren);
  }, [setModelChildren]);

  useFrame((_, delta) => {
    /** アニメーションを更新 */
    if (actions !== null && actions !== undefined) {
      actions.update(delta);
    }
  });

  return { groupRef, gltf };
};

export default useModel;
