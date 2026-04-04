'use client';

import React, { useRef } from 'react';

import { Card } from '@/components/common';
import { WorkSummary } from '@/types/api';
import { truncateString } from '@/utils';
import { useContents } from './useContents';
import s from '@/styles/works/Contents.module.css';

/** Props の型定義 */
type Props = {
  /** data */
  data: WorkSummary[];
};

const Contents = React.memo(({ data }: Props) => {
  /** コンテンツの参照 */
  const ref = useRef<HTMLDivElement | null>(null);

  const { contentsRef, selectedWorks } = useContents({ data });

  return (
    <div className={s.contents} ref={ref}>
      {selectedWorks.map((work: WorkSummary, i: number) => (
        <Card
          key={i}
          image={work.image_url}
          alt={work.alternative_text}
          link={`works/${work.slug}`}
          title={work.title}
          description={truncateString(work.description, 50)}
          categoryType={work.category_name}
          type="work"
        />
      ))}
    </div>
  );
});

Contents.displayName = 'Contents';

export default Contents;
