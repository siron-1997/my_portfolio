'use client';

import React, { useEffect, useMemo, useRef } from 'react';

import { contentsAnimation } from '@/animations/works';
import { Card } from '@/components/common';
import {
  WORKS_CONTENT_ITEM_CLASS,
  WORKS_DESCRIPTION_TRUNCATE_LENGTH,
  WORKS_LINK_PREFIX,
} from '@/constants/works';
import s from '@/styles/works.module.css';
import { type WorkCategory, type WorkSummary } from '@/types/api';
import { truncateString } from '@/utils';

type Props = {
  /** 作品一覧で表示するサマリーデータ */
  data: WorkSummary[];

  /** 選択されたカテゴリの状態管理 */
  selectedCategories: WorkCategory[];
};

const Contents = React.memo(({ data, selectedCategories }: Props) => {
  /** コンテンツの参照 Ref */
  const ref = useRef<HTMLDivElement | null>(null);

  /** 選択された作品のリスト */
  const selectedWorks = useMemo(() => {
    /** カテゴリ未選択時は全件返す */
    if (selectedCategories.length === 0) return data;

    /** 選択中カテゴリキーの Set で O(1) ルックアップ */
    const selectedKeys = new Set(selectedCategories.map((c) => c.key));

    return data.filter((work) => selectedKeys.has(work.category_key));
  }, [data, selectedCategories]);

  useEffect(() => {
    if (!ref.current) return;

    /** コンテンツのアニメーションを初期化 */
    const ctx = contentsAnimation({
      contentItems: ref.current.querySelectorAll<HTMLElement>(
        `.${WORKS_CONTENT_ITEM_CLASS}`,
      ),
      ref,
    });

    return () => {
      ctx.revert();
    };
  }, [selectedWorks]);

  return (
    <div className={s.contents} ref={ref}>
      {selectedWorks.map((work: WorkSummary) => (
        <Card
          key={work.slug}
          image={work.image_url}
          alt={work.alternative_text}
          link={`${WORKS_LINK_PREFIX}${work.slug}`}
          title={work.title}
          description={truncateString(
            work.description,
            WORKS_DESCRIPTION_TRUNCATE_LENGTH,
          )}
          categoryType={work.category_name}
          type="work"
        />
      ))}
    </div>
  );
});

Contents.displayName = 'Contents';

export default Contents;
