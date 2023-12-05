'use client';

import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@mcsph/ui/components/badge';

import { DataTableColumnHeader } from '../data-table-column-header';
import { TableCustomersRowActions } from './table-customers-row-actions';
import type { Customer } from './table-customers-schema';

/**
 * The `filterFn` is used for filtering, where `value`
 * refers to the key set in `table-products-column`,
 * that is to be selected in `table-products-toolbar`
 */

export const customersColumn: ColumnDef<Customer>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="hidden"
        column={column}
        title="Customer ID"
      />
    ),
    cell: ({ row }) => <div className="hidden w-0">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, id, value) => {
      // allow search from first name to last name column
      const fullName = row.getValue('full_name') as string;
      // const shippingAddress = row.getValue('shipping_address') as string;
      // const billingAddress = row.getValue('billing_address') as string;
      const email = row.getValue('email') as string;

      return (
        fullName
          .toLowerCase()
          .split(' ')
          .some((word) => word.includes(value.toLowerCase())) ||
        // shippingAddress
        //   .toLowerCase()
        //   .split(' ')
        //   .some((word) => word.includes(value.toLowerCase())) ||
        // billingAddress
        //   .toLowerCase()
        //   .split(' ')
        //   .some((word) => word.includes(value.toLowerCase())) ||
        email.toLowerCase().includes(value.toLowerCase())
      );
    },
  },
  {
    accessorKey: 'avatar_url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avatar" />
    ),
    cell: ({ row }) => (
      <div className="w-[30px] truncate">
        <Image
          className="rounded-full object-cover"
          src={row.getValue('avatar_url') as string}
          width={50}
          height={50}
          fetchPriority="low"
          priority={false}
          alt=""
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'full_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] truncate font-semibold">
        {row.getValue('full_name')}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="truncate">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <div className="truncate">{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => {
      const state = row.getValue('active');

      const stateVariant = state === true ? 'outline' : 'default';
      const stateDisplay = state === true ? 'Active' : 'Disabled';

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
    cell: ({ row }) => <TableCustomersRowActions row={row} />,
  },
];
