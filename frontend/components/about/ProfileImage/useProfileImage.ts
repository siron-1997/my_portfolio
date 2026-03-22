import { useRef, useEffect } from 'react';
import cn from 'classnames';
import { profileImageAnimation } from '@/animations/about';
import s from '@/styles/about/ProfileImage.module.css';

const useProfileImage = () => {
  const profileImageRef = useRef<HTMLDivElement>(null!);
  const imageClassNames = cn(s.profile_image_container, 'image_container');
  const imageId = 'profile-image';
  const imageFilePath = '/images/siron/siron.webp';

  useEffect(() => {
    const profileImage = profileImageRef.current.querySelector(
      `#${imageId}`,
    ) as HTMLImageElement;
    const ctx = profileImageAnimation({ image: profileImage, profileImageRef });
    return () => {
      ctx.revert();
    };
  }, []);

  return {
    profileImageRef,
    imageClassNames,
    imageId,
    imageFilePath,
  };
};

export default useProfileImage;
