'use client';

import { FormEvent, useState } from 'react';
import { ClipboardEdit, MoreHorizontal, Trash2 } from 'lucide-react';

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

import { DialogProduct } from '@/components/dialog/dialog-product';
import type { DataTableRowActionsProps } from '../data-table-props';

import { browserClient } from '@mcsph/supabase/lib/client';
import { deleteProduct, updateProduct } from '@mcsph/supabase/ops/products';
import { DialogDelete } from '@/components/dialog/dialog-delete';
import { useLogger } from 'next-axiom';
import { redirect, RedirectType } from 'next/navigation';

export function TableProductsRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const log = useLogger();

  const [loading, setLoading] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const product = tableProductsSchema.parse(row.original);

  const saveEdit = async (formEvent: FormEvent) => {
    formEvent.preventDefault();

    setLoading(true);

    const supabase = browserClient();
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      log.info('Session data not found');
      return redirect('/login', RedirectType.replace);
    }

    const formData = new FormData(formEvent.target as HTMLFormElement);

    // include who updated the product
    formData.append('last_updated_by', data.session.user.id);

    const { error } = await updateProduct(product?.id, formData, { supabase });

    if (error) {
      log.error(`Error updating product with an ID of ${product?.id}`, {
        error,
      });
      await log.flush();
    }

    setLoading(false);
    setUpdateDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
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
          loading={loading}
          rowData={product}
        />
      )}
      {deleteDialog && (
        <DialogDelete
          open={deleteDialog}
          setOpen={setDeleteDialog}
          item={`SKU: ${product?.sku}`}
          deleteFn={() =>
            deleteProduct(product?.id, {
              supabase: supabase,
            })
          }
        />
      )}
    </>
  );
}