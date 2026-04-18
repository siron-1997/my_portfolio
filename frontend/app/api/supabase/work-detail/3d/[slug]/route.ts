import { type NextRequest, NextResponse } from 'next/server';

import { IS_DEV } from '@/constants/common';
import { supabase } from '@/services/supabase';

export async function GET(req: NextRequest) {
  /** URL から slug を取得 */
  const { pathname } = req.nextUrl;
  const slug = pathname.split('/').pop();

  if (IS_DEV) {
    console.info('API called with slug:', slug);
  }

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('v_work_detail')
    .select('*')
    .eq('key', slug);

  if (error) {
    if (IS_DEV) {
      console.error('Supabase error:', error);
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }

  /** model_url はプロキシ経由で配信するためレスポンスから除去する */
  const responseData = data.map(({ model_url: _removed, ...row }) => row);

  return NextResponse.json(responseData);
}
