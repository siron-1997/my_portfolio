'use client';

import React from 'react';
import type { Dispatch, JSX, SetStateAction } from 'react';

import Model from '@/components/works/workThreeD/World/modules/CustomModel/Model';
import Navigations from '@/components/works/workThreeD/World/modules/CustomModel/Navigations';
import { type WorkDetail } from '@/types/api';
import { type WorkThreeDAction } from '@/types/contexts';
import { type ModelChildren } from '@/types/world';

type Props = {
  /** 表示する作品の詳細データ */
  content: WorkDetail;

  /** ナビゲーション表示フラグ */
  isNavigationVisible: boolean;

  /** モデル子要素の更新関数 */
  setModelChildren: Dispatch<SetStateAction<ModelChildren>>;

  /** モデルの子要素リスト */
  modelChildren: ModelChildren;

  /** 初期コントロール状態フラグ */
  isInitialControl: boolean;

  /** コントロール開始フラグ */
  isStartControls: boolean;

  /** 現在選択中のコントロールインデックス */
  currentIndex: number;

  /** カメラアニメーション完了フラグ */
  isCameraReady: boolean;

  /** 状態更新ディスパッチ関数 */
  dispatch: Dispatch<WorkThreeDAction>;
};

const CustomModel = React.memo(
  ({
    content,
    isNavigationVisible,
    setModelChildren,
    modelChildren,
    isInitialControl,
    isStartControls,
    currentIndex,
    isCameraReady,
    dispatch,
  }: Props): JSX.Element => {
    return (
      <group name="import-model" scale={[1, 1, 1]}>
        {/* ナビゲーション */}
        <Navigations
          modelChildren={modelChildren}
          isNavigationVisible={isNavigationVisible}
          dispatch={dispatch}
        />

        {/* モデル (メイン) */}
        <Model
          content={content}
          setModelChildren={setModelChildren}
          isInitialControl={isInitialControl}
          isStartControls={isStartControls}
          currentIndex={currentIndex}
          isCameraReady={isCameraReady}
        />
      </group>
    );
  },
);

CustomModel.displayName = 'CustomModel';

export default CustomModel;
