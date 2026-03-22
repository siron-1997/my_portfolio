import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { WorkSummary } from '@/types/api';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  const limitParam = req.nextUrl.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  let query = supabase.from('v_works').select('*');
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 各行の image_url を署名付き URL に変換する
  const signedData: WorkSummary[] = await Promise.all(
    data.map(async (row) => {
      if (!row.image_url) return row;

      // `image_url` からパス部分を抽出
      const path = row.image_url.split('/portfolio-works/')[1];
      if (!path) return row;

      const { data: signed, error: signErr } = await supabase.storage
        .from('portfolio-works')
        .createSignedUrl(path, 60 * 60); // 1時間有効

      if (signErr || !signed) return row;

      return {
        ...row,
        image_url: signed.signedUrl, // 有効なURLに差し替え
      };
    }),
  );

  return NextResponse.json(signedData);
}
