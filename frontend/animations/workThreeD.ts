import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import getScrollTriggerOption from '@/utils/gsap';
import {
  POWER2_OUT_OPACITY_TOP_MOVE,
  POWER2_OUT_OPACITY_LEFT_MOVE,
  POWER2_OUT_OPACITY_RIGHT_MOVE,
  POWER2_OUT_OPACITY_BOTTOM_MOVE,
} from '@/constants/common';

gsap.registerPlugin(ScrollTrigger);

/** ControlsProps の型定義 */
type ControlsProps = {
  /** section */
  section: HTMLElement;
  /** listPC */
  listPC: HTMLDivElement;
  /** listMB */
  listMB: HTMLDivElement;
  /** controlsRef */
  controlsRef: React.RefObject<HTMLDivElement>;
};

/** IntroductionProps の型定義 */
type IntroductionProps = {
  /** section */
  section: HTMLElement;
  /** introductionRef */
  introductionRef: React.RefObject<HTMLDivElement>;
};

/** PortalProps の型定義 */
type PortalProps = {
  /** portal */
  portal: HTMLElement;
  /** portalRef */
  portalRef: React.RefObject<HTMLElement>;
};

/** FingerPressProps の型定義 */
type FingerPressProps = {
  /** image */
  image: HTMLImageElement;
  /** text */
  text: HTMLParagraphElement;
  /** fingerPressRef */
  fingerPressRef: React.RefObject<HTMLDivElement>;
  /** currentWidth */
  currentWidth: number;
  /** isFingerVisible */
  isFingerVisible: boolean;
};

/** ToggleButtonProps の型定義 */
type ToggleButtonProps = {
  /** bg */
  bg: HTMLDivElement;
  /** toggleButtonRef */
  toggleButtonRef: React.RefObject<HTMLDivElement>;
  /** isViewerActive */
  isViewerActive: boolean;
};

export const controlsAnimation = ({
  section,
  listPC,
  listMB,
  controlsRef,
}: ControlsProps) => {
  const ctx = gsap.context(() => {
    /* セクション */
    const controlsChildElement = controlsRef.current
      ?.querySelector('div')
      ?.querySelector('div');
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
    /* コントロールリスト PC */
    if (listPC.style.display !== 'none') {
      const list = listPC.querySelector('ul');
      if (list) {
        gsap.fromTo(list, POWER2_OUT_OPACITY_LEFT_MOVE.from, {
          ...POWER2_OUT_OPACITY_LEFT_MOVE.to,
          ...getScrollTriggerOption({ delay: 0.4, element: list, markers: false }),
        });
      }
    }
    /* コントロールリスト MB */
    if (listMB.style.display !== 'none') {
      const list: HTMLUListElement | null = listMB.querySelector('#controls-mb-text');
      if (list) {
        gsap.fromTo(list, POWER2_OUT_OPACITY_RIGHT_MOVE.from, {
          ...POWER2_OUT_OPACITY_RIGHT_MOVE.to,
          ...getScrollTriggerOption({ delay: 0.4, element: list, markers: false }),
        });
        /* コントロールバー */
        gsap.fromTo(
          listMB.querySelector('#controls-mb-carousel'),
          POWER2_OUT_OPACITY_TOP_MOVE.from,
          {
            ...POWER2_OUT_OPACITY_TOP_MOVE.to,
            ...getScrollTriggerOption({ delay: 0.4, element: listMB, markers: false }),
          },
        );
      }
    }
  }, controlsRef);

  return ctx;
};

export const introductionAnimation = ({
  section,
  introductionRef,
}: IntroductionProps) => {
  const ctx = gsap.context(() => {
    const toggleButton = section.querySelector('#toggle-button');
    const title = section.querySelector('h2');
    const text = section.querySelector('p');
    /* 見出し */
    gsap.fromTo(title, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      ...getScrollTriggerOption({ delay: 0.4, element: section, markers: false }),
    });
    /* 説明文 */
    gsap.fromTo(text, POWER2_OUT_OPACITY_TOP_MOVE.from, {
      ...POWER2_OUT_OPACITY_TOP_MOVE.to,
      ...getScrollTriggerOption({ delay: 0.4, element: section, markers: false }),
    });
    /* トグルボタン */
    gsap.fromTo(toggleButton, POWER2_OUT_OPACITY_BOTTOM_MOVE.from, {
      ...POWER2_OUT_OPACITY_BOTTOM_MOVE.to,
      ...getScrollTriggerOption({ delay: 0.8, element: section, markers: false }),
    });
  }, introductionRef);

  return ctx;
};

export const portalAnimation = ({ portal, portalRef }: PortalProps) => {
  const ctx = gsap.context(() => {
    gsap.fromTo(portal, POWER2_OUT_OPACITY_RIGHT_MOVE.from, {
      ...POWER2_OUT_OPACITY_RIGHT_MOVE.to,
      delay: 1.5,
    });
  }, portalRef);
  return ctx;
};

export const fingerPressAnimation = ({
  image,
  text,
  fingerPressRef,
  currentWidth,
  isFingerVisible,
}: FingerPressProps) => {
  const ctx = gsap.context(() => {
    const opacities = { point1: 0, point2: 0.85, point3: 0.4 };
    const imageAnimation = gsap.timeline({ repeat: -1 });
    const textAnimation = gsap.timeline({});
    const arrowIconAnimation = gsap.timeline({ paused: true });

    if (image !== null) {
      imageAnimation.fromTo(
        image,
        { opacity: 0 },
        { opacity: 0.85, scale: 1.2, duration: 0.3, ease: 'power1.out' },
      );
      imageAnimation.fromTo(
        image,
        { opacity: 0.85 },
        { opacity: 0.4, scale: 1.0, duration: 0.3, ease: 'power1.out' },
      );
      imageAnimation.fromTo(
        image,
        { x: -currentWidth },
        { x: currentWidth, duration: 1, ease: 'power2.out' },
      );
      imageAnimation.fromTo(
        image,
        { opacity: opacities.point3 },
        { opacity: opacities.point1, duration: 0.5, ease: 'power1.out' },
      );

      if (isFingerVisible) imageAnimation.play();
    }

    if (text !== null) {
      textAnimation.fromTo(
        text,
        { opacity: opacities.point1, y: 50 },
        { opacity: opacities.point2, y: 0 },
      );
      textAnimation.fromTo(
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
      arrowIconAnimation.fromTo(
        text.children[1],
        { y: 0 },
        { y: 20, duration: 1.2, delay: 1.2, yoyo: true, repeat: -1, ease: 'none' },
      );
    }
  }, fingerPressRef);

  return ctx;
};

export const toggleButtonAnimation = ({
  bg,
  toggleButtonRef,
  isViewerActive,
}: ToggleButtonProps) => {
  const ctx = gsap.context(() => {
    let positionX = 0;
    if (isViewerActive) positionX = -130;
    gsap.to(bg, { x: positionX, duration: 0.2, ease: 'power1.out' });
  }, toggleButtonRef);

  return ctx;
};
