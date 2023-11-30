'use client';

import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

import { DataTable } from '@/components/table/data-table';
import { productColumns } from '@/components/table/products/table-products-columns';
import { DataTableProductsToolbar } from '@/components/table/products/table-products-toolbar';

export default function TableProducts() {
  const { data: products, isLoading } = useSWR('/inventory/api');
  const { data: count } = useSWR('/inventory/api?count=true');

  const productsData = products?.data ?? [];
  const totalCount = count?.count ?? 0;

  return (
    <>
      {isLoading ? (
        <div className="mt-5 flex w-full flex-col items-center justify-center p-5">
          <Loader2 className="animate-spin" size={24} />
          <p className="my-3 text-sm text-muted-foreground">
            Preparing list of products in inventory...
          </p>
        </div>
      ) : (
        <DataTable
          columns={productColumns}
          data={productsData}
          count={totalCount}
          toolbar={{ component: DataTableProductsToolbar }}
        />
      )}
    </>
  );
}
