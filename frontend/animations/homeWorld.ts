import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MathUtils,
  Group,
  Mesh,
  Material,
  Vector3,
  OrthographicCamera,
  PerspectiveCamera,
} from 'three';
import { BREAK_POINTS } from '@/constants/common';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  startPosition: Vector3;
  endPosition: Vector3;
  portal: HTMLDivElement;
  door: Group;
  room: Mesh;
  cameraContainerRef: React.RefObject<Group>;
  camera: OrthographicCamera | PerspectiveCamera;
  width: number;
};

export const rigCameraAnimation = ({
  startPosition,
  endPosition,
  portal,
  door,
  room,
  cameraContainerRef,
  camera,
  width,
}: Props) => {
  const ctx = gsap.context(() => {
    // カメラ位置アニメーション
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
    // ドア開閉アニメーション
    const doorAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: portal,
        start: width > BREAK_POINTS.XS ? '50%' : '54%',
        end: width > BREAK_POINTS.XS ? '100%' : '124%',
        markers: process.env.NODE_ENV === 'development',
        scrub: true,
        toggleActions: 'play pause resume pause',
      },
    });

    let lastScrollTop = window.scrollY;

    const handleUpdate = () => {
      const scrollTop = window.scrollY;
      // スクロールダウン
      if (scrollTop > lastScrollTop) {
        // 扉の角度が0°より大きい、かつ部屋のマテリアルがインスタンスの場合、部屋を表示
        if (
          door.rotation.y > MathUtils.degToRad(0) &&
          room.material instanceof Material
        ) {
          room.material.opacity = 1;
          room.material.needsUpdate = true;
        }
        // スクロールアップ
      } else if (scrollTop < lastScrollTop) {
        // 扉の角度が0°、かつ部屋のマテリアルがインスタンスの場合、部屋を非表示
        if (
          door.rotation.y === MathUtils.degToRad(0) &&
          room.material instanceof Material
        ) {
          room.material.opacity = 0;
          room.material.needsUpdate = true;
        }
      }
      // スクロール位置を更新
      lastScrollTop = scrollTop;
    };

    cameraAnimation.fromTo(camera.position, { ...startPosition }, { ...endPosition });
    doorAnimation.to(door.rotation, {
      y: MathUtils.degToRad(100),
      onUpdate: () => handleUpdate(),
    });
  }, cameraContainerRef);

  return ctx;
};
