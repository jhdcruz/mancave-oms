'use client';

import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

import { DataTable } from '@/components/table/data-table';
import { customersColumn } from '@/components/table/customers/table-customers-columns';
import { DataTableCustomersToolbar } from '@/components/table/customers/table-customers-toolbar';

export default function TableCustomers() {
  const { data: customers, isLoading } = useSWR('/customers/api?q=customers');
  const { data: count } = useSWR('/customers/api?count=true');

  const customersData = customers?.data ?? [];
  const totalCount = count?.count ?? 0;

  return (
    <>
      {isLoading ? (
        <div className="mt-5 flex w-full flex-col items-center justify-center p-5">
          <Loader2 className="animate-spin" size={24} />
          <p className="my-3 text-sm text-muted-foreground">
            Preparing list of customers...
          </p>
        </div>
      ) : (
        <DataTable
          columns={customersColumn}
          data={customersData}
          count={totalCount}
          toolbar={{ component: DataTableCustomersToolbar }}
        />
      )}
    </>
  );
}
