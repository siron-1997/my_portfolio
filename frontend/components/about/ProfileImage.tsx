'use client';

import React, { JSX, useEffect, useRef } from 'react';
import Image from 'next/image';

import cn from 'classnames';

import { profileImageAnimation } from '@/animations/about';
import {
  ABOUT_PROFILE_IMAGE_ALT,
  ABOUT_PROFILE_IMAGE_ID,
  ABOUT_PROFILE_IMAGE_PATH,
} from '@/constants/about';
import s from '@/styles/about.module.css';

const ProfileImage = React.memo((): JSX.Element => {
  /** プロフィール画像の参照 Ref */
  const ref = useRef<HTMLDivElement | null>(null);

  const classNames = cn(s.profile_image_container, 'image_container');

  useEffect(() => {
    if (!ref.current) return;

    /** プロフィール画像のアニメーションコンテキスト */
    const ctx = profileImageAnimation({
      image: ref.current.querySelector(
        `#${ABOUT_PROFILE_IMAGE_ID}`,
      ) as HTMLImageElement,
      ref,
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className={classNames} ref={ref}>
      <Image
        src={ABOUT_PROFILE_IMAGE_PATH}
        alt={ABOUT_PROFILE_IMAGE_ALT}
        className={s.profile_image}
        id={ABOUT_PROFILE_IMAGE_ID}
        fill
        quality={100}
        placeholder="blur"
        blurDataURL={ABOUT_PROFILE_IMAGE_PATH}
        sizes={'(max-width: 1024px) 90vw, (max-width: 768px) 50vw, 100vw'}
        priority
      />
    </div>
  );
});

ProfileImage.displayName = 'ProfileImage';

export default ProfileImage;
