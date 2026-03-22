import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { WorkDetail } from '@/types/api';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  // URL から slug を取得
  const { pathname } = req.nextUrl;
  const slug = pathname.split('/').pop();

  console.log('API called with slug:', slug);

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('v_work_detail')
    .select('*')
    .eq('key', slug);

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 各行の model_url を署名付き URL に変換する
  const signedData: WorkDetail[] = await Promise.all(
    data.map(async (row) => {
      if (!row.model_url) return row;

      // `model_url` からパス部分を抽出
      const path = row.model_url.split('/portfolio-works/')[1];
      if (!path) return row;

      const { data: signed, error: signErr } = await supabase.storage
        .from('portfolio-works')
        .createSignedUrl(path, 60 * 60); // 1時間有効

      if (signErr || !signed) {
        console.error('signErr:', signErr, 'path:', path);
        return row;
      }

      return {
        ...row,
        model_url: signed.signedUrl, // 有効なURLに差し替え
      };
    }),
  );

  return NextResponse.json(signedData);
}
