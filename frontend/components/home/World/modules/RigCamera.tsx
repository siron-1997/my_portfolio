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
import { buttonGroup, useControls, type useCreateStore } from 'leva';
import { Group, MathUtils, Mesh, Vector3 } from 'three';

import { rigCameraAnimation } from '@/animations/home';
import { BREAK_POINTS, IS_DEV } from '@/constants/common';
import {
  HOME_WORLD_CAMERA_SHAKE_MAX_PITCH,
  HOME_WORLD_CAMERA_SHAKE_MAX_ROLL,
  HOME_WORLD_CAMERA_SHAKE_MAX_YAW,
  HOME_WORLD_CAMERA_SHAKE_PITCH_FREQUENCY,
  HOME_WORLD_CAMERA_SHAKE_YAW_FREQUENCY,
  HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS,
  HOME_WORLD_DOOR_ANIM_END_DEFAULT,
  HOME_WORLD_DOOR_ANIM_END_XS,
  HOME_WORLD_DOOR_ANIM_START_DEFAULT,
  HOME_WORLD_DOOR_ANIM_START_XS,
  HOME_WORLD_MODELS_OFFSET_Y_2XL,
  HOME_WORLD_MODELS_OFFSET_Y_DEFAULT,
  HOME_WORLD_MODELS_OFFSET_Y_LG,
  HOME_WORLD_MODELS_OFFSET_Y_SM,
  HOME_WORLD_MODELS_OFFSET_Y_XL,
  HOME_WORLD_MODELS_OFFSET_Y_XS_SIDE,
  HOME_WORLD_MODELS_OFFSET_Y_XS_WRAP,
  HOME_WORLD_RIG_CAMERA_POSITIONS,
  HOME_WORLD_RIG_CAMERA_START,
  HOME_WORLD_SCENE_NAME_CAMERA_CONTAINER,
  HOME_WORLD_SCENE_NAME_DOOR_CONTAINER,
  HOME_WORLD_SCENE_NAME_MODELS,
  HOME_WORLD_SCENE_NAME_ROOM,
} from '@/constants/home';
import { useWindowSize } from '@/hooks';

/**
 * RigCameraConfig から { start, end, mid } の Vector3 セットを生成するヘルパー。
 * 共通開始点 HOME_WORLD_RIG_CAMERA_START を使い、終点は endY から構築する。
 */
const toVectorPath = (config: { endY: number; mid: Vector3 }) => ({
  start: HOME_WORLD_RIG_CAMERA_START.clone(),
  end: new Vector3(0, config.endY, -0.5),
  mid: config.mid.clone(),
});

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
      /** ウィンドウ幅に応じてドアアニメーションの開始位置を決定 */
      const doorStart =
        width > BREAK_POINTS.XS
          ? HOME_WORLD_DOOR_ANIM_START_DEFAULT
          : HOME_WORLD_DOOR_ANIM_START_XS;

      /** ウィンドウ幅に応じてドアアニメーションの終了位置を決定 */
      const doorEnd =
        width > BREAK_POINTS.XS
          ? HOME_WORLD_DOOR_ANIM_END_DEFAULT
          : HOME_WORLD_DOOR_ANIM_END_XS;

      switch (true) {
        case width >= BREAK_POINTS['2XL']:
          return {
            ...toVectorPath(HOME_WORLD_RIG_CAMERA_POSITIONS.xxl),
            modelsOffsetY: HOME_WORLD_MODELS_OFFSET_Y_2XL,
            doorStart,
            doorEnd,
          };
        case width >= BREAK_POINTS.XL:
          return {
            ...toVectorPath(HOME_WORLD_RIG_CAMERA_POSITIONS.xl),
            modelsOffsetY: HOME_WORLD_MODELS_OFFSET_Y_XL,
            doorStart,
            doorEnd,
          };
        case width >= BREAK_POINTS.LG:
          return {
            ...toVectorPath(HOME_WORLD_RIG_CAMERA_POSITIONS.lg),
            modelsOffsetY: HOME_WORLD_MODELS_OFFSET_Y_LG,
            doorStart,
            doorEnd,
          };
        case width >= BREAK_POINTS.SM:
          return {
            ...toVectorPath(HOME_WORLD_RIG_CAMERA_POSITIONS.tb),
            modelsOffsetY: HOME_WORLD_MODELS_OFFSET_Y_SM,
            doorStart,
            doorEnd,
          };
        case width >= BREAK_POINTS.XS:
          if (width < height) {
            return {
              ...toVectorPath(HOME_WORLD_RIG_CAMERA_POSITIONS.sm.wrap),
              modelsOffsetY: HOME_WORLD_MODELS_OFFSET_Y_XS_WRAP,
              doorStart,
              doorEnd,
            };
          }
          return {
            ...toVectorPath(HOME_WORLD_RIG_CAMERA_POSITIONS.sm.side),
            modelsOffsetY: HOME_WORLD_MODELS_OFFSET_Y_XS_SIDE,
            doorStart,
            doorEnd,
          };
        default:
          return {
            ...toVectorPath(HOME_WORLD_RIG_CAMERA_POSITIONS.xs),
            modelsOffsetY: HOME_WORLD_MODELS_OFFSET_Y_DEFAULT,
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
      debugMidX,
      debugMidY,
      debugMidZ,
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
        debugMidX: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.midX,
          value: currentBpConfig.mid.x,
        },
        debugMidY: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.midY,
          value: currentBpConfig.mid.y,
        },
        debugMidZ: {
          ...HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.midZ,
          value: currentBpConfig.mid.z,
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
                'カメラ.debugMidX': currentBpConfig.mid.x,
                'カメラ.debugMidY': currentBpConfig.mid.y,
                'カメラ.debugMidZ': currentBpConfig.mid.z,
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

    useEffect(() => {
      if (!IS_DEV) return;

      /** ドアの回転角を取得して雨表示状態を更新 */
      const raf = requestAnimationFrame(() => {
        if (!doorRef.current) return;

        /** ドアコンテナを取得 */
        const door = doorRef.current.children.find(
          (c) =>
            c instanceof Group &&
            c.name === HOME_WORLD_SCENE_NAME_DOOR_CONTAINER,
        );

        if (!(door instanceof Group)) return;

        /** 雨表示状態を更新 */
        onInsideRoomChange(
          door.rotation.y >= MathUtils.degToRad(debugRainHideThreshold),
        );
      });

      return () => {
        cancelAnimationFrame(raf);
      };
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
          'カメラ.debugMidX': currentBpConfig.mid.x,
          'カメラ.debugMidY': currentBpConfig.mid.y,
          'カメラ.debugMidZ': currentBpConfig.mid.z,
          'カメラ.debugModelsOffsetY': currentBpConfig.modelsOffsetY,
          'カメラ.debugDoorStart': currentBpConfig.doorStart,
          'カメラ.debugDoorEnd': currentBpConfig.doorEnd,
        },
        false,
      );
    }, [currentBpConfig, levaStore]);

    /**
     * アニメーションに使用する実効設定値。
     * 開発環境では Leva スライダーの値を優先し、本番環境ではブレークポイント設定値を使用する。
     */
    const animConfig = useMemo(
      () => ({
        startPos: IS_DEV
          ? new Vector3(debugStartX, debugStartY, debugStartZ)
          : currentBpConfig.start.clone(),
        endPos: IS_DEV
          ? new Vector3(debugEndX, debugEndY, debugEndZ)
          : currentBpConfig.end.clone(),
        midPos: IS_DEV
          ? new Vector3(debugMidX, debugMidY, debugMidZ)
          : currentBpConfig.mid,
        modelsY: IS_DEV ? debugModelsOffsetY : currentBpConfig.modelsOffsetY,
        doorStart: IS_DEV ? debugDoorStart : currentBpConfig.doorStart,
        doorEnd: IS_DEV ? debugDoorEnd : currentBpConfig.doorEnd,
        rainThreshold: IS_DEV
          ? debugRainHideThreshold
          : HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS.rainHideThreshold.value,
      }),
      [
        currentBpConfig,
        debugStartX,
        debugStartY,
        debugStartZ,
        debugEndX,
        debugEndY,
        debugEndZ,
        debugMidX,
        debugMidY,
        debugMidZ,
        debugModelsOffsetY,
        debugDoorStart,
        debugDoorEnd,
        debugRainHideThreshold,
      ],
    );

    useLayoutEffect(() => {
      if (!width || !height || !portalRef.current || !doorRef.current) return;

      /** シーン内のモデルグループを取得 */
      const models = scene.children.find(
        (c) => c instanceof Group && c.name === HOME_WORLD_SCENE_NAME_MODELS,
      );

      /** 扉コンテナを取得 */
      const door = doorRef.current.children.find(
        (c) =>
          c instanceof Group && c.name === HOME_WORLD_SCENE_NAME_DOOR_CONTAINER,
      );

      /** 部屋を取得 */
      const room = doorRef.current.children.find(
        (c) => c instanceof Mesh && c.name === HOME_WORLD_SCENE_NAME_ROOM,
      );

      if (
        !(models instanceof Group) ||
        !(door instanceof Group) ||
        !(room instanceof Mesh)
      ) {
        return;
      }

      /** カメラの位置を設定 */
      camera.position.copy(animConfig.startPos);
      models.position.y = animConfig.modelsY;

      /** カメラリグ格納グループのアニメーションを初期化 */
      const ctx = rigCameraAnimation({
        startPosition: animConfig.startPos,
        endPosition: animConfig.endPos,
        midPosition: animConfig.midPos,
        portal: portalRef.current!,
        door,
        room,
        ref,
        camera,
        doorAnimStart: animConfig.doorStart,
        doorAnimEnd: animConfig.doorEnd,
        onInsideRoomChange,
        doorHideRainThresholdDeg: animConfig.rainThreshold,
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
      animConfig,
      onInsideRoomChange,
    ]);

    return (
      <group name={HOME_WORLD_SCENE_NAME_CAMERA_CONTAINER} ref={ref}>
        <CameraShake
          maxYaw={HOME_WORLD_CAMERA_SHAKE_MAX_YAW}
          maxPitch={HOME_WORLD_CAMERA_SHAKE_MAX_PITCH}
          maxRoll={HOME_WORLD_CAMERA_SHAKE_MAX_ROLL}
          yawFrequency={HOME_WORLD_CAMERA_SHAKE_YAW_FREQUENCY}
          pitchFrequency={HOME_WORLD_CAMERA_SHAKE_PITCH_FREQUENCY}
        />
      </group>
    );
  },
);

RigCamera.displayName = 'RigCamera';

export default RigCamera;
