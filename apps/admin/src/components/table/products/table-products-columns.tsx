'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency, formatDate } from '@mcsph/utils/lib/format';

import { Badge } from '@mcsph/ui/components/badge';

import { DataTableColumnHeader } from '../data-table-column-header';
import { TableProductsRowActions } from './table-products-row-actions';
import type { Products } from './table-products-schema';

/**
 * The `filterFn` is used for filtering, where `value`
 * refers to the key set in `table-products-column`,
 * that is to be selected in `table-products-toolbar`
 */

export const productColumns: ColumnDef<Products>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader className="hidden" column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="hidden">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, id, value) => {
      const sku = row.getValue('sku') as string;
      const name = row.getValue('name') as string;
      const type = row.getValue('type') as string;

      // allow case-insensitive search for sku and type
      // and continue to allow case-insensitive search
      // with splitting for name,
      return (
        sku.toLowerCase().includes(value.toLowerCase()) ||
        name
          .toLowerCase()
          .split(' ')
          .some((word) => word.includes(value.toLowerCase())) ||
        type.toLowerCase().includes(value.toLowerCase())
      );
    },
  },
  {
    accessorKey: 'sku',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    cell: ({ row }) => <div className="w-[110px]">{row.getValue('sku')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] truncate font-medium">
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] items-center">
        <span>{row.getValue('type')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'qty',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qty." />
    ),
    cell: ({ row }) => {
      const qty = parseInt(row.getValue('qty'));

      const qtyVariant = qty <= 10 ? 'destructive' : 'secondary';

      return (
        <div className="w-[80px]">
          <Badge variant={qtyVariant}>{qty}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const qty = parseInt(row.getValue(id));

      // filter quantity based on key
      switch (true) {
        case value.includes('over'):
          return qty > 25;
        case value.includes('low'):
          return qty <= 10;
        case value.includes('out'):
          return qty == 0;
        default:
          return value.includes(row.getValue(id));
      }
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Listed Price" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[50px]">
          <Badge variant="secondary">
            {formatCurrency(row.getValue('price') as number)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'last_updated',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex">{formatDate(row.getValue('last_updated'))}</div>
      );
    },
  },
  {
    accessorKey: 'published',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      const state = row.getValue('published');

      const stateVariant = state === true ? 'outline' : 'default';
      const stateDisplay = state === true ? 'Published' : 'Hidden';

      return (
        <div className="flex items-center">
          <Badge className="text-sm" variant={stateVariant}>
            {stateDisplay}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <TableProductsRowActions row={row} />,
  },
];
