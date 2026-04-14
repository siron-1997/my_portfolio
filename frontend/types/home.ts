import { type MeshStandardMaterial, type Vector3 } from 'three';

import type { WeatherItem } from '@/types/api';

/** ============================================
 *  カメラ
 * ============================================ */

/**
 * 3D 空間の始点と終点を持つベクトルパス。
 * カメラアニメーションの移動経路定義に使用する。
 */
export type VectorPath = Readonly<{
  /** パスの始点座標 */
  start: Vector3;

  /** パスの終点座標 */
  end: Vector3;
}>;

/**
 * Home World のカメラリグのブレークポイント別ポジション。
 * スクロールアニメーションで使用する始点・終点座標をブレークポイントごとに定義する。
 */
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

/** ============================================
 *  天気・環境
 * ============================================ */

/**
 * Home World の雲の表示状態。
 * 天気カテゴリに応じて薄雲・厚雲それぞれの表示を制御する。
 */
export type CloudState = {
  /** 薄雲の表示フラグ */
  thin: boolean;

  /** 厚雲の表示フラグ */
  thick: boolean;
};

/**
 * 時間帯ごとの空の色。
 * 天気カテゴリ（厚曇り・薄曇り・快晴）と時間帯の組み合わせで背景色を決定する。
 */
export type TimePointSkyColor = {
  /** 厚曇り時の空の色 */
  thickCloud: string;

  /** 薄曇り時の空の色 */
  thinCloud: string;

  /** 快晴時の空の色 */
  clearSky: string;
};

/** ============================================
 *  雷
 * ============================================ */

/**
 * 雷の発生状態。
 * 天気の description に基づいて初期化され、useFrame 内で発光強度と出現位置の計算に使用する。
 */
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

/** ============================================
 *  雨
 * ============================================ */

/**
 * 雨の描画パラメータ設定。
 * Rain コンポーネント内の `_getRainState` に渡す入力値。
 * 天気 description に応じた色・速度・長さの初期値を含む。
 */
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

/**
 * 雨の描画パラメータ結果。
 * `_getRainState` の戻り値。Canvas 描画ループで直接参照する。
 */
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

/** ============================================
 *  山モデル
 * ============================================ */

/**
 * Home World の山のマテリアルマップ。
 * マテリアル名をキーとして `MeshStandardMaterial` インスタンスを保持する。
 * @deprecated Blender 側への roughness ベイク対応後に削除予定。
 */
export type HomeWorldMountainMaterials = {
  [key: string]: MeshStandardMaterial;
};
