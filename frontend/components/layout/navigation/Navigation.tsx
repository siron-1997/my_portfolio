'use client';

import Link from 'next/link';
import { Typography } from '@mui/material';
import { SITE_MAP } from '@/constants/common';
import useNavigation from './useNavigation';
import s from '@/styles/layout/Navigation.module.css';

type Props = {
  className?: string;
  closeDrawer?: () => void;
};

const Navigation = ({ className, closeDrawer }: Props) => {
  const { classNames, handleClick } = useNavigation({ className, closeDrawer });

  return (
    <nav className={classNames}>
      <ul>
        {SITE_MAP.map((item, i) => (
          <li key={i}>
            <Link href={item.href} onClick={handleClick} className={s.link}>
              <Typography component="p" variant="p">
                {item.title}
              </Typography>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
