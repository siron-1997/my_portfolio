import { GetWorksParams, WorkSummary, WorkCategory } from '@/types/api';

/** ポートフォリオ作品一覧を取得する */
export async function getWorks({ limit }: GetWorksParams = {}): Promise<WorkSummary[]> {
  try {
    const url = new URL(`${process.env.BASE_URL}/api/supabase/works`);
    if (limit) {
      url.searchParams.set('limit', limit.toString());
    }
    const res = await fetch(url.toString(), {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Failed to fetch works data:', res.statusText);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch works data:', error);
    return [];
  }
}

/** 作品カテゴリ一覧を取得する */
export async function getWorkCategories(): Promise<WorkCategory[]> {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/supabase/work-categories`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Failed to fetch work categories:', res.statusText);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch work categories:', error);
    return [];
  }
}
