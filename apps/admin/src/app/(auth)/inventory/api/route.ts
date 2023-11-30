import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { type AxiomRequest, withAxiom } from 'next-axiom';

import { serverClient } from '@mcsph/supabase/lib/server';
import {
  getProductBySku,
  getProducts,
  getTotalProducts,
} from '@mcsph/supabase/ops/products';

export const GET = withAxiom(async (req: AxiomRequest) => {
  const requestUrl = new URL(req.url);

  // search params
  const count = requestUrl.searchParams.has('count');
  const productSku = requestUrl.searchParams.get('sku');

  const cookieStore = cookies();
  const supabase = serverClient(cookieStore);

  // FIXME: This should be separated per file...?
  //        the only reason I did this is...
  //        T I M E, jisas krayst.

  // get only the total product count
  if (count) {
    const { count } = await getTotalProducts({ supabase: supabase });
    return NextResponse.json({ count });
  }

  if (productSku) {
    const sku = parseInt(productSku);

    const { data } = await getProductBySku(sku, { supabase: supabase });
    return NextResponse.json({ data });
  }

  const { data } = await getProducts({ supabase: supabase });

  // URL to redirect to after sign in process completes
  return NextResponse.json({ data });
});
