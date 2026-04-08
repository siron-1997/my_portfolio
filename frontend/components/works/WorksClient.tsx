'use client';

import React, { useState } from 'react';

import CategoryFilter from '@/components/works/CategoryFilter';
import Contents from '@/components/works/Contents';
import { WorkCategory, WorkSummary } from '@/types/api';

type Props = {
  /** 作品一覧で表示するサマリーデータ */
  worksDatum: WorkSummary[];

  /** 作品一覧で表示するカテゴリデータ */
  workCategoriesDatum: WorkCategory[];
};

const WorksClient = React.memo(({ worksDatum, workCategoriesDatum }: Props) => {
  /** 選択されたカテゴリの状態管理 */
  const [selectedCategories, setSelectedCategories] = useState<WorkCategory[]>([]);

  return (
    <>
      {/* カテゴリフィルター */}
      <CategoryFilter
        data={workCategoriesDatum}
        setSelectedCategories={setSelectedCategories}
      />
      {/* コンテンツ表示 */}
      <Contents data={worksDatum} selectedCategories={selectedCategories} />
    </>
  );
});

WorksClient.displayName = 'WorksClient';

export default WorksClient;
