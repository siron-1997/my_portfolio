import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type React from 'react';
import type { OrthographicCamera, PerspectiveCamera, Vector3 } from 'three';
import { type Group, Material, MathUtils, type Mesh } from 'three';

import {
  POWER2_OUT_OPACITY_LEFT_MOVE,
  POWER2_OUT_OPACITY_TOP_MOVE,
  IS_DEV,
} from '@/constants/common';
import { getScrollTriggerOption } from '@/utils';

gsap.registerPlugin(ScrollTrigger);

type PortalAnimationProps = {
  /** Portal のタイトル要素 */
  title: HTMLHeadingElement;

  /** Portal セクションの参照 Ref */
  portalRef: React.RefObject<HTMLDivElement | null>;
};

type WorksAnimationProps = {
  /** Works 見出し要素 */
  title: HTMLHeadingElement;

  /** カードコンテナ要素 */
  cards: HTMLDivElement;

  /** Works セクションの参照 Ref */
  worksRef: React.RefObject<HTMLElement | null>;
};

type RigCameraAnimationProps = {
  /** アニメーション開始カメラ座標 */
  startPosition: Vector3;

  /** アニメーション終了カメラ座標 */
  endPosition: Vector3;

  /** スクロールトリガーの基準要素 */
  portal: HTMLDivElement;

  /** ドアグループ */
  door: Group;

  /** 部屋メッシュ */
  room: Mesh;

  /** カメラリグ格納グループの参照 Ref */
  ref: React.RefObject<Group | null>;

  /** カメラ */
  camera: OrthographicCamera | PerspectiveCamera;

  /** ドア開閉アニメーション開始スクロール位置（%単位の数値） */
  doorAnimStart: number;

  /** ドア開閉アニメーション終了スクロール位置（%単位の数値） */
  doorAnimEnd: number;

  /** カメラが屋内に入った際の通知コールバック */
  onInsideRoomChange?: (isInside: boolean) => void;

  /** 雨を非表示にするドアの回転角しきい値（°） */
  doorHideRainThresholdDeg: number;
};

/**
 * Portal アニメーションの初期化処理
 * ページ表示時にタイトルが上からフェードインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const portalAnimation = ({
  title,
  portalRef,
}: PortalAnimationProps): gsap.Context => {
  return gsap.context(() => {
    gsap.fromTo(title, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      delay: 1.5,
    });
  }, portalRef);
};

/**
 * Works アニメーションの初期化処理
 * ページ表示時にタイトルが上から、カードコンテナが左右交互にフェードインするアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const worksAnimation = ({
  title,
  cards,
  worksRef,
}: WorksAnimationProps): gsap.Context => {
  return gsap.context(() => {
    /* タイトル */
    gsap.fromTo(title, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      ...getScrollTriggerOption({
        element: worksRef.current!,
        start: 'top bottom',
      }),
    });
    /* カードコンテナー */
    gsap.fromTo(cards, POWER2_OUT_OPACITY_LEFT_MOVE.from, {
      ...POWER2_OUT_OPACITY_LEFT_MOVE.to,
      ...getScrollTriggerOption({
        element: cards,
        start: '20% bottom',
        delay: 0.8,
      }),
    });
  });
};

/**
 * カメラリグのアニメーション初期化処理
 * スクロールに応じてカメラが移動し、ドアが開閉するアニメーションを設定する。
 *
 * @returns {gsap.Context} GSAP コンテキスト
 */
export const rigCameraAnimation = ({
  startPosition,
  endPosition,
  portal,
  door,
  room,
  ref,
  camera,
  doorAnimStart,
  doorAnimEnd,
  onInsideRoomChange,
  doorHideRainThresholdDeg,
}: RigCameraAnimationProps): gsap.Context => {
  return gsap.context(() => {
    /** 前回のスクロール位置 */
    let prevScrollTop = window.scrollY;

    /** 直前の屋内状態を保持し、変化時のみコールバックを呼び出す */
    let isCurrentlyInside = false;

    const handleDoorUpdate = () => {
      /** 現在のスクロール位置 */
      const currentScrollTop = window.scrollY;

      /** 雨を非表示にするドアの回転角しきい値（ラジアン） */
      const thresholdRad = MathUtils.degToRad(doorHideRainThresholdDeg);

      /** スクロールダウン時で扉の角度が 0° より大きい場合 */
      if (
        currentScrollTop > prevScrollTop &&
        door.rotation.y > MathUtils.degToRad(0) &&
        room.material instanceof Material
      ) {
        room.material.opacity = 1;
        room.material.needsUpdate = true;
      }

      /** スクロールアップ時で扉の角度が 0° の場合 */
      if (
        currentScrollTop < prevScrollTop &&
        door.rotation.y === MathUtils.degToRad(0) &&
        room.material instanceof Material
      ) {
        room.material.opacity = 0;
        room.material.needsUpdate = true;
      }

      /** 扇の回転角がしきい値を超えたときのみ屋内外状態の切り替えを通知する */
      const nowInside = door.rotation.y >= thresholdRad;
      if (nowInside !== isCurrentlyInside) {
        isCurrentlyInside = nowInside;
        onInsideRoomChange?.(nowInside);
      }

      prevScrollTop = currentScrollTop;
    };

    /** カメラ位置アニメーション */
    gsap
      .timeline({
        scrollTrigger: {
          trigger: portal,
          start: 'top',
          markers: IS_DEV,
          scrub: 0.7,
          toggleActions: 'play pause resume pause',
        },
        defaults: {
          duration: 0.7,
          ease: 'power2.out',
        },
      })
      .fromTo(camera.position, { ...startPosition }, { ...endPosition });

    /** ドア開閉アニメーション */
    gsap
      .timeline({
        scrollTrigger: {
          trigger: portal,
          start: `${doorAnimStart}%`,
          end: `${doorAnimEnd}%`,
          markers: IS_DEV,
          scrub: true,
          toggleActions: 'play pause resume pause',
        },
      })
      .to(door.rotation, {
        y: MathUtils.degToRad(100),
        onUpdate: () => handleDoorUpdate(),
      });
  }, ref);
};
