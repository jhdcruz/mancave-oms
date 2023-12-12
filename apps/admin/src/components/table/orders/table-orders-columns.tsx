'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency, formatDate } from '@mcsph/utils/lib/format';

import { Badge } from '@mcsph/ui/components/badge';
import { cn } from '@mcsph/utils';

import { DataTableColumnHeader } from '../data-table-column-header';
import { TableOrdersRowActions } from './table-orders-row-actions';
import type { Orders } from './table-orders-schema';

/**
 * The `filterFn` is used for filtering, where `value`
 * refers to the key set in `table-products-column`,
 * that is to be selected in `table-products-toolbar`
 */

export const orderColumns: ColumnDef<Orders>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ref. #" />
    ),
    cell: ({ row }) => (
      <div className="w-[160px] truncate font-semibold text-muted-foreground">
        {row.getValue('id')}
      </div>
    ),
    enableSorting: false,
    filterFn: (row, id, value) => {
      const orderId = row.getValue('id') as string;
      const customer = row.original.customers.full_name as string;

      // allow case-insensitive search and search between split words
      return (
        orderId.toLowerCase().includes(value.toLowerCase()) ||
        customer
          .toLowerCase()
          .split(' ')
          .some((word) => word.includes(value.toLowerCase()))
      );
    },
  },
  {
    accessorKey: 'customers.full_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <div className="w-[160px]">{row.original.customers.full_name}</div>
    ),
  },
  {
    accessorKey: 'payment',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Type" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="w-[50px] capitalize">
        {row.getValue('payment')}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'total_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] items-center">
        <span>{formatCurrency(parseInt(row.getValue('total_price')))}</span>
      </div>
    ),
  },
  {
    accessorKey: 'order_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('order_status') as string;

      let statusVariant;

      switch (status) {
        case 'Processing':
          statusVariant = 'bg-slate-500';
          break;
        case 'Packed':
          statusVariant = 'bg-orange-500';
          break;
        case 'Shipped':
          statusVariant = 'bg-blue-500';
          break;
        case 'Fulfilled':
          statusVariant = 'bg-green-500';
          break;
        case 'Return Request':
          statusVariant = 'bg-red-500';
          break;
        case 'Returned':
          statusVariant = 'bg-purple-500';
          break;
        default:
          statusVariant = 'bg-stone-500';
          break;
      }

      return (
        <div className="w-max">
          <Badge className={statusVariant}>{status}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex">{formatDate(row.getValue('created_at'))}</div>
      );
    },
    filterFn: (row, id, value) => {
      const nonFulfilledStatuses = [
        'Processing',
        'Packed',
        'Shipped',
        'Return Request',
      ];

      const ignored = nonFulfilledStatuses.includes(
        row.getValue('order_status'),
      );

      const currentDate = new Date();
      const oneDayAgo = new Date(
        currentDate.setDate(currentDate.getDate() - 1),
      );
      const threeDaysAgo = new Date(
        currentDate.setDate(currentDate.getDate() - 3),
      );
      const sevenDaysAgo = new Date(
        currentDate.setDate(currentDate.getDate() - 7),
      );
      const thirtyDaysAgo = new Date(
        currentDate.setDate(currentDate.getDate() - 30),
      );

      const rowDate = new Date(row.getValue(id));

      switch (true) {
        // filter items created within 24 hours
        case value.includes('recent') && ignored:
          return rowDate >= oneDayAgo;
        // filter items created within 3 days but not within 24 hours
        case value.includes('3d') && ignored:
          return rowDate < oneDayAgo && rowDate >= threeDaysAgo;
        // filter items created within 7 days but not within 3 days
        case value.includes('7d') && ignored:
          return rowDate < threeDaysAgo && rowDate >= sevenDaysAgo;
        // filter items that are created over 30 days and so on but not within 7 days
        case value.includes('overdue') && ignored:
          return rowDate < sevenDaysAgo && rowDate >= thirtyDaysAgo;
        default:
          return value.includes(row.getValue(id));
      }
    },
  },
  {
    accessorKey: 'payment_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment" />
    ),
    cell: ({ row }) => {
      const state = row.getValue('payment_status');

      const stateVariant = state === true ? 'outline' : 'default';
      const stateDisplay = state === true ? 'Paid' : 'Pending';

      return (
        <div className="flex items-center">
          <Badge variant={stateVariant}>{stateDisplay}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <TableOrdersRowActions row={row} />,
  },
];
