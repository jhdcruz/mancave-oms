'use client';

import { FormEvent, useState } from 'react';
import { useSWRConfig } from 'swr';
import { ClipboardEdit, Settings, Trash2 } from 'lucide-react';

import { Button } from '@mcsph/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@mcsph/ui/components/dropdown-menu';
import { tableCustomersSchema } from './table-customers-schema';
import type { DataTableRowActionsProps } from '../data-table-props';

import { DialogCustomer } from '@/components/dialog/dialog-customer';
import { DialogDelete } from '@/components/dialog/dialog-delete';

import { deleteCustomer, updateCustomer } from '@mcsph/supabase/ops/user';
import { browserClient } from '@mcsph/supabase/lib/client';

export function TableCustomersRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { mutate } = useSWRConfig();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [updateDialog, setUpdateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const customer = tableCustomersSchema.parse(row.original);

  const deleteSelected = async (id: string) => {
    setDeleteLoading(true);

    const supabase = browserClient();

    await fetch('/admin/api/auth/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });

    await deleteCustomer(id, { supabase: supabase });

    await mutate('/customers/api?q=customers');

    setDeleteDialog(false);
    setDeleteLoading(false);
  };

  const saveEdit = async (formEvent: FormEvent) => {
    formEvent.preventDefault();

    setUpdateLoading(true);

    const supabase = browserClient();

    const formData = new FormData(formEvent.target as HTMLFormElement);

    const { customer: updatedCustomer } = await updateCustomer(
      customer?.id,
      formData,
      {
        supabase: supabase,
      },
    );

    console.log(updatedCustomer);

    await fetch('/customers/api/auth/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: customer?.id,
        avatar_url: updatedCustomer?.avatar_url,
        full_name: updatedCustomer?.full_name,
        shipping_address: updatedCustomer?.shipping_address,
        billing_address: updatedCustomer?.billing_address,
        email: updatedCustomer?.email,
        phone: updatedCustomer?.phone,
        active: updatedCustomer?.active,
      }),
    });

    await mutate('/customers/api?q=customers');

    setUpdateDialog(false);
    setUpdateLoading(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex px-4 py-2 data-[state=open]:bg-muted"
          >
            <Settings size={16} />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel className="truncate">
            {customer?.email}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setUpdateDialog(true)}>
            <ClipboardEdit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
      {updateDialog && (
        <DialogCustomer
          save={(details) => saveEdit(details)}
          open={updateDialog}
          setOpen={setUpdateDialog}
          loading={updateLoading}
          rowData={customer}
        />
      )}
      {deleteDialog && (
        <DialogDelete
          open={deleteDialog}
          setOpen={setDeleteDialog}
          item={`Email: ${customer?.email}`}
          deleteFn={() => deleteSelected(customer?.id)}
          loading={deleteLoading}
        />
      )}
    </>
  );
}
