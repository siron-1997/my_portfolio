'use client';

import { Typography } from '@mui/material';
import { usePortal } from './usePortal';

type Props = {
  title: string;
};

const Portal = ({ title }: Props) => {
  const { titleRef } = usePortal();

  return (
    <Typography
      component="h1"
      variant="h1"
      ref={titleRef}
      sx={{ textAlign: 'center', width: '100%' }}
    >
      {title}
    </Typography>
  );
};

export default Portal;
