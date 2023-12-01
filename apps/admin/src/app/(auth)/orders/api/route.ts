import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { type AxiomRequest, withAxiom } from 'next-axiom';

import { serverClient } from '@mcsph/supabase/lib/server';
import {
  getOrders,
  getOrderDetails,
  getTotalOrders,
} from '@mcsph/supabase/ops/orders';

export const GET = withAxiom(async (req: AxiomRequest) => {
  const requestUrl = new URL(req.url);

  // search params
  const count = requestUrl.searchParams.has('count');
  const orderDetails = requestUrl.searchParams.get('order');

  const cookieStore = cookies();
  const supabase = serverClient(cookieStore);

  // get only the total orders count
  if (count) {
    const { count } = await getTotalOrders({ supabase: supabase });
    return NextResponse.json({ count });
  }

  if (orderDetails) {
    const { data } = await getOrderDetails(orderDetails, {
      supabase: supabase,
    });
    return NextResponse.json({ data });
  }

  const { data } = await getOrders({ supabase: supabase });

  // URL to redirect to after sign in process completes
  return NextResponse.json({ data });
});
