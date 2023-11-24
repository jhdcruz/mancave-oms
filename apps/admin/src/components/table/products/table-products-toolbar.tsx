'use client';

import { FormEvent, useState } from 'react';
import { Plus, X } from 'lucide-react';

import { Button } from '@mcsph/ui/components/button';
import { Input } from '@mcsph/ui/components/input';

import { DialogProduct } from '@/components/dialog/dialog-product';

import { DataTableFacetedFilter } from '../data-table-faceted-filter';
import { DataTableViewOptions } from '../data-table-view-options';
import { states, stocks } from './table-products-filters';
import type { DataTableToolbarProps } from '../data-table-props';

import { browserClient } from '@mcsph/supabase/lib/client';
import { createProduct } from '@mcsph/supabase/ops/products';
import { Separator } from '@mcsph/ui/components/separator';
import { redirect, RedirectType } from 'next/navigation';
import { useLogger } from 'next-axiom';

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const log = useLogger();

  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;

  const addProduct = async (formEvent: FormEvent) => {
    formEvent.preventDefault();

    setLoading(true);

    const supabase = browserClient();
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      // if it gets to this point (which is not supposed to),
      // cookie probably expired or something tampered with it
      log.info('Session data not found');
      return redirect('/login', RedirectType.replace);
    }

    const formData = new FormData(formEvent.target as HTMLFormElement);

    // include who updated the product
    formData.append('last_updated_by', data.session.user.id);

    const { error } = await createProduct(formData, { supabase });

    if (error) {
      log.error('Error saving products', { error });
      await log.flush();
    }

    setLoading(false);
    setDialog(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="block w-full items-center md:flex md:w-auto md:flex-1 md:space-x-2">
        <Input
          placeholder="Filter products..."
          value={
            ((table.getColumn('name')?.getFilterValue() as string) ?? '') ||
            ((table.getColumn('sku')?.getFilterValue() as string) ?? '')
          }
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="w-full md:w-[250px] lg:w-[300px]"
        />

        <Button
          className="my-3 w-full md:my-0 md:w-max"
          onClick={() => setDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>

        <Separator
          orientation="vertical"
          className="ml-4 hidden h-8 md:block"
        />

        {dialog && (
          <DialogProduct
            save={(details) => addProduct(details)}
            open={dialog}
            setOpen={setDialog}
            loading={loading}
          />
        )}

        <span className="mr-2 text-sm text-muted-foreground">Filters:</span>

        {/* Allow filtering between product states*/}
        {table.getColumn('published') && (
          <DataTableFacetedFilter
            column={table.getColumn('published')}
            title="Status"
            options={states}
          />
        )}

        {/* Allow filtering between stocks */}
        {table.getColumn('qty') && (
          <DataTableFacetedFilter
            column={table.getColumn('qty')}
            title="Stocks"
            options={stocks}
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