'use client';

import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@mcsph/ui/components/badge';

import { DataTableColumnHeader } from '../data-table-column-header';
import { TableEmployeeRowActions } from './table-employees-row-actions';
import type { Employee } from './table-employees-schema';

/**
 * The `filterFn` is used for filtering, where `value`
 * refers to the key set in `table-products-column`,
 * that is to be selected in `table-products-toolbar`
 */

export const employeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="hidden"
        column={column}
        title="User ID"
      />
    ),
    cell: ({ row }) => <div className="hidden w-0">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, id, value) => {
      // allow search from first name to last name column
      const firstName = row.getValue('first_name') as string;
      const lastName = row.getValue('last_name') as string;
      const middleName = row.getValue('middle_name') as string;
      const email = row.getValue('email') as string;

      return (
        firstName.toLowerCase().includes(value.toLowerCase()) ||
        lastName.toLowerCase().includes(value.toLowerCase()) ||
        middleName.toLowerCase().includes(value.toLowerCase()) ||
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
    accessorKey: 'last_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] font-semibold">{row.getValue('last_name')}</div>
    ),
  },
  {
    accessorKey: 'first_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] truncate">{row.getValue('first_name')}</div>
    ),
  },
  {
    accessorKey: 'middle_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Middle" />
    ),
    cell: ({ row }) => (
      <div className="w-[50px] truncate">{row.getValue('middle_name')}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-[110px] truncate">{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('role') as string;

      let statusVariant;

      switch (status) {
        case 'Admin':
          statusVariant = 'bg-purple-600';
          break;
        default:
          statusVariant = 'bg-slate-600';
          break;
      }

      return (
        <div className="w-[60px]">
          <Badge className={statusVariant}>{status}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
    cell: ({ row }) => <TableEmployeeRowActions row={row} />,
  },
];
