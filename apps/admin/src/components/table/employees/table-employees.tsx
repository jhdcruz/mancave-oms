'use client';

import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

import { DataTable } from '@/components/table/data-table';
import { employeeColumns } from '@/components/table/employees/table-employees-columns';
import { DataTableEmployeesToolbar } from '@/components/table/employees/table-employees-toolbar';

export default function TableEmployees() {
  const { data: employees, isLoading } = useSWR('/admin/api?q=employees');
  const { data: count } = useSWR('/admin/api?count=true');

  const employeesData = employees?.data ?? [];
  const totalCount = count?.count ?? 0;

  return (
    <>
      {isLoading ? (
        <div className="mt-5 flex w-full flex-col items-center justify-center p-5">
          <Loader2 className="animate-spin" size={24} />
          <p className="my-3 text-sm text-muted-foreground">
            Preparing list of employees...
          </p>
        </div>
      ) : (
        <DataTable
          columns={employeeColumns}
          data={employeesData}
          count={totalCount}
          toolbar={{ component: DataTableEmployeesToolbar }}
        />
      )}
    </>
  );
}
