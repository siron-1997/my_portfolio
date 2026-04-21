'use client';

import 'react-modern-drawer/dist/index.css';

import React, { type JSX, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Drawer from 'react-modern-drawer';

import { Container, Hamburger } from '@/components/common';
import { Navigation } from '@/components/layout';
import { BREAK_POINTS } from '@/constants/common';
import { useWindowSize } from '@/hooks';
import s from '@/styles/layout.module.css';

const Header = (): JSX.Element => {
  /** ドロワーの開閉状態 */
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /** ウィンドウ幅を取得 */
  const { width } = useWindowSize();

  /** ドロワーの開閉を切り替える */
  const toggleDrawer = useCallback((): void => {
    setIsOpen((prevState) => !prevState);
  }, []);

  /** ドロワーを閉じる */
  const closeDrawer = useCallback((): void => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    /** ウィンドウ幅が未定義またはSM未満の場合はスキップ */
    if (width === undefined || width < BREAK_POINTS.SM) {
      return;
    }
    /** ドロワーを閉じる */
    closeDrawer();
  }, [width, closeDrawer]);

  return (
    <header className={s.header}>
      <HeaderRow width={width} toggleDrawer={toggleDrawer} />

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
                width: 33,
                height: 33,
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

type HeaderRowProps = {
  /** ウィンドウ幅 */
  width: number;

  /** ドロワーの開閉を切り替える関数 */
  toggleDrawer: () => void;
};

const HeaderRow = React.memo(
  ({ width, toggleDrawer }: HeaderRowProps): JSX.Element => {
    return (
      <Container>
        <div className={s.header_row}>
          {/* ロゴ */}
          <Link href="/">
            <div className={s.logo}>
              <Image
                src="/icons/logo.svg"
                alt="Logo"
                priority
                quality={1}
                fill
              />
            </div>
          </Link>

          <>
            {/* モバイル・タブレットの場合はハンバーガーメニューを表示 */}
            {width > BREAK_POINTS.SM ? (
              <Navigation />
            ) : (
              <Hamburger onOpen={toggleDrawer} />
            )}
          </>
        </div>
      </Container>
    );
  },
);

HeaderRow.displayName = 'HeaderRow';

export default Header;
