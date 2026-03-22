'use client';

import { Typography, type SxProps, type Theme } from '@mui/material';
import useNumberedCircled from './useNumberedCircled';

type Props = {
  index: number;
  sx: SxProps<Theme>;
  onClick: () => void;
  isNavigationVisible: boolean;
};

const NumberedCircled = ({ index, sx, onClick, isNavigationVisible }: Props) => {
  const { navigationRef } = useNumberedCircled(isNavigationVisible);

  return (
    <Typography
      component="span"
      ref={navigationRef}
      sx={{
        ...sx,
        display: isNavigationVisible ? 'block' : 'none',
        lineHeight: 1.2,
        letterSpacing: 1,
        borderRadius: 8,
        cursor: 'pointer',
        backgroundColor: 'rgb(0, 0, 0, 0.3)',
      }}
      onClick={onClick}
    >
      {index + 1}
    </Typography>
  );
};

export default NumberedCircled;
