'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@mcsph/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@mcsph/ui/components/dropdown-menu';

import { states } from './table-products-filters';
import { tableProductsSchema } from './table-products-schema';

import { DialogProduct } from '@/components/dialog/dialog-product';
import type { DataTableRowActionsProps } from '../data-table-props';

import { browserClient } from '@mcsph/supabase/lib/client';
import { updateProduct } from '@mcsph/supabase/ops/products';

export function TableProductsRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [dialog, setDialog] = useState(false);
  const product = tableProductsSchema.parse(row.original);

  const supabase = browserClient();

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
          <DropdownMenuItem onClick={() => setDialog(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={String(product.disabled)}>
                {states.map((state) => (
                  <DropdownMenuRadioItem
                    key={state.label}
                    value={String(state.value)}
                  >
                    {state.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span className="text-red-600">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {dialog && (
        <DialogProduct
          save={(details) =>
            updateProduct(product?.id, details, { supabase: supabase })
          }
          open={dialog}
          setOpen={setDialog}
          rowData={product}
        />
      )}
    </>
  );
}
