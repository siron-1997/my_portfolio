import {
  type GsapAnimationConfig,
  type SiteMapItem,
  type Sns,
} from '@/types/common';

/** 開発環境フラグ */
export const IS_DEV = process.env.NODE_ENV === 'development';

/** サイト公開年（著作権表記の開始年） */
export const SITE_START_YEAR = 2023;

/**
 * 現在地のデフォルト座標（比叡山）
 * @description 位置情報の共有が許可されなかった場合に使用
 */
export const DEFAULT_COORDINATES = {
  latitude: 35.681236,
  longitude: 139.767125,
};

/** ブレークポイント */
export const BREAK_POINTS = {
  XS: 768,
  SM: 1024,
  LG: 1280,
  XL: 1536,
  '2XL': 1920,
  '3XL': Infinity,
} as const;

/** ブレークポイント名の型 */
export type BreakPointKey = keyof typeof BREAK_POINTS;

/** ブレークポイント名の順序付き配列 */
export const BREAK_POINT_KEYS: BreakPointKey[] = ['XS', 'SM', 'LG', 'XL', '2XL', '3XL'];

/** サイトマップ */
export const SITE_MAP: SiteMapItem[] = [
  { href: '/about', title: 'About' },
  { href: '/works', title: 'Works' },
  { href: '/contact', title: 'Contact' },
];

/** アイコン画像のファイルパス */
export const LOADING_ICON_PATH = '/icons/circle_loading.svg';
export const CLOSE_ICON_PATH = '/icons/close.svg';
export const HAMBURGER_ICON_PATH = '/icons/hamburger.svg';
export const SCROLL_TO_TOP_ICON_PATH = '/icons/keyboard_arrow_up_24.svg';

/**  SNSリスト */
export const SNS_LIST: Sns[] = [
  {
    imageFilePath: '/icons/twitter_sns_48x48.svg',
    alt: 'X',
    href: 'https://twitter.com/Jsiron2029',
  },
  {
    imageFilePath: '/icons/instagram_sns_48x48.svg',
    alt: 'Instagram',
    href: 'https://www.instagram.com/shiron50',
  },
  {
    imageFilePath: '/icons/github_sns_60x60.svg',
    alt: 'GitHub',
    href: 'https://github.com/siron-1997',
  },
];

/** GSAP アニメーションの設定 */
export const DURATION = 1.8;

export const POWER2_OUT_OPACITY_TOP_MOVE: GsapAnimationConfig = {
  from: { y: 120, opacity: 0 },
  to: { y: 0, opacity: 1, duration: DURATION, ease: 'power2.out' },
};

export const POWER2_OUT_OPACITY_BOTTOM_MOVE: GsapAnimationConfig = {
  from: { y: -120, opacity: 0 },
  to: { y: 0, opacity: 1, duration: DURATION, ease: 'power2.out' },
};

export const POWER2_OUT_OPACITY_LEFT_MOVE: GsapAnimationConfig = {
  from: { x: 120, opacity: 0 },
  to: { x: 0, opacity: 1, duration: DURATION, ease: 'power2.out' },
};

export const POWER2_OUT_OPACITY_RIGHT_MOVE: GsapAnimationConfig = {
  from: { x: -120, opacity: 0 },
  to: { x: 0, opacity: 1, duration: DURATION, ease: 'power2.out' },
};

export const POWER4_OUT_OPACITY_TOP_MOVE: GsapAnimationConfig = {
  from: { y: 100, opacity: 0 },
  to: { y: 0, opacity: 1, duration: DURATION, ease: 'power2.out' },
};

export const BACK_OUT_OPACITY_LEFT_MOVE: GsapAnimationConfig = {
  from: { x: 100, opacity: 0 },
  to: { x: 0, opacity: 1, duration: DURATION, delay: 0.2, ease: 'back.out' },
};

export const BACK_OUT_OPACITY_RIGHT_MOVE: GsapAnimationConfig = {
  from: { x: -100, opacity: 0 },
  to: { x: 0, opacity: 1, duration: DURATION, delay: 0.2, ease: 'back.out' },
};
