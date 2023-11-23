'use client';

import { X } from 'lucide-react';

import { Button } from '@mcsph/ui/components/button';
import { Input } from '@mcsph/ui/components/input';

import { DataTableFacetedFilter } from '../data-table-faceted-filter';
import { DataTableViewOptions } from '../data-table-view-options';
import type { DataTableToolbarProps } from '../data-table-props';

import { states } from './table-products-filters';

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter products..."
          value={
            ((table.getColumn('name')?.getFilterValue() as string) ?? '') ||
            ((table.getColumn('sku')?.getFilterValue() as string) ?? '')
          }
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* Allow filtering between product states*/}
        {table.getColumn('disabled') && (
          <DataTableFacetedFilter
            column={table.getColumn('disabled')}
            title="Status"
            options={states}
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

      <DataTableViewOptions table={table} />
    </div>
  );
}
