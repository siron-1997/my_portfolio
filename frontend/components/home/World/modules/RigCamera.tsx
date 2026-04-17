'use client';

import React, {
  type JSX,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

import { CameraShake } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type { useCreateStore } from 'leva';
import { buttonGroup, useControls } from 'leva';
import { Group, MathUtils, Mesh, Vector3 } from 'three';

import { rigCameraAnimation } from '@/animations/home';
import { BREAK_POINTS, IS_DEV } from '@/constants/common';
import {
  HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS,
  HOME_WORLD_RIG_CAMERA_POSITIONS,
  HOME_WORLD_SCENE_NAME_CAMERA_CONTAINER,
} from '@/constants/home';
import { useWindowSize } from '@/hooks';

type Props = {
  /** portal セクション要素の参照 Ref */
  portalRef: RefObject<HTMLDivElement | null>;

  /** ドアグループへの Ref */
  doorRef: React.RefObject<Group | null>;

  /** Leva ストア */
  levaStore: ReturnType<typeof useCreateStore>;

  /** カメラが扉を通過した際の屋内状態変化コールバック */
  onInsideRoomChange: (isInside: boolean) => void;
};

const RigCamera = React.memo(
  ({
    portalRef,
    doorRef,
    levaStore,
    onInsideRoomChange,
  }: Props): JSX.Element => {
    /** カメラリグ格納グループの参照 Ref */
    const ref = useRef<Group | null>(null);

    /** ウィンドウサイズを取得 */
    const { width, height } = useWindowSize();

    /** シーンの参照 */
    const scene = useThree((state) => state.scene);
    /** カメラの参照 */
    const camera = useThree((state) => state.camera);

    /**
     * 現在のブレークポイントに対応するカメラ始終点・モデル Y・ドアアニメーション設定。
     * ウィンドウサイズ変化のたびに再計算する。
     */
    const currentBpConfig = useMemo(() => {
      /** ウィンドウ幅に応じてドアアニメーションの開始・終了位置を決定する */
      const doorStart = width > BREAK_POINTS.XS ? 50 : 54;
      const doorEnd = width > BREAK_POINTS.XS ? 100 : 124;

      switch (true) {
        case width >= BREAK_POINTS['2XL']:
          return {
            ...HOME_WORLD_RIG_CAMERA_POSITIONS.xxl,
            modelsOffsetY: -0.85,
            doorStart,
            doorEnd,
          };
        case width >= BREAK_POINTS.XL:
          return {
            ...HOME_WORLD_RIG_CAMERA_POSITIONS.xl,
            modelsOffsetY: -0.6,
            doorStart,
            doorEnd,
          };
        case width >= BREAK_POINTS.LG:
          return {
            ...HOME_WORLD_RIG_CAMERA_POSITIONS.lg,
            modelsOffsetY: -0.4,
            doorStart,
            doorEnd,
          };
        case width >= BREAK_POINTS.SM:
          return {
            ...HOME_WORLD_RIG_CAMERA_POSITIONS.tb,
            modelsOffsetY: -1.4,
            doorStart,
            doorEnd,
          };
        case width >= BREAK_POINTS.XS:
          if (width < height) {
            return {
              ...HOME_WORLD_RIG_CAMERA_POSITIONS.sm.wrap,
              modelsOffsetY: -3.2,
              doorStart,
              doorEnd,
            };
          }
          return {
            ...HOME_WORLD_RIG_CAMERA_POSITIONS.sm.side,
            modelsOffsetY: -1.2,
            doorStart,
            doorEnd,
          };
        default:
          return {
            ...HOME_WORLD_RIG_CAMERA_POSITIONS.xs,
            modelsOffsetY: -0.5,
            doorStart,
            doorEnd,
          };
      }
    }, [width, height]);

    /** デバッグ用カメラ・ドアコントロール（開発環境のみ Leva パネルに表示） */
    const {
      debugStartX,
      debugStartY,
      debugStartZ,
      debugEndX,
      debugEndY,
      debugEndZ,
      debugModelsOffsetY,
      debugDoorStart,
      debugDoorEnd,
      debugRainHideThreshold,
    } = useControls(
      'カメラ',
      {
        debugStartX: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.startX,
          value: currentBpConfig.start.x,
        },
        debugStartY: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.startY,
          value: currentBpConfig.start.y,
        },
        debugStartZ: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.startZ,
          value: currentBpConfig.start.z,
        },
        debugEndX: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.endX,
          value: currentBpConfig.end.x,
        },
        debugEndY: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.endY,
          value: currentBpConfig.end.y,
        },
        debugEndZ: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.endZ,
          value: currentBpConfig.end.z,
        },
        debugModelsOffsetY: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.modelsOffsetY,
          value: currentBpConfig.modelsOffsetY,
        },
        debugDoorStart: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.doorStart,
          value: currentBpConfig.doorStart,
        },
        debugDoorEnd: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.doorEnd,
          value: currentBpConfig.doorEnd,
        },
        debugRainHideThreshold: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.rainHideThreshold,
        },
        _cameraReset: buttonGroup({
          リセット: () =>
            levaStore.set(
              {
                'カメラ.debugStartX': currentBpConfig.start.x,
                'カメラ.debugStartY': currentBpConfig.start.y,
                'カメラ.debugStartZ': currentBpConfig.start.z,
                'カメラ.debugEndX': currentBpConfig.end.x,
                'カメラ.debugEndY': currentBpConfig.end.y,
                'カメラ.debugEndZ': currentBpConfig.end.z,
                'カメラ.debugModelsOffsetY': currentBpConfig.modelsOffsetY,
                'カメラ.debugDoorStart': currentBpConfig.doorStart,
                'カメラ.debugDoorEnd': currentBpConfig.doorEnd,
                'カメラ.debugRainHideThreshold':
                  HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.rainHideThreshold.value,
              },
              false,
            ),
        }),
      },
      { collapsed: true },
      { store: levaStore },
    );

    /**
     * debugRainHideThreshold 変更時、現在のドア回転角と即時比較して雨表示状態を更新する（開発環境のみ）。
     * useLayoutEffect による GSAP リセット後、スクラブが現在スクロール位置に追いつくまで 1 フレーム待つ。
     */
    useEffect(() => {
      if (!IS_DEV) return;
      const raf = requestAnimationFrame(() => {
        if (!doorRef.current) return;
        const door = doorRef.current.children.find(
          (c) => c instanceof Group && c.name === 'door-container',
        );
        if (!(door instanceof Group)) return;
        onInsideRoomChange(
          door.rotation.y >= MathUtils.degToRad(debugRainHideThreshold),
        );
      });
      return () => cancelAnimationFrame(raf);
    }, [debugRainHideThreshold, doorRef, onInsideRoomChange]);

    /** ブレークポイント変更時にスライダーを当該 BP のデフォルト値にリセットする（開発環境のみ） */
    useEffect(() => {
      if (!IS_DEV) return;
      levaStore.set(
        {
          'カメラ.debugStartX': currentBpConfig.start.x,
          'カメラ.debugStartY': currentBpConfig.start.y,
          'カメラ.debugStartZ': currentBpConfig.start.z,
          'カメラ.debugEndX': currentBpConfig.end.x,
          'カメラ.debugEndY': currentBpConfig.end.y,
          'カメラ.debugEndZ': currentBpConfig.end.z,
          'カメラ.debugModelsOffsetY': currentBpConfig.modelsOffsetY,
          'カメラ.debugDoorStart': currentBpConfig.doorStart,
          'カメラ.debugDoorEnd': currentBpConfig.doorEnd,
        },
        false,
      );
    }, [currentBpConfig, levaStore]);

    useLayoutEffect(() => {
      if (!width || !height || !portalRef.current || !doorRef.current) return;

      /** シーン内のモデルグループを取得 */
      const models = scene.children.find(
        (c) => c instanceof Group && c.name === 'models',
      );

      /** 扉コンテナと部屋メッシュを取得（入口チェック済みのため optional chaining 不要） */
      const door = doorRef.current.children.find(
        (c) => c instanceof Group && c.name === 'door-container',
      );
      const room = doorRef.current.children.find(
        (c) => c instanceof Mesh && c.name === 'room',
      );

      if (
        !(models instanceof Group) ||
        !(door instanceof Group) ||
        !(room instanceof Mesh)
      )
        return;

      /** デバッグ上書きまたはブレークポイント定数からカメラ設定を決定する */
      const startPos = IS_DEV
        ? new Vector3(debugStartX, debugStartY, debugStartZ)
        : currentBpConfig.start.clone();
      const endPos = IS_DEV
        ? new Vector3(debugEndX, debugEndY, debugEndZ)
        : currentBpConfig.end.clone();
      const modelsY = IS_DEV
        ? debugModelsOffsetY
        : currentBpConfig.modelsOffsetY;
      const doorStart = IS_DEV ? debugDoorStart : currentBpConfig.doorStart;
      const doorEnd = IS_DEV ? debugDoorEnd : currentBpConfig.doorEnd;
      const rainThreshold = IS_DEV
        ? debugRainHideThreshold
        : HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.rainHideThreshold.value;

      camera.position.copy(startPos);
      models.position.y = modelsY;

      /** カメラリグ格納グループのアニメーションを初期化 */
      const ctx = rigCameraAnimation({
        startPosition: startPos,
        endPosition: endPos,
        portal: portalRef.current!,
        door,
        room,
        ref,
        camera,
        doorAnimStart: doorStart,
        doorAnimEnd: doorEnd,
        onInsideRoomChange,
        doorHideRainThresholdDeg: rainThreshold,
      });

      return () => {
        ctx.revert();
      };
    }, [
      width,
      height,
      scene,
      camera,
      portalRef,
      doorRef,
      currentBpConfig,
      debugStartX,
      debugStartY,
      debugStartZ,
      debugEndX,
      debugEndY,
      debugEndZ,
      debugModelsOffsetY,
      debugDoorStart,
      debugDoorEnd,
      debugRainHideThreshold,
      onInsideRoomChange,
    ]);

    return (
      <group name={HOME_WORLD_SCENE_NAME_CAMERA_CONTAINER} ref={ref}>
        <CameraShake
          maxYaw={0.01}
          maxPitch={0.01}
          maxRoll={0.01}
          yawFrequency={0.2}
          pitchFrequency={0.2}
        />
      </group>
    );
  },
);

RigCamera.displayName = 'RigCamera';

export default RigCamera;
