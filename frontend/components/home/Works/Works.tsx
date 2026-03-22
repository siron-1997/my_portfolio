'use client';

import Link from 'next/link';
import { CardActions, Typography } from '@mui/material';
import { Card, Container } from '@/components/common';
import { WorkSummary } from '@/types/api';
import { truncateString } from '@/utils';
import useWorks from './useWorks';
import s from '@/styles/home/Works.module.css';

type Props = {
  data: WorkSummary[];
};

const Works = ({ data }: Props) => {
  const { worksRef, rootClassNames } = useWorks();

  return (
    <div className={rootClassNames}>
      <Container>
        <section ref={worksRef}>
          <h1 id="works-title">Works</h1>
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
          <CardActions className={s.move}>
            <Link href="/works">
              <Typography
                variant="navigation"
                sx={{ fontSize: { xs: 18, sm: 20, fontWeight: 700 } }}
              >
                Learn More &gt;
              </Typography>
            </Link>
          </CardActions>
        </section>
      </Container>
    </div>
  );
};

export default Works;
