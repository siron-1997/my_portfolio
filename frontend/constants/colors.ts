import {
  type AppThemeColors,
  type TimePointColorSet,
  type WorkWorldColorSet,
} from '@/types/colors';

/** UI テーマ用のカラーパレット */
export const COLOR_PALETTE = {
  white: '#FFFFFF',
  black: '#1D1730',
  grayLight: '#2A2E3F',
  grayDark: '#3A3E4F',
  primary: '#00AAAA',
  primaryHover: '#008888',
  error: '#FF2E3A',
  errorHover: '#AA1D29',
  navigation: '#00FFFF',
  borderDefault: 'rgba(190, 190, 190, 0.4)',
  borderHover: 'rgba(190, 190, 190, 0.8)',
  faviconTileColor: '#da532c',
  themeColor: '#ffffff',
  borderWhiteSemi: 'rgba(255, 255, 255, 0.5)',
  bgBlackSemi: 'rgb(0, 0, 0, 0.3)',
};

/** Three.js ワールド専用のカラーパレット */
export const WORLD_COLOR_PALETTE = {
  ambientLight: '#3F1F4E',
  directionalLight: '#ECE0F8',
  fogEvening: 'rgb(125, 87, 124)',
  fogNight: 'rgb(52, 30, 85)',
  fogLunch: 'rgb(137, 149, 150)',
  clearSkyEvening: 'rgb(170, 88, 170)',
  clearSkyNight: 'rgb(105, 67, 169)',
  clearSkyLunch: 'rgb(173, 174, 165)',
  thinCloudEvening: 'rgb(190, 93, 189)',
  thinCloudNight: 'rgb(105, 67, 169)',
  thinCloudLunch: 'rgb(173, 174, 165)',
  thickCloudEvening: 'rgb(125, 113, 157)',
  thickCloudNight: 'rgb(115, 77, 169)',
  thickCloudLunch: 'rgb(176, 175, 148)',
  doorLight: '#dda862',
  lightning: '#55A5EB',
  riverWater: '#01DFD7',
  rain: '174, 194, 224',
  star: '#ffffff',
  backgroundEvening:
    'linear-gradient(180deg, rgba(99,72,198,1) 0%, rgba(110,46,166,1) 7%, rgba(227,73,121,1) 32%, rgba(241,145,66,1) 50%)',
  backgroundNight:
    'linear-gradient(180deg, rgba(26,3,74,1) 0%, rgba(61,118,170,1) 0%, rgba(90,67,142,1) 25%, rgba(48,7,87,1) 50%)',
  backgroundLunch:
    'linear-gradient(180deg, rgba(87,65,170,1) 0%, rgba(66,98,177,1) 5%, rgba(99,139,205,1) 15%, rgba(113,187,213,1) 25%, rgba(154,214,214,1) 35%)',
  environmentEvening: 'rgb(170, 85, 175)',
  environmentNight: 'rgb(77, 32, 109)',
  environmentLunch: 'rgb(61, 70, 69)',
};

/** 構造化されたカラー定義 */
export const APP_THEME_COLORS: AppThemeColors = {
  border: {
    dark: {
      default: COLOR_PALETTE.borderDefault,
      hover: COLOR_PALETTE.borderHover,
      focus: COLOR_PALETTE.primary,
    },
  },
  text: {
    dark: COLOR_PALETTE.white,
  },
  bgColor: {
    dark: {
      main: COLOR_PALETTE.black,
      sub: COLOR_PALETTE.grayLight,
      textField: COLOR_PALETTE.grayDark,
    },
  },
  main: {
    default: COLOR_PALETTE.primary,
    hover: COLOR_PALETTE.primaryHover,
  },
  error: {
    default: COLOR_PALETTE.error,
    hover: COLOR_PALETTE.errorHover,
  },
  navigation: COLOR_PALETTE.navigation,
};

/** 環境ごとのカラー定義 */
export const TIME_POINT_ENV_COLORS: TimePointColorSet = {
  evening: {
    fog: WORLD_COLOR_PALETTE.fogEvening,
    clearSky: WORLD_COLOR_PALETTE.clearSkyEvening,
    thinCloud: WORLD_COLOR_PALETTE.thinCloudEvening,
    thickCloud: WORLD_COLOR_PALETTE.thickCloudEvening,
    background: WORLD_COLOR_PALETTE.backgroundEvening,
    environment: WORLD_COLOR_PALETTE.environmentEvening,
  },
  night: {
    fog: WORLD_COLOR_PALETTE.fogNight,
    clearSky: WORLD_COLOR_PALETTE.clearSkyNight,
    thinCloud: WORLD_COLOR_PALETTE.thinCloudNight,
    thickCloud: WORLD_COLOR_PALETTE.thickCloudNight,
    background: WORLD_COLOR_PALETTE.backgroundNight,
    environment: WORLD_COLOR_PALETTE.environmentNight,
  },
  lunch: {
    fog: WORLD_COLOR_PALETTE.fogLunch,
    clearSky: WORLD_COLOR_PALETTE.clearSkyLunch,
    thinCloud: WORLD_COLOR_PALETTE.thinCloudLunch,
    thickCloud: WORLD_COLOR_PALETTE.thickCloudLunch,
    background: WORLD_COLOR_PALETTE.backgroundLunch,
    environment: WORLD_COLOR_PALETTE.environmentLunch,
  },
};

/**
 * 地形モデルの幹カラーパレット。
 * 旧 mountain.glb の Tree_1 / Tree_2 マテリアル（linear sRGB → standard sRGB 変換済み）
 * の値を元に定義。
 */
export const TERRAIN_TRUNK_COLORS = [
  /** Tree_1: ダークブラウン */
  '#683917',

  /** Tree_2: テラコッタブラウン */
  '#b55533',
] as const;

/**
 * 地形モデルの葉カラーパレット。
 * 旧 mountain.glb の Leaves_1〜6 マテリアル（linear sRGB → standard sRGB 変換済み）
 * の値を元に定義。
 */
export const TERRAIN_LEAVES_COLORS = [
  /** Leaves_1: 鮮やかグリーン */
  '#1ba700',

  /** Leaves_2: ミドルグリーン */
  '#178f00',

  /** Leaves_3: ダークグリーン */
  '#084200',

  /** Leaves_4: イエローグリーン */
  '#95b756',

  /** Leaves_5: フォレストグリーン */
  '#308b2d',

  /** Leaves_6: ライトグリーン */
  '#75b34b',
] as const;

/** workThreeD UI コンポーネント専用のカラー定義 */
export const WORK_THREE_D_UI_COLORS = {
  /** コントロールアイテム・ナビゲーションのデフォルトボーダー色 */
  borderDefault: COLOR_PALETTE.borderWhiteSemi,
  /** コントロールアイテムの背景色 */
  bgTransparent: COLOR_PALETTE.bgBlackSemi,
} as const;

/** ワークワールドのカラー定義 */
export const WORK_WORLD_ENV_COLORS: WorkWorldColorSet = {
  ambientLight: WORLD_COLOR_PALETTE.ambientLight,
  directionalLight: WORLD_COLOR_PALETTE.directionalLight,
  fog: COLOR_PALETTE.black,
};
