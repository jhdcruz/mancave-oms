'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@mcsph/utils';

import { Badge } from '@mcsph/ui/components/badge';

import { DataTableColumnHeader } from '../data-table-column-header';
import { TableProductsRowActions } from './table-products-row-actions';
import type { Products } from './table-products-schema';

export const productColumns: ColumnDef<Products>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader className="hidden" column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="hidden w-[80px]">{row.getValue('id')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'sku',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('sku')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[150px] truncate font-medium">
        {row.getValue('name')}
      </span>
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[200px] items-center">
        <span>{row.getValue('type')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'qty',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const qty = parseInt(row.getValue('qty'));

      const qtyVariant = qty <= 10 ? 'destructive' : 'secondary';

      return (
        <div className="flex items-center">
          <Badge variant={qtyVariant}>{qty}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
    accessorKey: 'disabled',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      const state = row.getValue('disabled');

      const stateVariant = state == 'true' ? 'default' : 'outline';
      const stateDisplay = state == 'true' ? 'Hidden' : 'Published';

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
