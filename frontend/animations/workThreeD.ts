import { RefObject } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  POWER2_OUT_OPACITY_BOTTOM_MOVE,
  POWER2_OUT_OPACITY_LEFT_MOVE,
  POWER2_OUT_OPACITY_RIGHT_MOVE,
  POWER2_OUT_OPACITY_TOP_MOVE,
} from '@/constants/common';
import { getScrollTriggerOption } from '@/utils';

gsap.registerPlugin(ScrollTrigger);

type ControlsProps = {
  /** Controls セクションの要素 */
  section: HTMLElement;

  /** デスクトップ時に表示されるリストの要素 */
  listPC: HTMLDivElement;

  /** モバイル時に表示されるリストの要素 */
  listMB: HTMLDivElement;

  /** Controls セクションのルート要素の ref */
  ref: RefObject<HTMLDivElement | null>;
};

type IntroductionProps = {
  /** Introduction セクションの要素 */
  section: HTMLElement;

  /** Introduction セクションの参照 Ref */
  ref: RefObject<HTMLDivElement | null>;
};

type PortalProps = {
  /** portal セクションの要素 */
  portal: HTMLElement;

  /** portal セクションの参照 Ref */
  ref: RefObject<HTMLElement | null>;
};

type FingerPressProps = {
  /** 画像の要素 */
  image: HTMLImageElement;

  /** 説明文の要素 */
  text: HTMLParagraphElement;

  /** 指アイコンの参照 Ref */
  ref: RefObject<HTMLDivElement | null>;

  /** 現在の幅 */
  currentWidth: number;

  /** 指アイコン表示フラグ */
  isFingerVisible: boolean;
};

type ToggleButtonProps = {
  /** トグルボタンの背景要素 */
  bgButton: HTMLDivElement;

  /** トグルボタンの参照 Ref */
  ref: RefObject<HTMLDivElement | null>;

  /** ビュワーアクティブフラグ */
  isViewerActive: boolean;
};

/**
 * Controls セクションのアニメーション初期化処理
 * ページ表示時に Controls セクションの子要素が順番にフェードインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const controlsAnimation = ({
  section,
  listPC,
  listMB,
  ref,
}: ControlsProps): gsap.Context => {
  return gsap.context(() => {
    /** Controls セクション内の子要素を取得 */
    const controlsChildElement = ref.current
      ?.querySelector('div')
      ?.querySelector('div');

    /** Controls セクション内の子要素が存在する場合、アニメーションを適用 */
    if (controlsChildElement) {
      gsap.fromTo(section, POWER2_OUT_OPACITY_TOP_MOVE.from, {
        ...POWER2_OUT_OPACITY_TOP_MOVE.to,
        ...getScrollTriggerOption({
          delay: 0.4,
          element: controlsChildElement,
          markers: false,
        }),
      });
    }

    /** デスクトップ時に表示されるリストの要素が存在する場合 */
    if (listPC.style.display !== 'none') {
      const list = listPC.querySelector('ul');

      /** デスクトップ時に表示されるリストの要素が存在する場合、アニメーションを適用 */
      if (list) {
        gsap.fromTo(list, POWER2_OUT_OPACITY_LEFT_MOVE.from, {
          ...POWER2_OUT_OPACITY_LEFT_MOVE.to,
          ...getScrollTriggerOption({
            delay: 0.4,
            element: list,
            markers: false,
          }),
        });
      }
    }

    /** モバイル時に表示されるリストの要素が存在する場合 */
    if (listMB.style.display !== 'none') {
      const list = listMB.querySelector('#controls-mb-text');

      /** モバイル時に表示されるリストの要素が存在する場合、アニメーションを適用 */
      if (list && list instanceof HTMLDivElement) {
        gsap.fromTo(list, POWER2_OUT_OPACITY_RIGHT_MOVE.from, {
          ...POWER2_OUT_OPACITY_RIGHT_MOVE.to,
          ...getScrollTriggerOption({
            delay: 0.4,
            element: list,
            markers: false,
          }),
        });

        /** カルーセルの要素のアニメーション */
        gsap.fromTo(
          listMB.querySelector('#controls-mb-carousel'),
          POWER2_OUT_OPACITY_TOP_MOVE.from,
          {
            ...POWER2_OUT_OPACITY_TOP_MOVE.to,
            ...getScrollTriggerOption({
              delay: 0.4,
              element: listMB,
              markers: false,
            }),
          },
        );
      }
    }
  }, ref);
};

/**
 * Introduction セクションのアニメーション初期化処理
 * ページ表示時に Introduction セクションの見出し、説明文、トグルボタンが順番にフェードインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const introductionAnimation = ({
  section,
  ref,
}: IntroductionProps): gsap.Context => {
  return gsap.context(() => {
    /** トグルボタン要素を取得 */
    const toggleButton = section.querySelector('#toggle-button');

    /** 見出し要素を取得 */
    const title = section.querySelector('h2');

    /** 説明文要素を取得 */
    const text = section.querySelector('p');

    /* 見出し */
    gsap.fromTo(title, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      ...getScrollTriggerOption({
        delay: 0.4,
        element: section,
        markers: false,
      }),
    });

    /* 説明文 */
    gsap.fromTo(text, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      ...getScrollTriggerOption({
        delay: 0.4,
        element: section,
        markers: false,
      }),
    });

    /* トグルボタン */
    gsap.fromTo(toggleButton, POWER2_OUT_OPACITY_BOTTOM_MOVE.from, {
      ...POWER2_OUT_OPACITY_BOTTOM_MOVE.to,
      ...getScrollTriggerOption({
        delay: 0.8,
        element: section,
        markers: false,
      }),
    });
  }, ref);
};

/**
 * portal セクションのアニメーション初期化処理
 * ページ表示時に portal セクションが右からフェードインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const portalAnimation = ({ portal, ref }: PortalProps): gsap.Context => {
  return gsap.context(() => {
    gsap.fromTo(portal, POWER2_OUT_OPACITY_RIGHT_MOVE.from, {
      ...POWER2_OUT_OPACITY_RIGHT_MOVE.to,
      delay: 1.5,
    });
  }, ref);
};

/**
 * 指アイコンのアニメーション初期化処理
 * ページ表示時に指アイコンがフェードイン・スライドするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const fingerPressAnimation = ({
  image,
  text,
  ref,
  currentWidth,
  isFingerVisible,
}: FingerPressProps): gsap.Context => {
  return gsap.context(() => {
    /** 不透明度の設定 */
    const opacities = { point1: 0, point2: 0.85, point3: 0.4 };

    /** アイコン画像のアニメーション */
    const imageAnimation = gsap
      .timeline({ repeat: -1 })
      .fromTo(
        image,
        { opacity: 0 },
        { opacity: 0.85, scale: 1.2, duration: 0.3, ease: 'power1.out' },
      )
      .fromTo(
        image,
        { opacity: 0.85 },
        { opacity: 0.4, scale: 1.0, duration: 0.3, ease: 'power1.out' },
      )
      .fromTo(
        image,
        { x: -currentWidth },
        { x: currentWidth, duration: 1, ease: 'power2.out' },
      )
      .fromTo(
        image,
        { opacity: opacities.point3 },
        { opacity: opacities.point1, duration: 0.5, ease: 'power1.out' },
      );

    /** アイコンが表示されている場合、アニメーションを再生 */
    if (isFingerVisible) imageAnimation.play();

    /** テキストのアニメーション */
    gsap
      .timeline({})
      .fromTo(
        text,
        { opacity: opacities.point1, y: 50 },
        { opacity: opacities.point2, y: 0 },
      )
      .fromTo(
        text,
        { opacity: opacities.point2 - 0.15 },
        {
          opacity: opacities.point3,
          duration: 1.2,
          repeat: -1,
          yoyoEase: true,
          ease: 'none',
        },
      );

    /** 矢印アイコンのアニメーション */
    gsap.timeline({ paused: true }).fromTo(
      text.children[1],
      { y: 0 },
      {
        y: 20,
        duration: 1.2,
        delay: 1.2,
        yoyo: true,
        repeat: -1,
        ease: 'none',
      },
    );
  }, ref);
};

/**
 * トグルボタンのアニメーション初期化処理
 * ビュワーアクティブフラグに応じてトグルボタンの背景が左右にスライドするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const toggleButtonAnimation = ({
  bgButton,
  ref,
  isViewerActive,
}: ToggleButtonProps): gsap.Context => {
  return gsap.context(() => {
    let positionX = 0;
    /** ビュワーアクティブフラグに応じてトグルボタンの位置を設定 */
    if (isViewerActive) positionX = -130;
    gsap.to(bgButton, { x: positionX, duration: 0.2, ease: 'power1.out' });
  }, ref);
};
