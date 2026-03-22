import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { PageHeader } from '@/components/common';
import { Loading } from '@/components/works/workThreeD';
import { WorkWorld } from '@/components/world/work';
import { Controls, Introduction, Portal } from '@/components/works/workThreeD';
import { WorkThreeDProvider } from '@/contexts';
import { WorkDetail } from '@/types/api';
import s from '@/styles/works/workThreeD/index.module.css';
import '@/styles/works/workThreeD/index.css';

async function getWorkDetail(slug: string) {
  const res = await fetch(`${process.env.BASE_URL}/api/supabase/work-detail/3d/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch data');
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

  // 存在しない slug の場合は、works にリダイレクト
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
