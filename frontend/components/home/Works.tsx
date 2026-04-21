'use client';

import React, { type JSX, useEffect, useRef } from 'react';
import Link from 'next/link';

import { CardActions, Typography } from '@mui/material';
import cn from 'classnames';

import { worksAnimation } from '@/animations/home';
import { Card, Container } from '@/components/common';
import { HOME_WORKS_LEARN_MORE, HOME_WORKS_TITLE } from '@/constants/home';
import s from '@/styles/home.module.css';
import { type WorkSummary } from '@/types/api';
import { truncateString } from '@/utils';

type Props = {
  /** ホームページに表示する作品データの配列 */
  data: WorkSummary[];
};

const Works = React.memo(({ data }: Props): JSX.Element => {
  /** Works セクションの参照 Ref */
  const ref = useRef<HTMLElement | null>(null);

  const rootClassNames = cn('root_container', s.works);

  useEffect(() => {
    if (!ref.current) return;

    /** Works セクションのアニメーションを初期化 */
    const ctx = worksAnimation({
      title: ref.current.querySelector('#works-title')!,
      cards: ref.current.querySelector('#works-cards')!,
      worksRef: ref,
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className={rootClassNames}>
      <Container>
        <section ref={ref}>
          {/* タイトル */}
          <h1 id="works-title">{HOME_WORKS_TITLE}</h1>

          {/* 作品カードのリスト */}
          <div className={s.contents} id="works-cards">
            {data.map((item: WorkSummary) => (
              <Card
                key={item.category_key}
                image={item.image_url}
                alt={item.alternative_text}
                link={`works/${item.slug}`}
                title={item.title}
                description={truncateString(item.description, 50)}
                categoryType={item.category_name}
                type="home"
              />
            ))}
          </div>

          {/* Learn More ボタン (Works ページに移動) */}
          <CardActions className={s.move}>
            <Link href="/works">
              <Typography
                variant="navigation"
                sx={{ fontSize: { xs: 18, sm: 20 }, fontWeight: 700 }}
              >
                {HOME_WORKS_LEARN_MORE}
              </Typography>
            </Link>
          </CardActions>
        </section>
      </Container>
    </div>
  );
});

Works.displayName = 'Works';

export default Works;
