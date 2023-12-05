'use client';

import { FormEvent, useEffect, useState } from 'react';
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

import { DialogDelete } from '@/components/dialog/dialog-delete';
import { DialogOrder } from '@/components/dialog/dialog-order';
import { tableOrdersSchema } from '@/components/table/orders/table-orders-schema';

import type { DataTableRowActionsProps } from '../data-table-props';

import { browserClient } from '@mcsph/supabase/lib/client';
import { deleteOrder, updateOrder } from '@mcsph/supabase/ops/orders';

export function TableOrdersRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { mutate } = useSWRConfig();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [updateDialog, setUpdateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const order = tableOrdersSchema.parse(row.original);

  const deleteSelected = async (id: string) => {
    setDeleteLoading(true);

    await deleteOrder(id, { supabase: browserClient() });
    await mutate('/orders/api');

    setDeleteDialog(false);
    setDeleteLoading(false);
  };

  const saveEdit = async (formEvent: FormEvent) => {
    formEvent.preventDefault();

    setUpdateLoading(true);

    const formData = new FormData(formEvent.target as HTMLFormElement);

    // currently, editing of orders is not allowed in its entirety
    // to avoid inconsistencies in the data, especially in the customers data
    // as well as to prevent any form of tampering with the order,
    // If editing is desired, the order should be cancelled and a new one created
    const body = {
      payment_status:
        (formData.get('payment_status') as unknown as boolean) ?? false,
      order_status: formData.get('order_status'),
    };

    await updateOrder(order?.id, body, {
      supabase: browserClient(),
    });

    await mutate('/orders/api');

    setUpdateDialog(false);
    setUpdateLoading(false);
  };

  // We're only going to allow/show delete for admin,
  // else, default to edit without any dropdown, since its redundant
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
            {order?.id}
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
        <DialogOrder
          save={(details) => saveEdit(details)}
          open={updateDialog}
          setOpen={setUpdateDialog}
          loading={updateLoading}
          rowData={order}
        />
      )}

      {deleteDialog && (
        <DialogDelete
          open={deleteDialog}
          setOpen={setDeleteDialog}
          item={`Ref. #: ${order?.id}`}
          deleteFn={() => deleteSelected(order?.id)}
          loading={deleteLoading}
        />
      )}
    </>
  );
}
