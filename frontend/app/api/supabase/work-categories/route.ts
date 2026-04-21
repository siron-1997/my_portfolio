import { NextResponse } from 'next/server';

import { supabase } from '@/services/supabase';

/**
 * 作品カテゴリ一覧を取得するAPIエンドポイント
 * `v_work_categories` ビューから全カテゴリを取得して返す。
 *
 * @returns 作品カテゴリ一覧 JSON
 */
export async function GET() {
  /** Supabase クエリの作成 */
  const { data, error } = await supabase.from('v_work_categories').select('*');

  /** エラー発生 */
  if (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
