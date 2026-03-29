import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

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

  /** model_url はプロキシ経由で配信するためレスポンスから除去する */
  const responseData = data.map(({ model_url: _removed, ...row }) => row);

  return NextResponse.json(responseData);
}
