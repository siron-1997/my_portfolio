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

/** Common 3D Types */
/** 3D 空間の位置座標 */
export type Position = {
  /** X 軸方向の座標値 */
  x: number;

  /** Y 軸方向の座標値 */
  y: number;

  /** Z 軸方向の座標値 */
  z: number;
};

/** 3D 空間の回転 */
export type Rotation = {
  /** X 軸回りの回転角（ラジアン） */
  x: number;

  /** Y 軸回りの回転角（ラジアン） */
  y: number;

  /** Z 軸回りの回転角（ラジアン） */
  z: number;
};

/** 3D 空間の始点と終点を持つベクトルパス */
export type VectorPath = Readonly<{
  /** パスの始点座標 */
  start: Vector3;

  /** パスの終点座標 */
  end: Vector3;
}>;

/** Three.js のモデル子要素 */
export type ModelChildren = Array<PerspectiveCamera | Mesh | PointLight | Object3D>;

/** Camera Types */
/** カメラのビューポートオフセット */
export type ViewOffset = {
  /** ビューポート全体の幅（px） */
  fullWidth: number;

  /** ビューポート全体の高さ（px） */
  fullHeight: number;

  /** オフセット始点の X 座標（px） */
  x: number;

  /** オフセット始点の Y 座標（px） */
  y: number;

  /** レンダリング領域の幅（px） */
  width: number;

  /** レンダリング領域の高さ（px） */
  height: number;
};

/** カメラの基本パラメータ */
export type CameraParams = {
  /** カメラの初期位置座標 */
  position: Position;

  /** カメラの初期回転角 */
  rotation: Rotation;

  /** カメラのビューポートオフセット設定 */
  viewOffset: ViewOffset;
};

/** カメラの開始・終了位置 */
export type CameraPositionState = {
  /** アニメーション開始時のカメラ位置 */
  startPosition: Vector3;

  /** アニメーション終了時のカメラ位置 */
  endPosition: Vector3;
};

/** カメラ位置を動的に設定する際のパラメータ */
export type CameraPositionSetter = {
  /** 位置を設定するカメラオブジェクト */
  camera: OrthographicCamera | PerspectiveCamera;

  /** シーン内の 3D モデルグループ */
  models: Group | null;

  /** ビューポートの横幅（px） */
  width: number;

  /** ビューポートの縦幅（px） */
  height: number;
};

/** Home World Specific Types */
/** Home Worldのカメラリグのブレークポイント別ポジション */
export type HomeWorldRigCameraPositions = Readonly<{
  /** XS ブレイクポイント用カメラパス */
  xs: VectorPath;

  /** SM ブレイクポイント用カメラパス群 */
  sm: {
    /** 縦持ち（portrait）時のカメラパス */
    wrap: VectorPath;

    /** 横持ち（landscape）時のカメラパス */
    side: VectorPath;
  };

  /** TB ブレイクポイント用カメラパス */
  tb: VectorPath;

  /** LG ブレイクポイント用カメラパス */
  lg: VectorPath;

  /** XL ブレイクポイント用カメラパス */
  xl: VectorPath;

  /** 2XL ブレイクポイント用カメラパス */
  xxl: VectorPath;
}>;

/** Home Worldの雲の状態 */
export type CloudState = {
  /** 薄雲の表示フラグ */
  thin: boolean;

  /** 厚雲の表示フラグ */
  thick: boolean;
};

/** 時間帯（朝昼晩） */
export type TimePoint = 'evening' | 'night' | 'lunch';

/** 時間帯ごとの空の色 */
export type TimePointSkyColor = {
  /** 厚曇り時の空の色 */
  thickCloud: string;

  /** 薄曇り時の空の色 */
  thinCloud: string;

  /** 忪b晴時の空の色 */
  clearSky: string;
};

/** 雷の発生状態 */
export type LightningState = {
  /** 雷の強度を計算する関数 */
  power: (value: number) => number;

  /** 雷の X 方向発生位置を計算する関数 */
  positionX: (value: number) => number;

  /** 雷の Z 方向発生位置を計算する関数 */
  positionZ: (value: number) => number;

  /** 雷エフェクトの表示フラグ */
  visible: boolean;
};

/** 雨の発生状態 */
export type RainState = {
  /** 雨粒の色（任意） */
  color?: string;

  /** 現在の天気データ（天気種別の判定に使用） */
  currentWeather: WeatherItem;

  /** 雨粒の線幅（任意） */
  lineWidth?: number;

  /** 雨粒の長さ（任意） */
  length?: number;

  /** 雨粒の X 方向移動速度（任意） */
  xSpeed?: number;

  /** 雨粒の Y 方向落下速度（任意） */
  ySpeed?: number;
};

/** RainStateResult の型定義 */
export type RainStateResult = {
  /** 雨粒の色 */
  color: string;

  /** 雨粒の線幅 */
  lineWidth: number;

  /** 雨粒の長さ */
  length: number;

  /** 雨粒の X 方向移動速度 */
  xSpeed: number;

  /** 雨粒の Y 方向落下速度 */
  ySpeed: number;
};

/** Home Worldの山のマテリアル */
export type HomeWorldMountainMaterials = {
  [key: string]: MeshStandardMaterial;
};

/** Work World Specific Types */
/**
 * Work World のセクション名とパラメータキーの型定義
 * @from /utils/world/work/getCameraParams.ts
 */
export type WorkWorldSectionMap = typeof WORK_WORLD_SECTION_MAP;
export type WorkWorldSectionKey = keyof WorkWorldSectionMap;

/** Work Worldのセクションごとのカメラパラメータ */
export type WorkWorldSectionsCameraParams = {
  /** Portal セクションのカメラパラメータ */
  portal: CameraParams;

  /** Introduction セクションのカメラパラメータ */
  introduction: CameraParams;

  /** Controls セクションのカメラパラメータ */
  controls: CameraParams;
};

/** Work Worldのビューワートグル時のカメラパラメータ */
export type WorkWorldViewerToggleCameraParams = {
  /** ビュワー切り替え後のカメラパラメータ */
  cameraParams: CameraParams;

  /** カメラのズーム倍率 */
  zoom: number;

  /** カメラのビューオフセット値 */
  offset: number;
};

/** Work Worldの操作対象ごとのカメラ設定 */
export type ControlCameraConfig = {
  /** コントロール項目の識別名 */
  name: string;

  /** カメラの目標位置座標 */
  position: Position;

  /** カメラの目標回転角 */
  rotation: Rotation;

  /** カメラのビューポートオフセット設定 */
  viewOffset: ViewOffset;
};

export type ControlCameraConfigs = ControlCameraConfig[];

/** Debug Types */
/** デバッグ用アンビエントライトのパラメータ */
export type DebugAmbientLightParams = {
  /** アンビエントライトの色 */
  color: string;

  /** アンビエントライトの強度 */
  intensity: number;
};

/** デバッグ用ディレクショナルライトのパラメータ */
export type DebugDirectionalLightParams = {
  /** ディレクショナルライトの色 */
  color: string;

  /** ディレクショナルライトの強度 */
  intensity: number;
};

/** デバッグ用カメラのパラメータ (typo修正: Prams -> Params) */
export type DebugCameraParams = {
  /** カメラの視野角（度） */
  fov: number;

  /** カメラのニアクリッピング距離 */
  near: number;

  /** カメラのファークリッピング距離 */
  far: number;

  /** カメラの初期位置座標 */
  position: Position;

  /** カメラの初期回転角 */
  rotation: Rotation;
};

/** ポイントライトを含むグループ */
export type PointLightGroup = Group & {
  children: PointLight[];
};
