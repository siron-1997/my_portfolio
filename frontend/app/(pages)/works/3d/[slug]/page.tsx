import '@/styles/works/workThreeD/index.css';

import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { PageHeader } from '@/components/common';
import { Loading } from '@/components/works/workThreeD';
import { Controls, Introduction, Portal } from '@/components/works/workThreeD';
import { WorkWorld } from '@/components/world/work';
import { WorkThreeDProvider } from '@/contexts';
import s from '@/styles/works/workThreeD/index.module.css';
import { type WorkDetail } from '@/types/api';

async function getWorkDetail(slug: string) {
  const res = await fetch(
    `${process.env.BASE_URL}/api/supabase/work-detail/3d/${slug}`,
    {
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch work details: ${res.status} ${res.statusText}`,
    );
  }
  const data = await res.json();

  return data;
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await getWorkDetail(slug);
  const content = data.find((item: WorkDetail) => item.slug === `3d/${slug}`);

  /** 存在しない slug の場合は works にリダイレクト */
  if (!content) {
    redirect('/works');
  }

  return (
    <WorkThreeDProvider>
      <Suspense fallback={<Loading />}>
        <WorkWorld content={content} />
      </Suspense>
      <PageHeader
        id="3d-page-header"
        figureClassName={s.figure}
        figcaptionClassName={s.figcaption}
      >
        <Portal content={content} />
      </PageHeader>
      <Introduction content={content} />
      <Controls content={content} />
    </WorkThreeDProvider>
  );
}
