'use client';

import { FormEvent, useEffect, useState } from 'react';
import { redirect, useSearchParams, RedirectType } from 'next/navigation';
import { useLogger } from 'next-axiom';
import { useSWRConfig } from 'swr';
import { Plus, X } from 'lucide-react';

import { Button } from '@mcsph/ui/components/button';
import { Input } from '@mcsph/ui/components/input';
import { Separator } from '@mcsph/ui/components/separator';

import { DataTableFacetedFilter } from '../data-table-faceted-filter';
import { DataTableViewOptions } from '../data-table-view-options';
import type { DataTableToolbarProps } from '../data-table-props';

import { browserClient } from '@mcsph/supabase/lib/client';
import { DialogOrder } from '@/components/dialog/dialog-order';
import {
  orderStatuses,
  payment,
} from '@/components/table/orders/table-orders-filter';

export function DataTableOrdersToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const log = useLogger();
  const { mutate } = useSWRConfig();

  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;

  const searchParams = useSearchParams();

  const addOrder = async (formEvent: FormEvent) => {
    formEvent.preventDefault();

    setLoading(true);

    const supabase = browserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // if it gets to this point (which is not supposed to),
      // cookie probably expired or something tampered with it
      log.info('Session data not found');
      return redirect('/login', RedirectType.replace);
    }

    const formData = new FormData(formEvent.target as HTMLFormElement);

    // include who updated the product
    formData.append('last_updated_by', session.user.id);

    await mutate('/orders/api');

    setLoading(false);
    setDialog(false);
  };

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
          value={
            ((table.getColumn('id')?.getFilterValue() as string) ?? '') ||
            ((table.getColumn('full_name')?.getFilterValue() as string) ??
              '') ||
            ((table.getColumn('created_at')?.getFilterValue() as string) ?? '')
          }
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

        {dialog && (
          <DialogOrder
            save={(details) => addOrder(details)}
            open={dialog}
            setOpen={setDialog}
            loading={loading}
          />
        )}

        <span className="mr-2 text-sm text-muted-foreground">Filters:</span>

        {/* Allow filtering between product states*/}
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
