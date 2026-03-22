'use client';

import Image from 'next/image';
import { Typography } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import s from '@/styles/works/workThreeD/FingerPress.module.css';
import useFingerPress from './useFingerPress';

const FingerPress = () => {
  const {
    fingerPressRef,
    imageRef,
    textRef,
    isFingerVisible,
    setIsFingerVisible,
    isViewerActive,
    iconSize,
  } = useFingerPress();

  return (
    <div className={s.finger_press} id="finger-press" ref={fingerPressRef}>
      {isViewerActive ? (
        <Image
          ref={imageRef}
          src="/icons/finger_press_48x48.svg"
          alt="finger press"
          width={iconSize}
          height={iconSize}
          quality={1}
          onMouseDown={() => setIsFingerVisible(false)}
          onTouchStart={() => setIsFingerVisible(false)}
          style={{ display: !isFingerVisible ? 'none' : 'block' }}
        />
      ) : (
        <Typography component="p" sx={{ fontWeight: 600 }} ref={textRef}>
          「Start」をタップすると3Dビュワーモードが開始します。
          <br />
          <KeyboardArrowDown sx={{ width: 45, height: 45 }} />
        </Typography>
      )}
    </div>
  );
};

export default FingerPress;
