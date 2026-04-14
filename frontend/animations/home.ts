import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type React from 'react';
import type { OrthographicCamera, PerspectiveCamera,Vector3 } from 'three';
import { type Group, Material,MathUtils, type Mesh } from 'three';

import {
  POWER2_OUT_OPACITY_LEFT_MOVE,
  POWER2_OUT_OPACITY_TOP_MOVE,
} from '@/constants/common';
import getScrollTriggerOption from '@/utils/gsap';

gsap.registerPlugin(ScrollTrigger);

// ---------- Portal ----------

/** ポータルセクションのアニメーションプロパティ */
type PortalAnimationProps = {
  /** ポータルのタイトル要素 */
  title: HTMLHeadingElement;

  /** ポータルセクションの参照 Ref */
  portalRef: React.RefObject<HTMLDivElement | null>;
};

// ---------- Works ----------

/** Works セクションのアニメーションプロパティ */
type WorksAnimationProps = {
  /** Works セクションの見出し要素 */
  title: HTMLHeadingElement;
  /** カードコンテナ要素 */
  cards: HTMLDivElement;
  /** Works セクションの参照 Ref */
  worksRef: React.RefObject<HTMLElement | null>;
};

export const portalAnimation = ({ title, portalRef }: PortalAnimationProps) => {
  const ctx = gsap.context(() => {
    gsap.fromTo(title, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      delay: 1.5,
    });
  }, portalRef);

  return ctx;
};

export const worksAnimation = ({
  title,
  cards,
  worksRef,
}: WorksAnimationProps) => {
  const ctx = gsap.context(() => {
    /* Works見出し */
    gsap.fromTo(title, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      ...getScrollTriggerOption({
        element: worksRef.current!,
        start: 'top bottom',
      }),
    });
    /* Works カード */
    gsap.fromTo(cards, POWER2_OUT_OPACITY_LEFT_MOVE.from, {
      ...POWER2_OUT_OPACITY_LEFT_MOVE.to,
      ...getScrollTriggerOption({
        element: cards,
        start: '20% bottom',
        delay: 0.8,
      }),
    });
  });

  return ctx;
};

// ---------- RigCamera ----------

/** カメラリグのスクロールアニメーションプロパティ */
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
}: RigCameraAnimationProps) => {
  const ctx = gsap.context(() => {
    /** カメラ位置アニメーション */
    const cameraAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: portal,
        start: 'top',
        markers: process.env.NODE_ENV === 'development',
        scrub: 0.7,
        toggleActions: 'play pause resume pause',
      },
      defaults: {
        duration: 0.7,
        ease: 'power2.out',
      },
    });

    /** ドア開閉アニメーション */
    const doorAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: portal,
        start: `${doorAnimStart}%`,
        end: `${doorAnimEnd}%`,
        markers: process.env.NODE_ENV === 'development',
        scrub: true,
        toggleActions: 'play pause resume pause',
      },
    });

    let lastScrollTop = window.scrollY;
    /** 直前の屋内状態を保持し、変化時のみコールバックを呼び出す */
    let isCurrentlyInside = false;

    const handleDoorUpdate = () => {
      const scrollTop = window.scrollY;
      const thresholdRad = MathUtils.degToRad(doorHideRainThresholdDeg);

      /** スクロールダウン */
      if (scrollTop > lastScrollTop) {
        /** 扇の角度が 0° より大きく、かつ部屋のマテリアルがインスタンスの場合、部屋を表示 */
        if (
          door.rotation.y > MathUtils.degToRad(0) &&
          room.material instanceof Material
        ) {
          room.material.opacity = 1;
          room.material.needsUpdate = true;
        }

        /** スクロールアップ */
      } else if (scrollTop < lastScrollTop) {
        /** 扇の角度が 0°、かつ部屋のマテリアルがインスタンスの場合、部屋を非表示 */
        if (
          door.rotation.y === MathUtils.degToRad(0) &&
          room.material instanceof Material
        ) {
          room.material.opacity = 0;
          room.material.needsUpdate = true;
        }
      }

      /** 扇の回転角がしきい値を超えたときのみ屋内外状態の切り替えを通知する */
      const nowInside = door.rotation.y >= thresholdRad;
      if (nowInside !== isCurrentlyInside) {
        isCurrentlyInside = nowInside;
        onInsideRoomChange?.(nowInside);
      }

      /** スクロール位置を更新 */
      lastScrollTop = scrollTop;
    };

    cameraAnimation.fromTo(
      camera.position,
      { ...startPosition },
      { ...endPosition },
    );
    doorAnimation.to(door.rotation, {
      y: MathUtils.degToRad(100),
      onUpdate: () => handleDoorUpdate(),
    });
  }, ref);

  return ctx;
};
