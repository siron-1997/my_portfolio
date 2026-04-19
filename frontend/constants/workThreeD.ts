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
 *  ブレークポイント
 * ============================================ */

/** ブレークポイント名の定数 */
export const BREAK_POINT_KEYS = ['XS', 'SM', 'LG', 'XL', '2XL', '3XL'] as const;

/** ブレークポイント名の型 */
export type BreakPointKey = (typeof BREAK_POINT_KEYS)[number];

/** ブレークポイント名と値のマッピング */
export const BREAK_POINT_MAP: Record<BreakPointKey, number> = {
  XS: BREAK_POINTS.XS,
  SM: BREAK_POINTS.SM,
  LG: BREAK_POINTS.LG,
  XL: BREAK_POINTS.XL,
  '2XL': BREAK_POINTS['2XL'],
  '3XL': Infinity,
} as const;

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
