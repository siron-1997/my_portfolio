import {
  Group,
  Vector3,
  OrthographicCamera,
  PerspectiveCamera,
  PointLight,
  Mesh,
  Object3D,
  MeshStandardMaterial,
} from 'three';
import { WeatherItem } from '@/types/api';
import { WORK_WORLD_SECTION_MAP } from '@/constants/world';

// =================================================================
// Common 3D Types
// =================================================================
/** 3D 空間の位置座標 */
export type Position = {
  x: number;
  y: number;
  z: number;
};

/** 3D 空間の回転 */
export type Rotation = {
  x: number;
  y: number;
  z: number;
};

/** 3D 空間の始点と終点を持つベクトルパス */
export type VectorPath = {
  readonly start: Vector3;
  readonly end: Vector3;
};

/** Three.js のモデル子要素 */
export type ModelChildren = Array<PerspectiveCamera | Mesh | PointLight | Object3D>;

// =================================================================
// Camera Types
// =================================================================
/** カメラのビューポートオフセット */
export type ViewOffset = {
  fullWidth: number;
  fullHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

/** カメラの基本パラメータ */
export type CameraParams = {
  position: Position;
  rotation: Rotation;
  viewOffset: ViewOffset;
};

/** カメラの開始・終了位置 */
export type CameraPositionState = {
  startPosition: Vector3;
  endPosition: Vector3;
};

/** カメラ位置を動的に設定する際のパラメータ */
export type CameraPositionSetter = {
  camera: OrthographicCamera | PerspectiveCamera;
  models: Group | any;
  width: number;
  height: number;
};

// =================================================================
// Home World Specific Types
// =================================================================
/** Home Worldのカメラリグのブレークポイント別ポジション */
export type HomeWorldRigCameraPositions = {
  readonly xs: VectorPath;
  readonly sm: {
    readonly wrap: VectorPath;
    readonly side: VectorPath;
  };
  readonly tb: VectorPath;
  readonly lg: VectorPath;
  readonly xl: VectorPath;
  readonly xxl: VectorPath;
};

/** Home Worldの雲の状態 */
export type CloudState = {
  thin: boolean;
  thick: boolean;
};

/** 時間帯（朝昼晩） */
export type TimePoint = 'evening' | 'night' | 'lunch';

/** 時間帯ごとの空の色 */
export type TimePointSkyColor = {
  thickCloud: string;
  thinCloud: string;
  clearSky: string;
};

/** 雷の発生状態 */
export type LightningState = {
  power: (value: number) => number;
  positionX: (value: number) => number;
  positionZ: (value: number) => number;
  visible: boolean;
};

/** 雨の発生状態 */
export type RainState = {
  color?: string;
  currentWeather: WeatherItem;
  lineWidth?: number;
  length?: number;
  xSpeed?: number;
  ySpeed?: number;
};

export type RainStateResult = {
  color: string;
  lineWidth: number;
  length: number;
  xSpeed: number;
  ySpeed: number;
};

/** Home Worldの山のマテリアル */
export type HomeWorldMountainMaterials = {
  [key: string]: MeshStandardMaterial;
};

// =================================================================
// Work World Specific Types
// =================================================================
/**
 * Work World のセクション名とパラメータキーの型定義
 * @from /utils/world/work/getCameraParams.ts
 */
export type WorkWorldSectionMap = typeof WORK_WORLD_SECTION_MAP;
export type WorkWorldSectionKey = keyof WorkWorldSectionMap;

/** Work Worldのセクションごとのカメラパラメータ */
export type WorkWorldSectionsCameraParams = {
  portal: CameraParams;
  introduction: CameraParams;
  controls: CameraParams;
};

/** Work Worldのビューワートグル時のカメラパラメータ */
export type WorkWorldViewerToggleCameraParams = {
  cameraParams: CameraParams;
  zoom: number;
  offset: number;
};

/** Work Worldの操作対象ごとのカメラ設定 */
export type ControlCameraConfig = {
  name: string;
  position: Position;
  rotation: Rotation;
  viewOffset: ViewOffset;
};

export type ControlCameraConfigs = ControlCameraConfig[];

// =================================================================
// Debug Types
// =================================================================
/** デバッグ用アンビエントライトのパラメータ */
export type DebugAmbientLightParams = {
  color: string;
  intensity: number;
};

/** デバッグ用ディレクショナルライトのパラメータ */
export type DebugDirectionalLightParams = {
  color: string;
  intensity: number;
};

/** デバッグ用カメラのパラメータ (typo修正: Prams -> Params) */
export type DebugCameraParams = {
  fov: number;
  near: number;
  far: number;
  position: Position;
  rotation: Rotation;
};

/** ポイントライトを含むグループ */
export type PointLightGroup = Group & {
  children: PointLight[];
};
