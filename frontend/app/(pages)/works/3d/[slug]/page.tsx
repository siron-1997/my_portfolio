import '@/styles/workThreeDGlobal.css';

import { redirect } from 'next/navigation';

import WorkThreeDClient from '@/components/works/workThreeD/WorkThreeDClient';
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

  return <WorkThreeDClient content={content} />;
}
