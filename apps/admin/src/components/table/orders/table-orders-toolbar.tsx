'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, X } from 'lucide-react';

import { Button } from '@mcsph/ui/components/button';
import { Input } from '@mcsph/ui/components/input';
import { Separator } from '@mcsph/ui/components/separator';

import { DialogOrder } from '@/components/dialog/dialog-order';
import {
  orderDue,
  orderStatuses,
  payment,
} from '@/components/table/orders/table-orders-filter';

import { DataTableFacetedFilter } from '../data-table-faceted-filter';
import { DataTableViewOptions } from '../data-table-view-options';
import type { DataTableToolbarProps } from '../data-table-props';

export function DataTableOrdersToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [dialog, setDialog] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;

  const searchParams = useSearchParams();

  useEffect(() => {
    // handles the new product action in command bar
    if (searchParams.get('action') === 'new') {
      setDialog(true);
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-between">
      <div className="block w-full items-center md:flex md:w-auto md:flex-1 md:space-x-2">
        <Input
          placeholder="Filter orders..."
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('id')?.setFilterValue(event.target.value)
          }
          className="w-full md:w-[250px] lg:w-[300px]"
        />

        <Button
          className="my-3 w-full md:my-0 md:w-max"
          onClick={() => setDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>

        <Separator
          orientation="vertical"
          className="ml-4 hidden h-8 md:block"
        />

        {dialog && <DialogOrder open={dialog} setOpen={setDialog} />}

        <span className="mr-2 text-sm text-muted-foreground">Filters:</span>

        {table.getColumn('created_at') && (
          <DataTableFacetedFilter
            column={table.getColumn('created_at')}
            title="Order"
            options={orderDue}
          />
        )}

        {table.getColumn('order_status') && (
          <DataTableFacetedFilter
            column={table.getColumn('order_status')}
            title="Status"
            options={orderStatuses}
          />
        )}

        {/* Allow filtering between stocks */}
        {table.getColumn('payment') && (
          <DataTableFacetedFilter
            column={table.getColumn('payment')}
            title="Payment"
            options={payment}
          />
        )}

        {/* Show a reset filter button, if filtered */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <br />

      <DataTableViewOptions table={table} />
    </div>
  );
}
