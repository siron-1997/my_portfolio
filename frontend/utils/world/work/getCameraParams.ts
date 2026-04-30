import { Object3D, PerspectiveCamera } from 'three';

import { BREAK_POINT_KEYS, BREAK_POINTS } from '@/constants/common';
import {
  DEFAULT_CONTROLS_VIEW_OFFSET,
  DEFAULT_SECTION_CAMERA_PARAMS,
  DEFAULT_VIEWER_TOGGLE_CAMERA_PARAMS,
  WORK_WORLD_SECTION_CAMERA_BREAKPOINTS,
  WORK_WORLD_SECTION_MAP,
  WORK_WORLD_VIEWER_TOGGLE_CAMERA_BREAKPOINTS,
} from '@/constants/workThreeD';
import { type WorkControl } from '@/types/api';
import {
  type ControlCameraConfig,
  type ControlCameraConfigs,
  type GenerateControlsResult,
  type ModelChildren,
  type ViewOffset,
  type WorkWorldSectionKey,
  type WorkWorldSectionsCameraParams,
  type WorkWorldViewerToggleCameraParams,
} from '@/types/world';

export const getSectionsCameraParams = (
  modelChildren: ModelChildren,
  width: number,
  height: number,
): WorkWorldSectionsCameraParams => {
  /** デフォルト値で初期化 */
  const cameraParams = { ...DEFAULT_SECTION_CAMERA_PARAMS };

  /** モデル内のカメラまたは Object3D のみを抽出 */
  const objects = modelChildren.filter(
    (c) => c instanceof PerspectiveCamera || c instanceof Object3D,
  );

  /** 現在のウィンドウ幅に該当するブレークポイント設定を取得 */
  const bp = WORK_WORLD_SECTION_CAMERA_BREAKPOINTS.find(
    (bp) => width >= bp.min && width < bp.max,
  );

  if (!bp) return cameraParams;

  /** 各カメラ/オフセットオブジェクトを処理 */
  objects.forEach((obj) => {
    /** 名前がブレークポイントの prefix にマッチしない場合はスキップ */
    if (!bp.prefix.test(obj.name)) return;

    /** 名前を '_' で分割し、セクション名やインデックスを抽出 */
    const objNames = obj.name.split('_');
    let sectionKey: WorkWorldSectionKey | undefined;
    let index: string | undefined;

    /** カメラの場合: Cam_BP_XX_SecN_0 */
    if (obj instanceof PerspectiveCamera) {
      sectionKey = objNames[3] as WorkWorldSectionKey;
      index = objNames[4];
      /** オフセットの場合: Cam_BP_XX_Offset_SecN_0 */
    } else if (obj instanceof Object3D && objNames[3] === 'Offset') {
      sectionKey = objNames[4] as WorkWorldSectionKey;
      index = objNames[5];
    }

    /** タブレット or スマホの場合 */
    if (width < BREAK_POINTS.SM) {
      const offset = 1.3;
      obj.position.x = obj.position.x * offset;
      obj.position.y = obj.position.y * offset;
      obj.position.z = obj.position.z * offset;
    }

    /** sectionKey が不正な場合や、代表カメラ以外（index !== '0'）はスキップ */
    const paramKey = sectionKey && WORK_WORLD_SECTION_MAP[sectionKey];
    if (!paramKey && index !== '0') return;
    if (!paramKey) return;

    /** 対象セクションのカメラパラメータを取得 */
    const target = cameraParams[paramKey];

    /** カメラの場合は position/rotation を設定 */
    if (obj instanceof PerspectiveCamera) {
      target.position = obj.position;
      target.rotation = obj.rotation;
      /** Offset 用 Object3D の場合は viewOffset を設定 */
    } else if (obj instanceof Object3D && objNames[3] === 'Offset') {
      target.viewOffset = {
        fullWidth: width,
        fullHeight: height,
        x: obj.position.x * width,
        y: -obj.position.z * height,
        width,
        height,
      };
    }
  });

  return cameraParams;
};

/**
 * ビュワーモード切り替え用カメラパラメータを取得
 * - modelChildren からカメラ・オフセットを抽出し、ブレークポイントごとに適用
 */
export const getViwerToggleCameraParams = (
  modelChildren: ModelChildren,
  width: number,
  height: number,
): WorkWorldViewerToggleCameraParams => {
  const cameraParams = { ...DEFAULT_VIEWER_TOGGLE_CAMERA_PARAMS };
  let zoom = 0;
  let offset = 0;

  /** モバイルビューの場合 */
  if (width < BREAK_POINTS.XS) {
    offset = 20;
  }

  /** 対応表からブレークポイントを取得 */
  const bp = WORK_WORLD_VIEWER_TOGGLE_CAMERA_BREAKPOINTS.find(
    (bp) => width >= bp.min && width < bp.max,
  );
  if (!bp) return { cameraParams, zoom, offset };

  /** カメラ・オフセット両方に対応するprefixで抽出 */
  modelChildren.forEach((obj) => {
    if (!bp.prefix.test(obj.name)) return;

    /** カメラの場合は position/rotation を設定 */
    if (obj instanceof PerspectiveCamera) {
      cameraParams.position = obj.position;
      cameraParams.rotation = obj.rotation;
      /** Offset 用 Object3D の場合は viewOffset を設定 */
    } else if (obj instanceof Object3D) {
      cameraParams.viewOffset = {
        fullWidth: width,
        fullHeight: height,
        x: obj.position.x,
        y: -obj.position.z,
        width,
        height,
      };
    }
  });

  zoom = bp.zoom;

  return { cameraParams, zoom, offset };
};

/**
 * コントロール用カメラパラメータをウィンドウ幅に応じて返す。
 * 各ブレークポイントごとに position/rotation を切り替え、
 * ブレークポイントと設定値の対応を配列で管理して保守性を高める。
 */
export const generateControlsCameraConfigs = (
  modelChildren: ModelChildren,
  width: number,
  height: number,
  controlsItems: WorkControl[],
): GenerateControlsResult => {
  const configs: Record<string, ControlCameraConfig> = {};
  const regex = /^Cam_BP_(3XL|2XL|XL|LG|SM|XS)_(?:Offset_)?Sec3_(\d+)_?(.+)$/;

  /** デフォルト viewOffset（全て0、workWorld.tsで管理） */
  const defaultViewOffset: ViewOffset = { ...DEFAULT_CONTROLS_VIEW_OFFSET };

  /** 現在のウィンドウ幅に該当するブレークポイントを特定 */
  const currentBreakPointKey = BREAK_POINT_KEYS.find((key, i) => {
    const min = i === 0 ? -Infinity : BREAK_POINTS[BREAK_POINT_KEYS[i - 1]];
    const max = BREAK_POINTS[key];
    return width >= min && width < max;
  });

  if (!currentBreakPointKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('No matching breakpoint found for width:', width);
    }
    return { configs: [], sortedControls: [] };
  }

  /** 該当するブレークポイントのカメラとオフセットを抽出 */
  const bpObjects = modelChildren.filter((obj) => {
    const match = obj.name.match(regex);
    return match && match[1] === currentBreakPointKey;
  });

  /** bpObjects 内のすべてのカメラとオフセットを処理 */
  bpObjects.forEach((obj) => {
    const match = obj.name.match(regex);
    if (!match) return;

    const indexString = match[2];
    const name = match[3];
    const isOffset = obj.name.includes('Offset');

    if (!configs[indexString]) {
      configs[indexString] = {
        name,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        viewOffset: defaultViewOffset,
      };
    }

    if (obj instanceof PerspectiveCamera) {
      configs[indexString].position = obj.position;
      configs[indexString].rotation = obj.rotation;
    }

    if (isOffset) {
      configs[indexString].viewOffset = {
        fullWidth: width,
        fullHeight: height,
        x: obj.position.x * width,
        y: -obj.position.z * height,
        width: width,
        height: height,
      };
    }
  });

  /** GLB 数値インデックス順にソート */
  const sortedConfigsArray = Object.keys(configs)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((key) => configs[key]);

  /** cameraConfigs の name 順に controlsItems をソート */
  const sortedControls = sortedConfigsArray
    .map(
      (cfg) =>
        controlsItems.find((item) => item.animation_name === cfg.name) || null,
    )
    .filter((item): item is WorkControl => item !== null);

  return { configs: sortedConfigsArray, sortedControls };
};
