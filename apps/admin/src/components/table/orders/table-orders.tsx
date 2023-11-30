'use client';

import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

import { DataTable } from '@/components/table/data-table';
import { orderColumns } from '@/components/table/orders/table-orders-columns';
import { DataTableOrdersToolbar } from '@/components/table/orders/table-orders-toolbar';

export default function TableOrders() {
  const { data: orders, isLoading } = useSWR('/orders/api');
  const { data: count } = useSWR('/orders/api?count=true');

  const ordersData = orders?.data ?? [];
  const totalCount = count?.count ?? 0;

  return (
    <>
      {isLoading ? (
        <div className="mt-5 flex w-full flex-col items-center justify-center p-5">
          <Loader2 className="animate-spin" size={24} />
          <p className="my-3 text-sm text-muted-foreground">
            Preparing list of orders in inventory...
          </p>
        </div>
      ) : (
        <DataTable
          columns={orderColumns}
          data={ordersData}
          count={totalCount}
          toolbar={{ component: DataTableOrdersToolbar }}
        />
      )}
    </>
  );
}
