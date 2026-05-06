import { Vector3 } from 'three';

import { type TimePoint, type WeatherItem } from '@/types/api';
import { type HomeWorldRigCameraPositions } from '@/types/home';

/** ============================================
 *  テキスト
 * ============================================ */

/** Portal セクションのタイトル */
export const HOME_PORTAL_TITLE = 'Symphony';

/** Portal セクションの説明文 */
export const HOME_PORTAL_DESCRIPTION =
  '異なる要素が連携し、ひとつの体験として調和する。\n天候データ、3D空間、UI実装を組み合わせたインタラクティブな表現を制作しています。';

/** Works セクションのタイトル */
export const HOME_WORKS_TITLE = 'Works';

/** Works セクションの詳細ページへのリンクテキスト */
export const HOME_WORKS_LEARN_MORE = 'Learn More >';

/** ============================================
 *  アセットパス
 * ============================================ */

/** 地形モデルのファイルパス */
export const HOME_WORLD_TERRAIN_MODEL_PATH = '/models/gltf/Geo_Terrain.glb';

/** ドアモデルのファイルパス */
export const HOME_WORLD_DOOR_MODEL_PATH = '/models/gltf/Geo_Door.glb';

/** 川水面の法線マップテクスチャファイルパス */
export const HOME_WORLD_RIVER_NORMALS_TEXTURE =
  'images/textures/waternormals.jpg';

/** 川水面の法線マップテクスチャサイズ（px） */
export const HOME_WORLD_RIVER_TEXTURE_SIZE = 512;

/** 薄雲テクスチャのファイルパス */
export const HOME_WORLD_THIN_CLOUD_TEXTURE = '/images/textures/thin_cloud.png';

/** 厚雲テクスチャのファイルパス */
export const HOME_WORLD_THICK_CLOUD_TEXTURE =
  '/images/textures/thick_cloud.png';

/**
 * OpenWeatherMap が定義する天気コードのグループ体系。
 * description フィールドの値（英語小文字）と照合して天気の種別を判別する。
 *
 * | グループ     | コード帯 | 主な種別                     |
 * | ------------ | -------- | ---------------------------- |
 * | Thunderstorm | 2xx      | 雷雨（雨・霧雨を伴う）       |
 * | Drizzle      | 3xx      | 霧雨                         |
 * | Rain         | 5xx      | 雨（弱〜極端）               |
 * | Snow         | 6xx      | 雪（未対応）                 |
 * | Atmosphere   | 7xx      | 霧・煙・砂塵・竜巻など       |
 * | Clear        | 800      | 快晴                         |
 * | Clouds       | 80x      | 曇り（雲量に応じた4段階）    |
 *
 * @see https://openweathermap.org/weather-conditions
 */

/** ============================================
 *  天気データデフォルト値
 * ============================================ */

/** ============================================
 *  環境光モデル種別
 * ============================================ */

/** 環境光モデル種別：山・ドアなどのシーンモデル */
export const ENV_MAP_MODEL_TYPE_MODEL = 'model' as const;

/** 環境光モデル種別：雲メッシュ */
export const ENV_MAP_MODEL_TYPE_CLOUD = 'cloud' as const;

/** ============================================
 *  天気カテゴリ
 * ============================================ */

/** 天気カテゴリ：厚い雲（雨・霧・雷など視程に影響する天気全般） */
export const WEATHER_CATEGORY_THICK_CLOUD = 'thickCloud' as const;

/** 天気カテゴリ：薄い雲（少量〜中量の雲） */
export const WEATHER_CATEGORY_THIN_CLOUD = 'thinCloud' as const;

/** 天気カテゴリ：快晴 */
export const WEATHER_CATEGORY_CLEAR_SKY = 'clearSky' as const;

/** 天気のデフォルト値 */
export const DEFAULT_WEATHER: WeatherItem[] = [
  { id: 0, main: 'Clear', description: 'clear sky', icon: '' },
] as const;

/** 天気の種別リスト */
export const WEATHER_TYPES: Array<string> = [
  /** 雷雨 (2xx) */
  'Thunderstorm',
  /** 霧雨 (3xx) */
  'Drizzle',
  /** 雨 (5xx) */
  'Rain',
  /** 雪 (6xx) */
  'Snow',
  /** 快晴 (800) */
  'Clear',
  /** 曇り (80x) */
  'Clouds',

  /** 大気現象グループ (7xx Atmosphere)：霧・煙・砂塵・竜巻など視程障害を引き起こす現象 */

  /** 薄霧（視程 > 1km） */
  'Mist',
  /** 煙霧 */
  'Smoke',
  /** もや（乾燥した視程障害） */
  'Haze',
  /** 砂塵 */
  'Dust',
  /** 濃霧（視程 ≤ 1km） */
  'Fog',
  /** 砂嵐 */
  'Sand',
  /** 火山灰 */
  'Ash',
  /** スコール */
  'Squall',
  /** 竜巻 */
  'Tornado',
];

/** ============================================
 *  天気の詳細説明グループ
 * ============================================ */

/** 天気の詳細：雷（弱） */
export const WEATHER_DESCRIPTIONS_THUNDERSTORM_LIGHT = [
  /** 弱い雨を伴う雷雨 (200) */
  'thunderstorm with light rain',
  /** 弱い雷雨 (210) */
  'light thunderstorm',
  /** 弱い霧雨を伴う雷雨 (230) */
  'thunderstorm with light drizzle',
] as const;

/** 天気の詳細：雷（中） */
export const WEATHER_DESCRIPTIONS_THUNDERSTORM_NORMAL = [
  /** 雨を伴う雷雨 (201) */
  'thunderstorm with rain',
  /** 雷雨 (211) */
  'thunderstorm',
  /** 霧雨を伴う雷雨 (231) */
  'thunderstorm with drizzle',
] as const;

/** 天気の詳細：雷（強） */
export const WEATHER_DESCRIPTIONS_THUNDERSTORM_HEAVY = [
  /** 強い雨を伴う雷雨 (202) */
  'thunderstorm with heavy rain',
  /** 強い雷雨 (212) */
  'heavy thunderstorm',
  /** 強い霧雨を伴う雷雨 (232) */
  'thunderstorm with heavy drizzle',
  /** 断続的な雷雨 (221) */
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
  /** 弱い霧雨 (300) */
  'light intensity drizzle',
  /** 霧雨 (301) */
  'drizzle',
  /** 強い霧雨 (302) */
  'heavy intensity drizzle',
  /** 弱い霧雨交じりの雨 (310) */
  'light intensity drizzle rain',
  /** 霧雨交じりの雨 (311) */
  'drizzle rain',
  /** 強い霧雨交じりの雨 (312) */
  'heavy intensity drizzle rain',
  /** にわか雨と霧雨 (313) */
  'shower rain and drizzle',
  /** 強いにわか雨と霧雨 (314) */
  'heavy shower rain and drizzle',
  /** にわか霧雨 (321) */
  'shower drizzle',
] as const;

/** 雷雨・霧雨を除いた弱雨コード（RAIN_LIGHT / RAIN_MIST の共有用） */
const RAIN_LIGHT_PURE = [
  /** 弱い雨 (500) */
  'light rain',
  /** 弱いにわか雨 (520) */
  'light intensity shower rain',
  /** 凍雨 (511) */
  'freezing rain',
] as const;

/** 雷雨を除いた通常雨コード（RAIN_NORMAL / RAIN_MIST の共有用） */
const RAIN_NORMAL_PURE = [
  /** 並みの雨 (501) */
  'moderate rain',
  /** にわか雨 (521) */
  'shower rain',
  /** 断続的なにわか雨 (531) */
  'ragged shower rain',
] as const;

/** 雷雨を除いた激しい雨コード（RAIN_HEAVY / RAIN_MIST の共有用） */
const RAIN_HEAVY_PURE = [
  /** 強い雨 (502) */
  'heavy intensity rain',
  /** 強いにわか雨 (522) */
  'heavy intensity shower rain',
] as const;

/** 天気の詳細：雨（弱）- Drizzle を含む */
export const WEATHER_DESCRIPTIONS_RAIN_LIGHT = [
  ...RAIN_LIGHT_PURE,
  /** 弱い雨を伴う雷雨 (200) */
  'thunderstorm with light rain',
  ...WEATHER_DESCRIPTIONS_DRIZZLE,
] as const;

/** 天気の詳細：雨（通常） */
export const WEATHER_DESCRIPTIONS_RAIN_NORMAL = [
  ...RAIN_NORMAL_PURE,
  /** 雨を伴う雷雨 (201) */
  'thunderstorm with rain',
] as const;

/** 天気の詳細：雨（激しい） */
export const WEATHER_DESCRIPTIONS_RAIN_HEAVY = [
  ...RAIN_HEAVY_PURE,
  /** 強い雨を伴う雷雨 (202) */
  'thunderstorm with heavy rain',
] as const;

/** 天気の詳細：雨（非常に激しい） */
export const WEATHER_DESCRIPTIONS_RAIN_VERY_HEAVY = [
  /** 非常に強い雨 (503) */
  'very heavy rain',
  /** 極端な雨 (504) */
  'extreme rain',
] as const;

/** 天気の詳細：雨と霧 */
export const WEATHER_DESCRIPTIONS_RAIN_MIST = [
  ...RAIN_LIGHT_PURE,
  ...RAIN_NORMAL_PURE,
  ...RAIN_HEAVY_PURE,
  ...WEATHER_DESCRIPTIONS_RAIN_VERY_HEAVY,
  /** 厚い曇り（雲量 85-100%）(804) */
  'overcast clouds',
  /** 薄霧（視程 > 1km）(701) */
  'mist',
] as const;

/**
 * 天気の詳細：大気現象（7xx Atmosphere）。
 * Snow (6xx) は未対応のため除外。
 * 対応済み: fog / smoke / haze / dust 系 / squalls / tornado。
 */
export const WEATHER_DESCRIPTIONS_ATMOSPHERE = [
  /** 濃霧（視程 ≤ 1km）(741) */
  'fog',
  /** 煙霧 (711) */
  'smoke',
  /** もや（乾燥した視程障害）(721) */
  'haze',
  /** 砂塵旋風 (731) */
  'sand/dust whirls',
  /** 砂嵐 (751) */
  'sand',
  /** 砂塵 (761) */
  'dust',
  /** 火山灰 (762) */
  'volcanic ash',
  /** スコール (771) */
  'squalls',
  /** 竜巻 (781) */
  'tornado',
] as const;

/** 天気の詳細：厚い雲（霧雨、雨、雷、霧、大気現象など） */
export const WEATHER_DESCRIPTIONS_THICK_CLOUDS = [
  ...WEATHER_DESCRIPTIONS_THUNDERSTORM_ALL,
  ...WEATHER_DESCRIPTIONS_DRIZZLE,
  ...WEATHER_DESCRIPTIONS_RAIN_MIST,
  ...WEATHER_DESCRIPTIONS_ATMOSPHERE,
] as const;

/** 天気の詳細：薄い雲 */
export const WEATHER_DESCRIPTIONS_THIN_CLOUDS = [
  /** 少ない雲（晴れ間あり、雲量 11-25%）(801) */
  'few clouds',
  /** まばらな雲（雲量 25-50%）(802) */
  'scattered clouds',
  /** 多い雲（雲量 51-84%）(803) */
  'broken clouds',
] as const;

/** 天気の詳細：快晴 */
export const WEATHER_DESCRIPTIONS_CLEAR_SKY = [
  /** 快晴 (800) */
  'clear sky',
] as const;

/** ============================================
 *  カメラ
 * ============================================ */

/** カメラリグの共通開始点（全ブレークポイントで共通） */
export const HOME_WORLD_RIG_CAMERA_START = new Vector3(0, 45, 125);

/** Home World のリグカメラの位置 */
export const HOME_WORLD_RIG_CAMERA_POSITIONS: HomeWorldRigCameraPositions = {
  xs: { endY: 0.8, mid: new Vector3(0, 0.8, 2) },
  sm: {
    /** 縦持ちを想定 */
    wrap: { endY: -2, mid: new Vector3(0, -2, 2) },
    /** 横向きを想定 */
    side: { endY: 0, mid: new Vector3(0, 0, 2) },
  },
  tb: { endY: -0.1, mid: new Vector3(0, -0.1, 2) },
  lg: { endY: 0.8, mid: new Vector3(0, 1.0, 2) },
  xl: { endY: 0.6, mid: new Vector3(0, 0.8, 2) },
  xxl: { endY: 0.6, mid: new Vector3(0, 0.6, 2) },
};

/** ============================================
 *  レンダリングパラメータ
 * ============================================ */

/** 影のテクスチャサイズ */
export const HOME_WORLD_SHADOW_MAP_SIZE = 2048;

/** 影のカメラ範囲（正方形の半サイズ） */
export const HOME_WORLD_SHADOW_CAMERA_HALF_SIZE = 500;

/** シャドウカメラのニアクリップ距離 */
export const HOME_WORLD_SHADOW_CAMERA_NEAR = 1;

/** シャドウカメラのファークリップ距離 */
export const HOME_WORLD_SHADOW_CAMERA_FAR = 1000;

/** シャドウのぼかし半径 */
export const HOME_WORLD_SHADOW_RADIUS = 1;

/** シャドウのノーマルバイアス */
export const HOME_WORLD_SHADOW_NORMAL_BIAS = 2.05;

/** シャドウのバイアス */
export const HOME_WORLD_SHADOW_BIAS = 0.0025;

/** 太陽光の位置 */
export const HOME_WORLD_SUN_LIGHT_POSITION = [50, 50, 50] as const;

/** ============================================
 *  太陽光輝度パラメータ
 * ============================================ */

/** 太陽光輝度ベース：厚雲 */
export const HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_THICK_CLOUD = 2.2;

/** 太陽光輝度ベース：所々雲の切れ間（broken clouds） */
export const HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_BROKEN_CLOUDS = 2.6;

/** 太陽光輝度ベース：所々曇り（scattered clouds） */
export const HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_SCATTERED_CLOUDS = 3.0;

/** 太陽光輝度ベース：少し曇り（few clouds） */
export const HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_FEW_CLOUDS = 3.4;

/** 太陽光輝度ベース：快晴（clear sky） */
export const HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_CLEAR_SKY = 3.6;

/** 太陽光輝度オフセット：夜（夜の方が明るく補正） */
export const HOME_WORLD_SUN_LIGHT_INTENSITY_OFFSET_NIGHT = 0.6;

/** 太陽光輝度オフセット：昼（昼は暗く補正） */
export const HOME_WORLD_SUN_LIGHT_INTENSITY_OFFSET_LUNCH = 0.8;

/** ============================================
 *  雷ライトパラメータ
 * ============================================ */

/** 雷ポイントライトの輝度 */
export const HOME_WORLD_LIGHTNING_LIGHT_INTENSITY = 8000000;

/** 雷ポイントライトの有効距離 */
export const HOME_WORLD_LIGHTNING_LIGHT_DISTANCE = 800;

/** 雷ポイントライトの減衰係数 */
export const HOME_WORLD_LIGHTNING_LIGHT_DECAY = 2;

/** 雷ポイントライトのデフォルト位置 */
export const HOME_WORLD_LIGHTNING_LIGHT_DEFAULT_POSITION = [
  -20, 70, -10,
] as const;

/** 雷落下位置の X 軸分散範囲（positionX 関数の引数 v） */
export const HOME_WORLD_LIGHTNING_POSITION_X_RANGE = 350;

/** 雷落下位置の Z 軸分散範囲（positionZ 関数の引数 v） */
export const HOME_WORLD_LIGHTNING_POSITION_Z_RANGE = 25;

/** 雷落下位置の Y 座標 */
export const HOME_WORLD_LIGHTNING_POSITION_Y = 75;

/** 雷の power（輝度）計算に使う係数（`occurrenceProbability.power(v)` の引数 v） */
export const HOME_WORLD_LIGHTNING_POWER_SCALE = 800;

/**
 * 雷雨（弱）の発光輝度上限。
 * NORMAL/HEAVY より低い輝度に抑え、弱い雷としての視覚差を維持する。
 * LIGHTNING_POSITION_UPDATE_THRESHOLD と同値にすることで、
 * LIGHT の発光後に即座に次の落雷位置が更新されることを保証する。
 */
export const HOME_WORLD_LIGHTNING_LIGHT_POWER_CAP = 500000;

/** 厚雲の最大不透明度を約 91% に抑えるための除数（iOS 以外で使用） */
export const HOME_WORLD_THICK_CLOUD_OPACITY_DIVISOR = 110;

/** 薄雲の不透明度計算の除数（雲量 / 100） */
export const HOME_WORLD_THIN_CLOUD_OPACITY_DIVISOR = 100;

/** ============================================
 *  霧パラメータ
 * ============================================ */

/** 霧の開始距離 */
export const HOME_WORLD_FOG_NEAR = 4;

/** 霧の終端距離ベース値。湿度を減算して実効値を算出する */
export const HOME_WORLD_FOG_FAR_BASE = 1500;

/** ============================================
 *  雲レイアウト
 * ============================================ */

/** 薄雲のデスクトップ設定 */
export const HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP = {
  scale: 1,
  position: [0, 165, -40] as [number, number, number],
  rotationDeg: [75, 0, 0] as [number, number, number],
} as const;

/** 厚雲のデスクトップ設定 */
export const HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP = {
  scale: 1.3,
  position: [0, 200, -10] as [number, number, number],
  rotationDeg: [75, 0, -90] as [number, number, number],
} as const;

/** 薄雲メッシュの幅 */
export const HOME_WORLD_THIN_CLOUD_GEOMETRY_WIDTH = 835;

/** 薄雲メッシュの高さ */
export const HOME_WORLD_THIN_CLOUD_GEOMETRY_HEIGHT = 1400;

/** 厚雲メッシュの一辺のサイズ */
export const HOME_WORLD_THICK_CLOUD_GEOMETRY_SIZE = 1400;

/** ============================================
 *  星のデフォルト値
 * ============================================ */

/** 星のデフォルト数 */
export const HOME_WORLD_DEFAULT_STAR_COUNT = 3500;

/** 星のデフォルト生成範囲 X（全幅） */
export const HOME_WORLD_DEFAULT_SPREAD_X = 950;

/** 星のデフォルト生成範囲 Y（全高） */
export const HOME_WORLD_DEFAULT_SPREAD_Y = 700;

/** 星のデフォルト生成範囲 Z 最小値 */
export const HOME_WORLD_DEFAULT_Z_MIN = -370;

/** 星のデフォルト生成範囲 Z 最大値 */
export const HOME_WORLD_DEFAULT_Z_MAX = -500;

/** 星のデフォルト透明度 */
export const HOME_WORLD_DEFAULT_STAR_OPACITY = 0.8;

/** 星のデフォルトサイズ */
export const HOME_WORLD_DEFAULT_STAR_SIZE = 1.5;

/** ============================================
 *  雷パラメータ
 * ============================================ */

/**
 * 雷発光のデフォルト発生確率しきい値。
 * Math.random() の値がこの値を超えたフレームに発光する。
 * 1 から引いた値が発光確率になる（0.93 → 7% ＝ 約 60fps で 4〜5 秒に 1 回）。
 */
export const HOME_WORLD_LIGHTNING_DEFAULT_THRESHOLD = 0.93;

/**
 * 発光が「大きな落雷」とみなす輝度のボーダー値。
 * この値を超えたフレームでは発光演出を毎フレーム継続し、自然な収束を表現する。
 * POWER_SCALE × 1000 に合わせて調整する（800 × 1000 = 800000）。
 */
export const HOME_WORLD_LIGHTNING_POWER_CONTINUATION_THRESHOLD = 800000;

/**
 * 落雷位置を更新する輝度のボーダー値。
 * 発光輝度がこの値を下回るフレームで次の落雷位置をランダムに更新する。
 * LIGHT の上限（LIGHTNING_LIGHT_POWER_CAP）と同値にすることで、
 * LIGHT 発光後に即座に次の位置更新が走ることを保証する。
 */
export const HOME_WORLD_LIGHTNING_POSITION_UPDATE_THRESHOLD = 500000;

/** ============================================
 *  デバッグコントロール（Leva）
 * ============================================ */

/** Home World デバッグ用：タイムポイントコントロール */
export const HOME_WORLD_DEBUG_TIME_POINT_CONTROL = {
  value: 'night' as TimePoint,
  options: ['lunch', 'evening', 'night'] as TimePoint[],
  label: '時間帯',
};

/**
 * Home World デバッグ用：天気説明の日本語ラベルマッピング。
 * キーが OpenWeatherMap の description 文字列（英語）、値が Leva に表示する日本語ラベル。
 */
export const HOME_WORLD_DEBUG_WEATHER_DESCRIPTION_LABELS: Record<
  string,
  string
> = {
  'clear sky': '快晴',
  'few clouds': '少ない雲（晴れ間あり）',
  'scattered clouds': 'まばらな雲',
  'broken clouds': '多い雲',
  'overcast clouds': '厚い曇り',
  mist: '薄霧',
  fog: '濃霧',
  'light intensity drizzle': '弱い霧雨',
  'light rain': '弱い雨',
  'moderate rain': '並みの雨',
  'heavy intensity rain': '強い雨',
  'very heavy rain': '非常に強い雨',
  'light thunderstorm': '弱い雷雨',
  thunderstorm: '雷雨',
  'heavy thunderstorm': '強い雷雨',
};

/**
 * Home World デバッグ用：天気説明ごとの { API main フィールド, 代表的な雲量, 代表的な湿度, 代表的な降雨量 } マッピング。
 * Experience でデバッグ用 currentWeatherData を合成する際に使用する。
 * rain1h が undefined の場合は rain フィールドを省略（雨なし）として扱う。
 */
export const HOME_WORLD_DEBUG_WEATHER_CONFIGS: Record<
  string,
  { main: string; cloudsAll: number; humidity: number; rain1h?: number }
> = {
  'clear sky': { main: 'Clear', cloudsAll: 0, humidity: 30 },
  'few clouds': { main: 'Clouds', cloudsAll: 18, humidity: 40 },
  'scattered clouds': { main: 'Clouds', cloudsAll: 37, humidity: 50 },
  'broken clouds': { main: 'Clouds', cloudsAll: 67, humidity: 60 },
  'overcast clouds': { main: 'Clouds', cloudsAll: 100, humidity: 70 },
  mist: { main: 'Mist', cloudsAll: 90, humidity: 92 },
  fog: { main: 'Fog', cloudsAll: 100, humidity: 96 },
  'light intensity drizzle': {
    main: 'Drizzle',
    cloudsAll: 80,
    humidity: 85,
    rain1h: 0.3,
  },
  'light rain': { main: 'Rain', cloudsAll: 75, humidity: 80, rain1h: 1.0 },
  'moderate rain': { main: 'Rain', cloudsAll: 85, humidity: 85, rain1h: 3.5 },
  'heavy intensity rain': {
    main: 'Rain',
    cloudsAll: 95,
    humidity: 90,
    rain1h: 8.0,
  },
  'very heavy rain': {
    main: 'Rain',
    cloudsAll: 100,
    humidity: 95,
    rain1h: 15.0,
  },
  'light thunderstorm': {
    main: 'Thunderstorm',
    cloudsAll: 90,
    humidity: 85,
    rain1h: 2.0,
  },
  thunderstorm: {
    main: 'Thunderstorm',
    cloudsAll: 95,
    humidity: 90,
    rain1h: 6.0,
  },
  'heavy thunderstorm': {
    main: 'Thunderstorm',
    cloudsAll: 100,
    humidity: 95,
    rain1h: 12.0,
  },
};

/** Home World デバッグ用：霧コントロール */
export const HOME_WORLD_DEBUG_FOG_CONTROLS = {
  near: { value: 4, min: 0, max: 1000, step: 0.1, label: '霧の最少距離' },
  far: { value: 100, min: 0, max: 2000, step: 0.1, label: '霧の最大距離' },
};

/** Home World デバッグ用：霧の色コントロール */
export const HOME_WORLD_DEBUG_FOG_COLOR_CONTROL = {
  label: '霧の色',
};

/** Home World デバッグ用：雲表示コントロール */
export const HOME_WORLD_DEBUG_CLOUD_CONTROLS = {
  thinCloudVisible: { value: true, label: '薄雲表示' },
  thinCloudOpacity: {
    value: 1,
    min: 0,
    max: 1,
    step: 0.01,
    label: '薄雲透明度',
  },
  thickCloudVisible: { value: true, label: '厚雲表示' },
  thickCloudOpacity: {
    value: 0.91,
    min: 0,
    max: 1,
    step: 0.01,
    label: '厚雲透明度',
  },
  thinCloudPosX: {
    value: HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP.position[0],
    min: -200,
    max: 200,
    step: 0.1,
    label: '薄雲 X',
  },
  thinCloudPosY: {
    value: HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP.position[1],
    min: -200,
    max: 200,
    step: 0.1,
    label: '薄雲 Y',
  },
  thinCloudPosZ: {
    value: HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP.position[2],
    min: -200,
    max: 200,
    step: 0.1,
    label: '薄雲 Z',
  },
  thinCloudRotX: {
    value: HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP.rotationDeg[0],
    min: -360,
    max: 360,
    step: 1,
    label: '薄雲 RotX°',
  },
  thinCloudRotY: {
    value: HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP.rotationDeg[1],
    min: -360,
    max: 360,
    step: 1,
    label: '薄雲 RotY°',
  },
  thinCloudRotZ: {
    value: HOME_WORLD_THIN_CLOUD_CONFIG_DESKTOP.rotationDeg[2],
    min: -360,
    max: 360,
    step: 1,
    label: '薄雲 RotZ°',
  },
  thickCloudPosX: {
    value: HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP.position[0],
    min: -200,
    max: 200,
    step: 0.1,
    label: '厚雲 X',
  },
  thickCloudPosY: {
    value: HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP.position[1],
    min: -200,
    max: 200,
    step: 0.1,
    label: '厚雲 Y',
  },
  thickCloudPosZ: {
    value: HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP.position[2],
    min: -200,
    max: 200,
    step: 0.1,
    label: '厚雲 Z',
  },
  thickCloudRotX: {
    value: HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP.rotationDeg[0],
    min: -360,
    max: 360,
    step: 1,
    label: '厚雲 RotX°',
  },
  thickCloudRotY: {
    value: HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP.rotationDeg[1],
    min: -360,
    max: 360,
    step: 1,
    label: '厚雲 RotY°',
  },
  thickCloudRotZ: {
    value: HOME_WORLD_THICK_CLOUD_CONFIG_DESKTOP.rotationDeg[2],
    min: -360,
    max: 360,
    step: 1,
    label: '厚雲 RotZ°',
  },
  thinCloudWidth: {
    value: HOME_WORLD_THIN_CLOUD_GEOMETRY_WIDTH,
    min: 1,
    max: 1400,
    step: 1,
    label: '薄雲 幅',
  },
  thinCloudHeight: {
    value: HOME_WORLD_THIN_CLOUD_GEOMETRY_HEIGHT,
    min: 1,
    max: 1400,
    step: 1,
    label: '薄雲 高さ',
  },
  thickCloudWidth: {
    value: HOME_WORLD_THICK_CLOUD_GEOMETRY_SIZE,
    min: 1,
    max: 1500,
    step: 1,
    label: '厚雲 幅',
  },
  thickCloudHeight: {
    value: HOME_WORLD_THICK_CLOUD_GEOMETRY_SIZE,
    min: 1,
    max: 1500,
    step: 1,
    label: '厚雲 高さ',
  },
  thinCloudRepeatX: {
    value: 1,
    min: 0.01,
    max: 20,
    step: 0.01,
    label: '薄雲 RepeatX',
  },
  thinCloudRepeatY: {
    value: 2,
    min: 0.01,
    max: 20,
    step: 0.01,
    label: '薄雲 RepeatY',
  },
  thickCloudRepeatX: {
    value: 7,
    min: 0.01,
    max: 50,
    step: 0.01,
    label: '厚雲 RepeatX',
  },
  thickCloudRepeatY: {
    value: 7,
    min: 0.01,
    max: 50,
    step: 0.01,
    label: '厚雲 RepeatY',
  },
};

/** Home World デバッグ用：ライトヘルパーコントロール */
export const HOME_WORLD_DEBUG_LIGHT_HELPER_CONTROLS = {
  sunLightHelperVisible: { value: true, label: '太陽光ヘルパー表示' },
  lightningHelperVisible: { value: true, label: '雷光ヘルパー表示' },
};

/** Home World デバッグ用：ライトヘルパーサイズ */
export const HOME_WORLD_DEBUG_LIGHT_HELPER_SIZE = 30;

/** Home World デバッグ用：星コントロール */
export const HOME_WORLD_DEBUG_STAR_CONTROLS = {
  visible: { value: true, label: '星表示' },
  color: { label: '星の色' },
  opacity: { value: 0.5, min: 0, max: 1, step: 0.01, label: '透明度' },
  size: { value: 0.35, min: 0, max: 2, step: 0.01, label: 'サイズ' },
  count: {
    value: HOME_WORLD_DEFAULT_STAR_COUNT,
    min: 100,
    max: 30000,
    step: 100,
    label: '星の数',
  },
  spreadX: {
    value: HOME_WORLD_DEFAULT_SPREAD_X,
    min: 0,
    max: 2000,
    step: 10,
    label: '生成範囲 X（全幅）',
  },
  spreadY: {
    value: HOME_WORLD_DEFAULT_SPREAD_Y,
    min: 0,
    max: 2000,
    step: 10,
    label: '生成範囲 Y（全高）',
  },
  zMin: {
    value: HOME_WORLD_DEFAULT_Z_MIN,
    min: -500,
    max: 0,
    step: 1,
    label: '生成範囲 Z 最小',
  },
  zMax: {
    value: HOME_WORLD_DEFAULT_Z_MAX,
    min: -500,
    max: 0,
    step: 1,
    label: '生成範囲 Z 最大',
  },
};

/** ============================================
 *  雷雨タイプ
 * ============================================ */

/** なし（雷なし） */
export const THUNDERSTORM_TYPE_NONE = 'none' as const;

/** 軽い雷雨 */
export const THUNDERSTORM_TYPE_LIGHT = 'light' as const;

/** 普通の雷雨 */
export const THUNDERSTORM_TYPE_NORMAL = 'normal' as const;

/** 激しい雷雨 */
export const THUNDERSTORM_TYPE_HEAVY = 'heavy' as const;

/** Home World デバッグ用：太陽光コントロール */
export const HOME_WORLD_DEBUG_SUN_LIGHT_CONTROLS = {
  color: { label: '太陽光の色' },
  intensity: { value: 3.0, min: 0, max: 10, step: 0.01, label: '輝度' },
  shadowCameraLeft: {
    value: -HOME_WORLD_SHADOW_CAMERA_HALF_SIZE,
    min: -500,
    max: 0,
    step: 1,
    label: 'Shadow Left',
  },
  shadowCameraRight: {
    value: HOME_WORLD_SHADOW_CAMERA_HALF_SIZE,
    min: 0,
    max: 500,
    step: 1,
    label: 'Shadow Right',
  },
  shadowCameraTop: {
    value: HOME_WORLD_SHADOW_CAMERA_HALF_SIZE,
    min: 0,
    max: 500,
    step: 1,
    label: 'Shadow Top',
  },
  shadowCameraBottom: {
    value: -HOME_WORLD_SHADOW_CAMERA_HALF_SIZE,
    min: -500,
    max: 0,
    step: 1,
    label: 'Shadow Bottom',
  },
  shadowCameraFar: {
    value: HOME_WORLD_SHADOW_CAMERA_FAR,
    min: 1,
    max: 1000,
    step: 1,
    label: 'Shadow Far',
  },
  shadowNormalBias: {
    value: HOME_WORLD_SHADOW_NORMAL_BIAS,
    min: 0,
    max: 5,
    step: 0.001,
    label: 'Normal Bias',
  },
  shadowBias: {
    value: HOME_WORLD_SHADOW_BIAS,
    min: -0.05,
    max: 0.05,
    step: 0.0001,
    label: 'Bias',
  },
};

/** Home World デバッグ用：雷コントロール */
export const HOME_WORLD_DEBUG_LIGHTNING_CONTROLS = {
  visible: { value: false, label: '雷表示' },
  thunderstormType: {
    value: THUNDERSTORM_TYPE_NONE,
    options: [
      THUNDERSTORM_TYPE_NONE,
      THUNDERSTORM_TYPE_LIGHT,
      THUNDERSTORM_TYPE_NORMAL,
      THUNDERSTORM_TYPE_HEAVY,
    ] as const,
    label: '雷雨タイプ',
  },
  occurrenceProbability: {
    value: 7,
    min: 0,
    max: 100,
    step: 1,
    label: '発生確率（％）',
  },
  positionXRange: {
    value: HOME_WORLD_LIGHTNING_POSITION_X_RANGE,
    min: 0,
    max: 1000,
    step: 1,
    label: 'X 分散範囲',
  },
  positionZRange: {
    value: HOME_WORLD_LIGHTNING_POSITION_Z_RANGE,
    min: 0,
    max: 200,
    step: 1,
    label: 'Z 分散範囲',
  },
  positionY: {
    value: HOME_WORLD_LIGHTNING_POSITION_Y,
    min: 0,
    max: 200,
    step: 1,
    label: 'Y 高度',
  },
  powerScale: {
    value: HOME_WORLD_LIGHTNING_POWER_SCALE,
    min: 1,
    max: 1000,
    step: 1,
    label: '輝度スケール',
  },
  distance: {
    value: HOME_WORLD_LIGHTNING_LIGHT_DISTANCE,
    min: 0,
    max: 20000,
    step: 10,
    label: '有効距離',
  },
  decay: {
    value: HOME_WORLD_LIGHTNING_LIGHT_DECAY,
    min: 0,
    max: 100,
    step: 0.1,
    label: '減衰係数',
  },
};

/** Home World デバッグ用：雨（Canvas）コントロール */
export const HOME_WORLD_DEBUG_RAIN_CONTROLS = {
  visible: { value: false, label: '雨表示' },
  rainAmount: { value: 0, min: 0, max: 1000, step: 1, label: '雨粒の数' },
  lineWidth: { value: 2.5, min: 0.5, max: 8, step: 0.5, label: '線の太さ' },
  length: { value: 1.2, min: 0.1, max: 5, step: 0.1, label: '長さ係数' },
  xSpeed: { value: 2, min: 0, max: 10, step: 0.1, label: '水平速度' },
  ySpeed: { value: 20, min: 1, max: 60, step: 1, label: '垂直速度' },
  opacity: { value: 0.25, min: 0, max: 1, step: 0.01, label: '透明度' },
};

/**
 * Home World デバッグ用：カメラリグコントロール。
 * 現在のブレークポイントに対応するカメラ始終点・モデル Y・ドアアニメーション位置を調整する。
 */
export const HOME_WORLD_DEBUG_RIG_CAMERA_CONTROLS = {
  startX: { min: -15, max: 5, step: 0.01, label: '開始 X' },
  startY: { min: -5, max: 65, step: 0.01, label: '開始 Y' },
  startZ: { min: 0, max: 125, step: 0.01, label: '開始 Z' },
  endX: { min: -8, max: 0, step: 0.01, label: '終了 X' },
  endY: { min: -5, max: 5, step: 0.01, label: '終了 Y' },
  endZ: { min: -10, max: 10, step: 0.01, label: '終了 Z' },
  midX: { min: -100, max: 100, step: 0.1, label: '中間点 X' },
  midY: { min: -5, max: 65, step: 0.1, label: '中間点 Y' },
  midZ: { min: 0, max: 125, step: 0.1, label: '中間点 Z' },
  modelsOffsetY: { min: -5, max: 1, step: 0.01, label: 'モデル Y' },
  doorStart: { min: 10, max: 80, step: 1, label: 'ドア開始 (%)' },
  doorEnd: { min: 60, max: 200, step: 1, label: 'ドア終了 (%)' },
  rainHideThreshold: {
    value: 80,
    min: 0,
    max: 100,
    step: 1,
    label: '雨消去 角度 (°)',
  },
};

/** ============================================
 *  シーンオブジェクト名（Three.js Object3D.name / R3F name prop）
 * ============================================ */

/** シーン全体のモデルグループ */
export const HOME_WORLD_SCENE_NAME_MODELS = 'models' as const;

/** カメラリグのコンテナグループ */
export const HOME_WORLD_SCENE_NAME_CAMERA_CONTAINER =
  'camera-container' as const;

/** 地形モデルのグループ */
export const HOME_WORLD_SCENE_NAME_TERRAIN = 'terrain' as const;

/** 雲グループ */
export const HOME_WORLD_SCENE_NAME_CLOUDS = 'clouds' as const;

/** 薄雲メッシュ */
export const HOME_WORLD_SCENE_NAME_THIN_CLOUD = 'thin cloud' as const;

/** 厚雲メッシュ */
export const HOME_WORLD_SCENE_NAME_THICK_CLOUD = 'thick cloud' as const;

/** 星のコンテナグループ */
export const HOME_WORLD_SCENE_NAME_STAR_CONTAINER = 'star-container' as const;

/** 星のポイントメッシュ */
export const HOME_WORLD_SCENE_NAME_STAR = 'star' as const;

/** ドアグループ */
export const HOME_WORLD_SCENE_NAME_DOOR = 'Door' as const;

/** ドアのコンテナグループ */
export const HOME_WORLD_SCENE_NAME_DOOR_CONTAINER = 'door-container' as const;

/** ドアのポイントライト */
export const HOME_WORLD_SCENE_NAME_DOOR_LIGHT = 'door-light' as const;

/** 環境キューブメッシュ */
export const HOME_WORLD_SCENE_NAME_ENV_CUBE = 'env cube' as const;

/** 雷のポイントライト */
export const HOME_WORLD_SCENE_NAME_LIGHTNING = 'lightning' as const;

/** 太陽光ヘルパー */
export const HOME_WORLD_SCENE_NAME_SUN_LIGHT_HELPER =
  'sun_light_helper' as const;

/** 部屋のメッシュ（ドアモデル内） */
export const HOME_WORLD_SCENE_NAME_ROOM = 'room' as const;

/** ============================================
 *  天気の説明（個別定数）
 * ============================================ */

/** 快晴 */
export const WEATHER_DESCRIPTION_CLEAR_SKY = 'clear sky' as const;

/** 少し曇り */
export const WEATHER_DESCRIPTION_FEW_CLOUDS = 'few clouds' as const;

/** 所々曇り */
export const WEATHER_DESCRIPTION_SCATTERED_CLOUDS = 'scattered clouds' as const;

/** 所々雲の切れ間が見える */
export const WEATHER_DESCRIPTION_BROKEN_CLOUDS = 'broken clouds' as const;

/** 小雨（弱い雨 / フォールバック用） */
export const WEATHER_DESCRIPTION_LIGHT_RAIN = 'light rain' as const;

/**
 * 雨 Canvas のオーバーフローオフセット（px）。
 * Canvas をビューポートより左右上下この値分大きく描画し、
 * \`rotateZ\` 回転時に角が途切れないよう余白を確保する。
 */
export const HOME_WORLD_RAIN_CANVAS_OVERFLOW_OFFSET = 300;

/**
 * 雨量係数（モバイル）。
 * 1 時間降雨量（mm）に乗じて雨粒数を算出する。
 * デスクトップより小さい値で処理負荷を軽減する。
 */
export const HOME_WORLD_RAIN_FALL_MULTIPLIER_XS = 180;

/**
 * 雨量係数（デスクトップ）。
 * 1 時間降雨量（mm）に乗じて雨粒数を算出する。
 */
export const HOME_WORLD_RAIN_FALL_MULTIPLIER_BASE = 250;

/** 雨粒の水平速度（モバイル） */
export const HOME_WORLD_RAIN_SPEED_X_XS = 1.5;

/** 雨粒の水平速度（デスクトップ） */
export const HOME_WORLD_RAIN_SPEED_X_BASE = 2;

/** 雨粒の落下速度（モバイル） */
export const HOME_WORLD_RAIN_SPEED_Y_XS = 15;

/** 雨粒の落下速度（デスクトップ） */
export const HOME_WORLD_RAIN_SPEED_Y_BASE = 20;

/** ============================================
 *  ドアモデル（Geo_Door.glb）ピボット
 * ============================================ */

/**
 * SM_DoorPanel ジオメトリの X 方向半幅（= ヒンジ端までのオフセット）。
 * Geo_Door.glb はジオメトリ原点が扉中央（X: -0.3965〜+0.3965）のため
 * ピボットトリックで左ヒンジを回転軸にするために使用する。
 */
export const HOME_WORLD_DOOR_PANEL_HINGE_OFFSET_X = 0.3965;

/** ============================================
 *  ドア室内ライト（ポイントライト）
 * ============================================ */

/** ドア室内ポイントライトの出力（Power） */
export const HOME_WORLD_DOOR_LIGHT_POWER = 50;

/** ドア室内ポイントライトの距離 */
export const HOME_WORLD_DOOR_LIGHT_DISTANCE = 3.0;

/** ドア室内ポイントライトの減衰 */
export const HOME_WORLD_DOOR_LIGHT_DECAY = 1;

/**
 * ドア室内ポイントライトのローカル座標。
 * Geo_Door.glb AABBから算出：ドアフレーム頂部 Y≈2.045、幅中夯 X=0、正面側 Z=0.1。
 */
export const HOME_WORLD_DOOR_LIGHT_POSITION = [0, 2.2, 0.1] as const;

/**
 * ドアポイントライトヘルパーの内接球半径。
 * `PointLightHelper` の `sphereSize` に渡し、実際の照射有効距離（`HOME_WORLD_DOOR_LIGHT_DISTANCE`）と
 * 一致させることで、デバッグ時に光が届く範囲を正確に見えるようにする。
 */
export const HOME_WORLD_DEBUG_DOOR_LIGHT_HELPER_SIZE =
  HOME_WORLD_DOOR_LIGHT_DISTANCE;

/** ============================================
 *  地形モデル（Geo_Terrain.glb）ノード名パターン
 * ============================================ */

/** GPU インスタンシング親ノード名（非表示にして個別ノードのみ使用する） */
export const HOME_WORLD_TERRAIN_INSTANCED_TREE_NAME = 'SM_Tree' as const;

/**
 * 個別木ノード名の正規表現パターン。
 * GLTF JSON 上のノード名は "SM_Tree_B.1" や "SM_Tree_A.119" のようにドットあり形式だが、
 * Three.js の GLTFLoader は PropertyBinding.sanitizeNodeName により
 * ドットを含む予約文字 ( [] .:/  ) を除去するため、
 * object.name は "SM_Tree_B1" / "SM_Tree_A119" 形式（ドットなし）になる。
 */
export const HOME_WORLD_TERRAIN_TREE_NODE_PATTERN = /^SM_Tree_[AB]\d+$/;

/** 木ノード名内のドット以降の数値（シード）を抽出する正規表現 */
export const HOME_WORLD_TERRAIN_TREE_SEED_PATTERN = /\d+$/;

/** 幹マテリアル名 */
export const HOME_WORLD_TERRAIN_MATERIAL_TRUNK = 'M_TrunkA' as const;

/** 葉マテリアル名 */
export const HOME_WORLD_TERRAIN_MATERIAL_LEAVES = 'M_LeavesA' as const;

/**
 * 地形 GLB 内の川メッシュ名（GLB 作成時のタイプミスで "Rivver" と登録されている）。
 * Water シェーダーオブジェクトに差し替えるために個別に検出する。
 */
export const HOME_WORLD_TERRAIN_RIVER_NODE_NAME = 'Rivver' as const;

/** 川水面アニメーション速度 */
export const HOME_WORLD_TERRAIN_RIVER_FLOW_SPEED = 1;

/** 川水面のディストーションスケール（波の歪み量） */
export const HOME_WORLD_TERRAIN_RIVER_DISTORTION_SCALE = 25;

/** Home World デバッグ用：川水面コントロール */
export const HOME_WORLD_DEBUG_RIVER_CONTROLS = {
  color: { label: '川水面の色' },
  distortionScale: {
    value: HOME_WORLD_TERRAIN_RIVER_DISTORTION_SCALE,
    min: -50,
    max: 50,
    step: 0.1,
    label: '波の歪み',
  },
  flowSpeed: {
    value: HOME_WORLD_TERRAIN_RIVER_FLOW_SPEED,
    min: -1,
    max: 1,
    step: 0.001,
    label: '波の変化速度',
  },
};

/** ============================================
 *  カメラシェイク（CameraShake）パラメータ
 * ============================================ */

/** CameraShake の最大 Yaw 角 */
export const HOME_WORLD_CAMERA_SHAKE_MAX_YAW = 0.01;

/** CameraShake の最大 Pitch 角 */
export const HOME_WORLD_CAMERA_SHAKE_MAX_PITCH = 0.01;

/** CameraShake の最大 Roll 角 */
export const HOME_WORLD_CAMERA_SHAKE_MAX_ROLL = 0.01;

/** CameraShake の Yaw 周波数 */
export const HOME_WORLD_CAMERA_SHAKE_YAW_FREQUENCY = 0.2;

/** CameraShake の Pitch 周波数 */
export const HOME_WORLD_CAMERA_SHAKE_PITCH_FREQUENCY = 0.2;

/** ============================================
 *  ドアアニメーション開始・終了（スクロール割合 %）
 * ============================================ */

/** XS より広いビューポートでのドアアニメーション開始スクロール割合（%） */
export const HOME_WORLD_DOOR_ANIM_START_DEFAULT = 50;

/** XS 以下のビューポートでのドアアニメーション開始スクロール割合（%） */
export const HOME_WORLD_DOOR_ANIM_START_XS = 54;

/** XS より広いビューポートでのドアアニメーション終了スクロール割合（%） */
export const HOME_WORLD_DOOR_ANIM_END_DEFAULT = 100;

/** XS 以下のビューポートでのドアアニメーション終了スクロール割合（%） */
export const HOME_WORLD_DOOR_ANIM_END_XS = 124;

/** ============================================
 *  ブレークポイント別モデル Y オフセット
 * ============================================ */

/** 2XL ビューポートでのモデル Y オフセット */
export const HOME_WORLD_MODELS_OFFSET_Y_2XL = -0.85;

/** XL ビューポートでのモデル Y オフセット */
export const HOME_WORLD_MODELS_OFFSET_Y_XL = -0.6;

/** LG ビューポートでのモデル Y オフセット */
export const HOME_WORLD_MODELS_OFFSET_Y_LG = -0.4;

/** SM（タブレット）ビューポートでのモデル Y オフセット */
export const HOME_WORLD_MODELS_OFFSET_Y_SM = -1.4;

/** XS（縦持ち）ビューポートでのモデル Y オフセット */
export const HOME_WORLD_MODELS_OFFSET_Y_XS_WRAP = -3.2;

/** XS（横持ち）ビューポートでのモデル Y オフセット */
export const HOME_WORLD_MODELS_OFFSET_Y_XS_SIDE = -1.2;

/** 最小ビューポートでのモデル Y オフセット */
export const HOME_WORLD_MODELS_OFFSET_Y_DEFAULT = -0.5;

/** ============================================
 *  Canvas / カメラ設定
 * ============================================ */

/** Canvas のデバイスピクセル比レンジ */
export const HOME_WORLD_CANVAS_DPR: [number, number] = [1, 2];

/** カメラの FOV（視野角） */
export const HOME_WORLD_CAMERA_FOV = 45;

/** カメラのニアクリップ */
export const HOME_WORLD_CAMERA_NEAR = 0.01;

/** カメラのファークリップ */
export const HOME_WORLD_CAMERA_FAR = 1000;

/** 天気情報の再取得間隔（ミリ秒） */
export const HOME_WORLD_WEATHER_FETCH_INTERVAL_MS = 60 * 60 * 1000;
