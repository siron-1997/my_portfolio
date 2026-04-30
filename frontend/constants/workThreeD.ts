import { WORK_WORLD_ENV_COLORS } from '@/constants/colors';
import { BREAK_POINTS } from '@/constants/common';
import {
  type CameraParams,
  type DebugAmbientLightParams,
  type DebugCameraParams,
  type DebugDirectionalLightParams,
  type WorkWorldSectionsCameraParams,
} from '@/types/world';

/** ============================================
 *  セクション / カメラ
 * ============================================ */

/**
 * Work World のセクション名と対応するカメラパラメータキーのマッピング。
 *
 * @see /utils/world/work/getCameraParams.ts
 */
export const WORK_WORLD_SECTION_MAP = {
  Sec1: 'portal',
  Sec2: 'introduction',
  Sec3: 'controls',
} as const;

/** セクションカメラのブレークポイント設定 */
export const WORK_WORLD_SECTION_CAMERA_BREAKPOINTS = [
  { min: -Infinity, max: BREAK_POINTS.XS, prefix: /^Cam_BP_XS_(.+)_0(_.+)?$/ },
  {
    min: BREAK_POINTS.XS,
    max: BREAK_POINTS.SM,
    prefix: /^Cam_BP_SM_(.+)_0(_.+)?$/,
  },
  {
    min: BREAK_POINTS.SM,
    max: BREAK_POINTS.LG,
    prefix: /^Cam_BP_LG_(.+)_0(_.+)?$/,
  },
  {
    min: BREAK_POINTS.LG,
    max: BREAK_POINTS.XL,
    prefix: /^Cam_BP_XL_(.+)_0(_.+)?$/,
  },
  {
    min: BREAK_POINTS.XL,
    max: BREAK_POINTS['2XL'],
    prefix: /^Cam_BP_2XL_(.+)_0(_.+)?$/,
  },
  {
    min: BREAK_POINTS['2XL'],
    max: Infinity,
    prefix: /^Cam_BP_3XL_(.+)_0(_.+)?$/,
  },
] as const;

/** ビューワーモード切り替え用カメラのブレークポイント設定 */
export const WORK_WORLD_VIEWER_TOGGLE_CAMERA_BREAKPOINTS = [
  {
    min: -Infinity,
    max: BREAK_POINTS.XS,
    prefix: /^Cam_BP_XS(_Offset)?_Sec2_0$/,
    zoom: -18,
  },
  {
    min: BREAK_POINTS.XS,
    max: BREAK_POINTS.SM,
    prefix: /^Cam_BP_SM(_Offset)?_Sec2_0$/,
    zoom: -2.5,
  },
  {
    min: BREAK_POINTS.SM,
    max: BREAK_POINTS.LG,
    prefix: /^Cam_BP_LG(_Offset)?_Sec2_0$/,
    zoom: 1,
  },
  {
    min: BREAK_POINTS.LG,
    max: BREAK_POINTS.XL,
    prefix: /^Cam_BP_XL(_Offset)?_Sec2_0$/,
    zoom: 2,
  },
  {
    min: BREAK_POINTS.XL,
    max: BREAK_POINTS['2XL'],
    prefix: /^Cam_BP_2XL(_Offset)?_Sec2_0$/,
    zoom: 1.0,
  },
  {
    min: BREAK_POINTS['2XL'],
    max: Infinity,
    prefix: /^Cam_BP_3XL(_Offset)?_Sec2_0$/,
    zoom: 0.6,
  },
] as const;

/** カメラ名からブレークポイント名を抽出する正規表現 */
export const BP_REGEX = /^Cam_BP_(3XL|2XL|XL|LG|SM|XS)_(?:Offset_)?(.+)_Sec3$/;

/** ============================================
 *  デバッグ用パラメータ（Leva）
 * ============================================ */

/** デバッグ用環境光のパラメータ */
export const DEBUG_AMBIENT_LIGHT_PARAMS: DebugAmbientLightParams = {
  color: WORK_WORLD_ENV_COLORS.ambientLight,
  intensity: 0.6,
} as const;

/** デバッグ用平行光源のパラメータ */
export const DEBUG_DIRECTIONAL_LIGHT_PARAMS: DebugDirectionalLightParams = {
  color: WORK_WORLD_ENV_COLORS.directionalLight,
  intensity: 0.9,
} as const;

/** デバッグ用カメラのパラメータ */
export const DEBUG_CAMERA_PARAMS: DebugCameraParams = {
  fov: 26.9915,
  near: 0.1,
  far: 200,
  position: { x: 5.3, y: 9.8, z: 17.5 },
  rotation: { x: -0.55, y: 0.45, z: 0.25 },
} as const;

/** ============================================
 *  デフォルトカメラパラメータ
 * ============================================ */

/** デフォルトのセクションカメラパラメータ */
export const DEFAULT_SECTION_CAMERA_PARAMS: WorkWorldSectionsCameraParams = {
  portal: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    viewOffset: {
      fullWidth: 0,
      fullHeight: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  },
  introduction: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    viewOffset: {
      fullWidth: 0,
      fullHeight: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  },
  controls: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    viewOffset: {
      fullWidth: 0,
      fullHeight: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  },
} as const;

/** デフォルトのビュワーモード切り替えカメラパラメータ */
export const DEFAULT_VIEWER_TOGGLE_CAMERA_PARAMS: CameraParams = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  viewOffset: { fullWidth: 0, fullHeight: 0, x: 0, y: 0, width: 0, height: 0 },
} as const;

/** Controls カメラ用デフォルト ViewOffset */
export const DEFAULT_CONTROLS_VIEW_OFFSET = {
  fullWidth: 0,
  fullHeight: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
} as const;

/** Controls カメラ用デフォルトパラメータ */
export const DEFAULT_CONTROLS_CAMERA_PARAMS: CameraParams = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  viewOffset: { fullWidth: 0, fullHeight: 0, x: 0, y: 0, width: 0, height: 0 },
} as const;

/** ============================================
 *  FingerPress
 * ============================================ */

/**
 * 指アイコン画像のパス。
 * next/image の src に渡す public ディレクトリ相対パス。
 */
export const WORK_THREE_D_FINGER_PRESS_ICON_PATH =
  '/icons/finger_press_48x48.svg' as const;

/**
 * 指アイコン画像の代替テキスト。
 */
export const WORK_THREE_D_FINGER_PRESS_ICON_ALT = 'finger press' as const;

/**
 * 3Dビュワー開始を促すガイドテキスト。
 * FingerPress コンポーネント（非ビュワーアクティブ時）に表示する。
 */
export const WORK_THREE_D_FINGER_PRESS_TEXT =
  '「Start」をタップすると3Dビュワーモードが開始します。' as const;

/** ============================================
 *  ToggleButton
 * ============================================ */

/**
 * 3Dビュワーを開始するトグルボタンのラベル。
 */
export const WORK_THREE_D_TOGGLE_START_LABEL = 'Start' as const;

/**
 * 3Dビュワーを終了するトグルボタンのラベル。
 */
export const WORK_THREE_D_TOGGLE_END_LABEL = 'End' as const;

/** ============================================
 *  World - キューブマップ
 * ============================================ */

/** キューブマップのテクスチャファイル名 */
export const WORK_WORLD_CUBE_TEXTURE_FILES: string[] = [
  'px.webp',
  'nx.webp',
  'py.webp',
  'ny.webp',
  'pz.webp',
  'nz.webp',
];

/** キューブマップのテクスチャパス */
export const WORK_WORLD_CUBE_TEXTURE_PATH = '/images/maps/workWorld/' as const;

/** ============================================
 *  World - シーン
 * ============================================ */

/** シーンの環境マップ強度 */
export const WORK_WORLD_SCENE_ENV_INTENSITY = 0.5 as const;

/** ============================================
 *  World - ライト
 * ============================================ */

/** 環境光の強度 */
export const WORK_WORLD_AMBIENT_LIGHT_INTENSITY = 0.6 as const;

/** 平行光源の強度 */
export const WORK_WORLD_DIRECTIONAL_LIGHT_INTENSITY = 1.5 as const;

/** 平行光源の位置 [x, y, z] */
export const WORK_WORLD_DIRECTIONAL_LIGHT_POSITION: [number, number, number] = [
  -4, 15, -8,
];

/** シャドウマップの解像度（幅・高さ共通） */
export const WORK_WORLD_SHADOW_MAP_SIZE = 1024 as const;

/** シャドウカメラの遠クリップ */
export const WORK_WORLD_SHADOW_CAMERA_FAR = 30 as const;

/** シャドウバイアス */
export const WORK_WORLD_SHADOW_BIAS = -0.0005 as const;

/** ============================================
 *  World - 霧
 * ============================================ */

/** 霧の近距離設定（SM以上 / SM未満） */
export const WORK_WORLD_FOG_NEAR = { SM: 4, default: 3 } as const;

/** 霧の遠距離設定（SM以上 / SM未満） */
export const WORK_WORLD_FOG_FAR = { SM: 12, default: 11 } as const;

/** ============================================
 *  World - 被写界深度（DepthOfField）
 * ============================================ */

/** 被写界深度のパラメータ */
export const WORK_WORLD_DOF_PARAMS = {
  /** 空間でのフォーカス距離 (カメラから何ユニット先にピントを合わせるかを指定) */
  worldFocusDistance: 2,
  /** 空間でのフォーカス範囲 (フォーカス距離を中心に前後何ユニットをシャープに保つかを指定) */
  worldFocusRange: 5,
  /** ぼかしの強さ (0 = なし、8 = 強烈、2〜3 = 自然なシネマティック) */
  bokehScale: 2,
  height: 1080,
} as const;

/** ============================================
 *  World - モデル
 * ============================================ */

/** モデル取得 API のベースパス */
export const WORK_WORLD_MODEL_API_BASE_PATH = '/api/supabase/model/' as const;

/** Room モデルのパス */
export const WORK_WORLD_ROOM_MODEL_PATH =
  '/models/gltf/work_world_room.glb' as const;

/** 床面メッシュ名の判定正規表現 */
export const WORK_WORLD_FLOOR_PLANE_REGEX = /_Plane$/;

/** アニメーションクリップ名の部位名抽出正規表現 */
export const WORK_WORLD_ANIMATION_NAME_REGEX = /^AS_([^_]+)_[SE]_N/;

/** ============================================
 *  World - ナビゲーション
 * ============================================ */

/** セクションナビゲーションのオブジェクト名判定正規表現 */
export const WORK_WORLD_NAVIGATION_SECTION_REGEX = /^IS_Sec3_\d+_.+/;

/** ============================================
 *  World - OrbitControls
 * ============================================ */

/** OrbitControls のパラメータ */
export const WORK_WORLD_ORBIT_CONTROLS = {
  dampingFactor: 0.07,
  minAzimuthAngleDeg: -180,
  maxAzimuthAngleDeg: 180,
  maxPolarAngleDeg: 85,
} as const;

/** ============================================
 *  World - アニメーション
 * ============================================ */

/** 弧状補間の横バイアス強度（0=直線, 1=デフォルト） */
export const CAMERA_ARC_BIAS = 0.3 as const;

/** Controls → 元位置に戻るアニメーションの時間 (秒) */
export const REVERSE_COMPLETE_DURATION = 2 as const;

/** セクション ScrollTrigger スクラブ係数 */
export const SECTION_ANIMATION_SCRUB = 0.7 as const;

/** セクション補間アニメーションの時間 (秒) */
export const SECTION_ANIMATION_DURATION = 0.7 as const;

/** Controls カメラ移動アニメーションの時間 (秒) */
export const CONTROLS_ANIMATION_DURATION = 2 as const;

/** Controls カメラ位置アニメーションの遅延 (秒) */
export const CONTROLS_ANIMATION_DELAY = 0.5 as const;

/** ビュワーモード開始時のカメラアニメーション時間 (秒) */
export const VIEWER_TOGGLE_START_DURATION = 0.6 as const;

/** ビュワーモード終了時のカメラアニメーション時間 (秒) */
export const VIEWER_TOGGLE_END_DURATION = 1.2 as const;

/** ナビゲーション表示切り替えアニメーションの時間 (秒) */
export const NAVIGATION_ANIMATION_DURATION = 0.3 as const;
