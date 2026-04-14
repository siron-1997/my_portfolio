'use client';

import { Typography } from '@mui/material';

import s from '@/styles/common/button/Toggle.module.css';

import useToggleButton from './useToggleButton';

export const ToggleButton = () => {
  const {
    bgRef,
    toggleButtonRef,
    isViewerActive,
    leftButtonClassNames,
    rightButtonClassNames,
    textStyle,
    handleClick,
  } = useToggleButton();

  return (
    <div
      ref={toggleButtonRef}
      className={s.toggle}
      id="toggle-button"
      style={{ marginTop: isViewerActive ? 'auto' : '0' }}
    >
      <div className={s.bg} ref={bgRef} />
      <div className={leftButtonClassNames}>
        <Typography
          id="start"
          component="span"
          sx={textStyle}
          onClick={() => handleClick(true)}
        >
          Start
        </Typography>
      </div>
      <div className={rightButtonClassNames}>
        <Typography
          id="end"
          component="span"
          sx={textStyle}
          onClick={() => handleClick(false)}
        >
          End
        </Typography>
      </div>
    </div>
  );
};
