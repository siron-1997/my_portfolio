import { type Group,type Mesh, type Object3D, type PerspectiveCamera, type PointLight } from 'three';

import { type WORK_WORLD_SECTION_MAP } from '@/constants/workThreeD';

/** Common 3D Types */
/**
 * 3D 空間の位置座標。
 * Three.js の Vector3 を Plain Object で表現したもの。
 */
export type Position = {
  /** X 軸方向の座標値 */
  x: number;

  /** Y 軸方向の座標値 */
  y: number;

  /** Z 軸方向の座標値 */
  z: number;
};

/**
 * 3D 空間の回転。
 * 各軸の回転角をラジアン単位で保持する。
 */
export type Rotation = {
  /** X 軸回りの回転角（ラジアン） */
  x: number;

  /** Y 軸回りの回転角（ラジアン） */
  y: number;

  /** Z 軸回りの回転角（ラジアン） */
  z: number;
};

/**
 * Three.js のモデル子要素。
 * GLTF ロード後のシーングラフに含まれうるオブジェクト型の Union。
 */
export type ModelChildren = Array<
  PerspectiveCamera | Mesh | PointLight | Object3D
>;

/** Camera Types */
/**
 * カメラのビューポートオフセット。
 * Three.js の `Camera.setViewOffset` に渡すパラメータを Plain Object で保持する。
 */
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

/**
 * カメラの基本パラメータ。
 * シーン内の各セクションやブレークポイントごとのカメラ状態を保持する。
 */
export type CameraParams = {
  /** カメラの初期位置座標 */
  position: Position;

  /** カメラの初期回転角 */
  rotation: Rotation;

  /** カメラのビューポートオフセット設定 */
  viewOffset: ViewOffset;
};

/** Work World Specific Types */
/**
 * Work World のセクション名とカメラパラメータキーのマッピング型。
 *
 * @see /utils/world/work/getCameraParams.ts
 */
export type WorkWorldSectionMap = typeof WORK_WORLD_SECTION_MAP;

/** `WorkWorldSectionMap` のキー型。セクション名として使用する。 */
export type WorkWorldSectionKey = keyof WorkWorldSectionMap;

/**
 * Work World のセクションごとのカメラパラメータ。
 * `portal` / `introduction` / `controls` の各セクションに対応するカメラ状態を保持する。
 */
export type WorkWorldSectionsCameraParams = {
  /** Portal セクションのカメラパラメータ */
  portal: CameraParams;

  /** Introduction セクションのカメラパラメータ */
  introduction: CameraParams;

  /** Controls セクションのカメラパラメータ */
  controls: CameraParams;
};

/**
 * Work World のビューワーモード切り替え時のカメラパラメータ。
 * ビューワー表示・非表示の切り替えアニメーションに使用する。
 */
export type WorkWorldViewerToggleCameraParams = {
  /** ビュワー切り替え後のカメラパラメータ */
  cameraParams: CameraParams;

  /** カメラのズーム倍率 */
  zoom: number;

  /** カメラのビューオフセット値 */
  offset: number;
};

/**
 * Work World の操作対象ごとのカメラ設定。
 * Controls セクションで各コントロール項目選択時のカメラ位置・回転を定義する。
 */
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

/** `ControlCameraConfig` の配列型。Controls セクションのカメラ設定リスト。 */
export type ControlCameraConfigs = ControlCameraConfig[];

/** Debug Types */
/**
 * デバッグ用アンビエントライトのパラメータ。
 * 開発環境の Leva パネルで調整する環境光の色と強度を保持する。
 */
export type DebugAmbientLightParams = {
  /** アンビエントライトの色 */
  color: string;

  /** アンビエントライトの強度 */
  intensity: number;
};

/**
 * デバッグ用ディレクショナルライトのパラメータ。
 * 開発環境の Leva パネルで調整する平行光源の色と強度を保持する。
 */
export type DebugDirectionalLightParams = {
  /** ディレクショナルライトの色 */
  color: string;

  /** ディレクショナルライトの強度 */
  intensity: number;
};

/**
 * デバッグ用カメラのパラメータ。
 * 開発環境の Leva パネルで調整するカメラの視野角・クリップ距離・位置・回転を保持する。
 */
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

/**
 * ポイントライトを含むグループ。
 * Three.js の `Group` を拡張し、子要素が `PointLight` のみであることを保証する。
 */
export type PointLightGroup = Group & {
  children: PointLight[];
};
