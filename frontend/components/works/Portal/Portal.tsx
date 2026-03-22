'use client';

import { Typography } from '@mui/material';
import { usePortal } from './usePortal';

type Props = {
  title: string;
};

const Portal = ({ title }: Props) => {
  const { titleRef } = usePortal();

  return (
    <Typography ref={titleRef} variant="h1" style={{ textAlign: 'center' }}>
      {title}
    </Typography>
  );
};

export default Portal;
