'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

import cn from 'classnames';

import { profileImageAnimation } from '@/animations/about';
import s from '@/styles/about/ProfileImage.module.css';

const ProfileImage = React.memo(() => {
  /** プロフィール画像の参照 Ref */
  const ref = useRef<HTMLDivElement | null>(null);

  /** プロフィール画像コンテナーのクラス名 */
  const classNames = cn(s.profile_image_container, 'image_container');

  /** プロフィール画像の ID */
  const imageId = 'profile-image';
  /** プロフィール画像のファイルパス */
  const imageFilePath = '/images/siron/siron.webp';

  useEffect(() => {
    if (!ref.current) return;

    /** プロフィール画像のアニメーションコンテキスト */
    const ctx = profileImageAnimation({
      image: ref.current.querySelector(`#${imageId}`) as HTMLImageElement,
      profileImageRef: ref,
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className={classNames} ref={ref}>
      <Image
        src={imageFilePath}
        alt="profile image"
        className={s.profile_image}
        id={imageId}
        fill
        quality={100}
        placeholder="blur"
        blurDataURL={imageFilePath}
        sizes={'(max-width: 1024px) 90vw, (max-width: 768px) 50vw, 100vw'}
      />
    </div>
  );
});

ProfileImage.displayName = 'ProfileImage';

export default ProfileImage;
