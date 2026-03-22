'use client';

import Image from 'next/image';
import useProfileImage from './useProfileImage';
import s from '@/styles/about/ProfileImage.module.css';

const ProfileImage = () => {
  const { profileImageRef, imageClassNames, imageId, imageFilePath } = useProfileImage();

  return (
    <div className={imageClassNames} ref={profileImageRef}>
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
};

export default ProfileImage;
