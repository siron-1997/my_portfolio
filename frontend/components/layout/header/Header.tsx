'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Drawer from 'react-modern-drawer';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Container } from '@/components/common';
import { Hamburger } from '@/components/common';
import { Navigation } from '@/components/layout/navigation';
import { BREAK_POINTS } from '@/constants/common';
import useHeader from './useHeader';
import s from '@/styles/layout/Header.module.css';
import 'react-modern-drawer/dist/index.css';

const Header = () => {
  const { width, iconSize, isOpen, toggleDrawer, closeDrawer } = useHeader();

  return (
    <header className={s.header}>
      <Container>
        <div className={s.header_row}>
          <Link href="/">
            <div className={s.logo}>
              <Image src="/icons/logo.svg" alt="Logo" priority quality={1} fill />
            </div>
          </Link>
          {/* widthが未定義の間は何も表示しない */}
          {width !== undefined && (
            <>
              {/* モバイル・タブレットの場合はハンバーガーメニューを表示 */}
              {width > BREAK_POINTS.SM ? (
                <Navigation />
              ) : (
                <Hamburger iconSize={iconSize} onOpen={toggleDrawer} />
              )}
            </>
          )}
        </div>
      </Container>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        size={width && width > BREAK_POINTS.XS ? 400 : 300}
        lockBackgroundScroll={true}
        customIdSuffix="drawer"
      >
        <div className={s.drawer_header}>
          <IconButton aria-label="Close drawer" onClick={closeDrawer}>
            <Close
              sx={{
                width: iconSize / 1.5,
                height: iconSize / 1.5,
                color: 'var(--navigation)',
              }}
            />
          </IconButton>
        </div>
        <Navigation closeDrawer={closeDrawer} />
      </Drawer>
    </header>
  );
};

export default Header;
