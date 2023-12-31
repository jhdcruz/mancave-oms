'use client';

import { FormEvent, useState } from 'react';
import { redirect, RedirectType } from 'next/navigation';
import { useLogger } from 'next-axiom';
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
import { tableProductsSchema } from './table-products-schema';
import type { DataTableRowActionsProps } from '../data-table-props';

import { DialogProduct } from '@/components/dialog/dialog-product';
import { DialogDelete } from '@/components/dialog/dialog-delete';

import { browserClient } from '@mcsph/supabase/lib/client';
import { deleteProduct, updateProduct } from '@mcsph/supabase/ops/products';

export function TableProductsRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const log = useLogger();
  const { mutate } = useSWRConfig();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [updateDialog, setUpdateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const product = tableProductsSchema.parse(row.original);

  const deleteSelected = async (id: number) => {
    setDeleteLoading(true);

    const supabase = browserClient();

    await deleteProduct(id, { supabase: supabase });

    await mutate('/inventory/api');

    setDeleteDialog(false);
    setDeleteLoading(false);
  };

  const saveEdit = async (formEvent: FormEvent) => {
    formEvent.preventDefault();

    setUpdateLoading(true);

    const supabase = browserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      log.info('Session data not found');
      await log.flush();
      return redirect('/login', RedirectType.replace);
    }

    const formData = new FormData(formEvent.target as HTMLFormElement);

    // include who updated the product
    formData.append('last_updated_by', session.user.id);

    await updateProduct(product?.id, formData, {
      supabase,
    });

    await mutate('/inventory/api');

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
          <DropdownMenuLabel>{product?.sku}</DropdownMenuLabel>

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
        <DialogProduct
          save={(details) => saveEdit(details)}
          open={updateDialog}
          setOpen={setUpdateDialog}
          loading={updateLoading}
          rowData={product}
        />
      )}
      {deleteDialog && (
        <DialogDelete
          open={deleteDialog}
          setOpen={setDeleteDialog}
          item={`SKU: ${product?.sku}`}
          deleteFn={() => deleteSelected(product?.id)}
          loading={deleteLoading}
        />
      )}
    </>
  );
}
