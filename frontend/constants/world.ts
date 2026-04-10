import { MeshStandardMaterial, Vector3 } from 'three';
import { WeatherItem } from '@/types/api';
import {
  CameraParams,
  DebugAmbientLightParams,
  DebugDirectionalLightParams,
  DebugCameraParams,
  HomeWorldRigCameraPositions,
  WorkWorldSectionsCameraParams,
} from '@/types/world';
import { TimePoint } from '@/types/world';
import { HomeWorldMountainMaterials } from '@/types/world';
import { WORK_WORLD_ENV_COLORS } from '@/constants/colors';
import { BREAK_POINTS } from '@/constants/common';

/** Home World */
/** 天気のデフォルト値 */
export const DEFAULT_WEATHER: WeatherItem[] = [
  { id: 0, main: 'Clear', description: 'clear sky', icon: '' },
] as const;

export const WEATHER_TYPES: Array<string> = [
  'Thunderstorm',
  'Drizzle',
  'Rain',
  'Snow',
  'Clear',
  'Clouds',
  /** 7xx Atmosphere */
  'Mist',
  'Smoke',
  'Haze',
  'Dust',
  'Fog',
  'Sand',
  'Ash',
  'Squall',
  'Tornado',
];

/** Home Worldの山のマテリアルの粗さ */
export const MOUNTAIN_ROUGHNESS = 0.45;

/** Home World のリグカメラの位置 */
export const HOME_WORLD_RIG_CAMERA_POSITIONS: HomeWorldRigCameraPositions = {
  xs: {
    start: new Vector3(-3, 5.2, 31),
    end: new Vector3(-3.61, -0.22, 4.2),
  },
  sm: {
    wrap: {
      start: new Vector3(-3, 1.2, 22),
      end: new Vector3(-3.61, -2.89, 4.2),
    },
    side: {
      start: new Vector3(-3, 2.2, 22),
      end: new Vector3(-3.61, -0.9, 4.1),
    },
  },
  tb: {
    start: new Vector3(-2.7, 2.4, 20),
    end: new Vector3(-3.6, -1.04, 4.18),
  },
  lg: {
    start: new Vector3(-2.7, 3.0, 20),
    end: new Vector3(-3.61, -0.05, 4.12),
  },
  xl: {
    start: new Vector3(-2.5, 2.4, 19),
    end: new Vector3(-3.62, -0.25, 4.12),
  },
  xxl: {
    start: new Vector3(-2.5, 2.4, 19),
    end: new Vector3(-3.6, -0.52, 4.12),
  },
};

/** Home Worldの山のマテリアル */
export const HOME_WORLD_MOUNTAIN_MATERIALS: HomeWorldMountainMaterials = {
  treeMat_1: new MeshStandardMaterial({
    roughness: MOUNTAIN_ROUGHNESS,
    name: 'Tree_1',
  }),
  treeMat_2: new MeshStandardMaterial({
    roughness: MOUNTAIN_ROUGHNESS,
    name: 'Tree_2',
  }),
  leavesMat_1: new MeshStandardMaterial({
    roughness: MOUNTAIN_ROUGHNESS,
    name: 'Leaves_1',
  }),
  leavesMat_2: new MeshStandardMaterial({
    roughness: MOUNTAIN_ROUGHNESS,
    name: 'Leaves_2',
  }),
  leavesMat_3: new MeshStandardMaterial({
    roughness: MOUNTAIN_ROUGHNESS,
    name: 'Leaves_3',
  }),
  leavesMat_4: new MeshStandardMaterial({
    roughness: MOUNTAIN_ROUGHNESS,
    name: 'Leaves_4',
  }),
  leavesMat_5: new MeshStandardMaterial({
    roughness: MOUNTAIN_ROUGHNESS,
    name: 'Leaves_5',
  }),
  leavesMat_6: new MeshStandardMaterial({
    roughness: MOUNTAIN_ROUGHNESS,
    name: 'Leaves_6',
  }),
};

/** 天気の詳細：雷（弱） */
export const WEATHER_DESCRIPTIONS_THUNDERSTORM_LIGHT = [
  'thunderstorm with light rain',
  'light thunderstorm',
  'thunderstorm with light drizzle',
] as const;

/** 天気の詳細：雷（中） */
export const WEATHER_DESCRIPTIONS_THUNDERSTORM_NORMAL = [
  'thunderstorm with rain',
  'thunderstorm',
  'thunderstorm with drizzle',
] as const;

/** 天気の詳細：雷（強） */
export const WEATHER_DESCRIPTIONS_THUNDERSTORM_HEAVY = [
  'thunderstorm with heavy rain',
  'heavy thunderstorm',
  'thunderstorm with heavy drizzle',
  'ragged thunderstorm',
] as const;

/** 天気の詳細：雷（すべて） */
export const WEATHER_DESCRIPTIONS_THUNDERSTORM_ALL = [
  ...WEATHER_DESCRIPTIONS_THUNDERSTORM_LIGHT,
  ...WEATHER_DESCRIPTIONS_THUNDERSTORM_NORMAL,
  ...WEATHER_DESCRIPTIONS_THUNDERSTORM_HEAVY,
] as const;

/** 天気の詳細：霧雨（Drizzle 3xx 全9種） */
export const WEATHER_DESCRIPTIONS_DRIZZLE = [
  'light intensity drizzle',
  'drizzle',
  'heavy intensity drizzle',
  'light intensity drizzle rain',
  'drizzle rain',
  'heavy intensity drizzle rain',
  'shower rain and drizzle',
  'heavy shower rain and drizzle',
  'shower drizzle',
] as const;

/** 天気の詳細：雨（弱）- Drizzle を含む */
export const WEATHER_DESCRIPTIONS_RAIN_LIGHT = [
  'light rain',
  'light intensity shower rain',
  'thunderstorm with light rain',
  'freezing rain',
  ...WEATHER_DESCRIPTIONS_DRIZZLE,
] as const;

/** 天気の詳細：雨（通常） */
export const WEATHER_DESCRIPTIONS_RAIN_NORMAL = [
  'moderate rain',
  'shower rain',
  'ragged shower rain',
  'thunderstorm with rain',
] as const;

/** 天気の詳細：雨（激しい） */
export const WEATHER_DESCRIPTIONS_RAIN_HEAVY = [
  'heavy intensity rain',
  'heavy intensity shower rain',
  'thunderstorm with heavy rain',
] as const;

/** 天気の詳細：雨（非常に激しい） */
export const WEATHER_DESCRIPTIONS_RAIN_VERY_HEAVY = [
  'very heavy rain',
  'extreme rain',
] as const;

/** 天気の詳細：雨と霧 */
export const WEATHER_DESCRIPTIONS_RAIN_MIST = [
  'light rain',
  'moderate rain',
  'heavy intensity rain',
  'very heavy rain',
  'extreme rain',
  'freezing rain',
  'light intensity shower rain',
  'shower rain',
  'heavy intensity shower rain',
  'ragged shower rain',
  'overcast clouds',
  'mist',
] as const;

/**
 * 天気の詳細：大気現象（7xx Atmosphere）。
 * Snow (6xx) は未対応のため除外。
 * 対応済み: fog / smoke / haze / dust 系 / squalls / tornado。
 */
export const WEATHER_DESCRIPTIONS_ATMOSPHERE = [
  'fog',
  'smoke',
  'haze',
  'sand/dust whirls',
  'sand',
  'dust',
  'volcanic ash',
  'squalls',
  'tornado',
] as const;

/** 天気の詳細：厚い雲（雨、雷、霧、大気現象など） */
export const WEATHER_DESCRIPTIONS_THICK_CLOUDS = [
  ...WEATHER_DESCRIPTIONS_THUNDERSTORM_ALL,
  ...WEATHER_DESCRIPTIONS_RAIN_MIST,
  ...WEATHER_DESCRIPTIONS_ATMOSPHERE,
] as const;

/** 天気の詳細：薄い雲 */
export const WEATHER_DESCRIPTIONS_THIN_CLOUDS = [
  'few clouds',
  'scattered clouds',
  'broken clouds',
] as const;

/** 天気の詳細：快晴 */
export const WEATHER_DESCRIPTIONS_CLEAR_SKY = ['clear sky'] as const;

/** Home World デバッグ用：タイムポイントコントロール */
export const HOME_WORLD_DEBUG_TIME_POINT_CONTROL = {
  value: 'night' as TimePoint,
  options: ['lunch', 'evening', 'night'] as TimePoint[],
  label: '時間帯',
};

/** Home World デバッグ用：霧コントロール */
export const HOME_WORLD_DEBUG_FOG_CONTROLS = {
  near: { value: 4, min: 0, max: 10, label: '霧の最少距離' },
  far: { value: 100, min: 0, max: 200, label: '霧の最大距離' },
};

/** Home World デバッグ用：雲表示コントロール */
export const HOME_WORLD_DEBUG_CLOUD_CONTROLS = {
  thinCloudVisible: { value: true, label: '薄雲表示' },
  thickCloudVisible: { value: true, label: '厚雲表示' },
};

/** Home World デバッグ用：ライトヘルパーコントロール */
export const HOME_WORLD_DEBUG_LIGHT_HELPER_CONTROLS = {
  sunLightHelperVisible: { value: true, label: '太陽光ヘルパー表示' },
  lightningHelperVisible: { value: true, label: '雷光ヘルパー表示' },
};

/** Home World デバッグ用：ライトヘルパーサイズ */
export const HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE = 30;

/** Work World */
/** ブレークポイント名の定数 */
export const BREAK_POINT_KEYS = ['XS', 'SM', 'LG', 'XL', '2XL', '3XL'] as const;
export type BreakPointKey = (typeof BREAK_POINT_KEYS)[number];

/**
 * Work World のセクション名と対応するカメラパラメータのキーのマッピング
 * @from /utils/world/work/getCameraParams.ts
 */
export const WORK_WORLD_SECTION_MAP = {
  Sec1: 'portal',
  Sec2: 'introduction',
  Sec3: 'controls',
} as const;

/** ブレークポイント名と値のマッピング */
export const BREAK_POINT_MAP: Record<BreakPointKey, number> = {
  XS: BREAK_POINTS.XS,
  SM: BREAK_POINTS.SM,
  LG: BREAK_POINTS.LG,
  XL: BREAK_POINTS.XL,
  '2XL': BREAK_POINTS['2XL'],
  '3XL': Infinity,
} as const;

/** セクションカメラのブレークポイント設定 */
export const WORK_WORLD_SECTION_CAMERA_BREAKPOINTS = [
  { min: -Infinity, max: BREAK_POINTS.XS, prefix: /^Cam_BP_XS_(.+)_0(_.+)?$/ },
  { min: BREAK_POINTS.XS, max: BREAK_POINTS.SM, prefix: /^Cam_BP_SM_(.+)_0(_.+)?$/ },
  { min: BREAK_POINTS.SM, max: BREAK_POINTS.LG, prefix: /^Cam_BP_LG_(.+)_0(_.+)?$/ },
  { min: BREAK_POINTS.LG, max: BREAK_POINTS.XL, prefix: /^Cam_BP_XL_(.+)_0(_.+)?$/ },
  { min: BREAK_POINTS.XL, max: BREAK_POINTS['2XL'], prefix: /^Cam_BP_2XL_(.+)_0(_.+)?$/ },
  { min: BREAK_POINTS['2XL'], max: Infinity, prefix: /^Cam_BP_3XL_(.+)_0(_.+)?$/ },
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

/** デフォルトのセクションカメラパラメータ */
export const DEFAULT_SECTION_CAMERA_PARAMS: WorkWorldSectionsCameraParams = {
  portal: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    viewOffset: { fullWidth: 0, fullHeight: 0, x: 0, y: 0, width: 0, height: 0 },
  },
  introduction: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    viewOffset: { fullWidth: 0, fullHeight: 0, x: 0, y: 0, width: 0, height: 0 },
  },
  controls: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    viewOffset: { fullWidth: 0, fullHeight: 0, x: 0, y: 0, width: 0, height: 0 },
  },
} as const;

/** デフォルトのビュワーモード切り替えカメラパラメータ */
export const DEFAULT_VIEWER_TOGGLE_CAMERA_PARAMS: CameraParams = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  viewOffset: { fullWidth: 0, fullHeight: 0, x: 0, y: 0, width: 0, height: 0 },
} as const;

/** Controlsカメラ用デフォルトViewOffset */
export const DEFAULT_CONTROLS_VIEW_OFFSET = {
  fullWidth: 0,
  fullHeight: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
} as const;

/** Controlsカメラ用デフォルトパラメータ */
export const DEFAULT_CONTROLS_CAMERA_PARAMS: CameraParams = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  viewOffset: { fullWidth: 0, fullHeight: 0, x: 0, y: 0, width: 0, height: 0 },
} as const;
