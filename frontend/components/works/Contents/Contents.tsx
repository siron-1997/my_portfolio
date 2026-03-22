'use client';

import { Card } from '@/components/common';
import { WorkSummary } from '@/types/api';
import { truncateString } from '@/utils';
import { useContents } from './useContents';
import s from '@/styles/works/Contents.module.css';

type Props = {
  data: WorkSummary[];
};

const Contents = ({ data }: Props) => {
  const { contentsRef, selectedWorks } = useContents({ data });

  return (
    <div className={s.contents} ref={contentsRef}>
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
};

export default Contents;
