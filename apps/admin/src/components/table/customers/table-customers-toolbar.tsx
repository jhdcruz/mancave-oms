'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { Plus, X } from 'lucide-react';

import { Button } from '@mcsph/ui/components/button';
import { Input } from '@mcsph/ui/components/input';
import { Separator } from '@mcsph/ui/components/separator';

import { DataTableFacetedFilter } from '../data-table-faceted-filter';
import { DataTableViewOptions } from '../data-table-view-options';
import { active } from './table-customers-filters';
import type { DataTableToolbarProps } from '../data-table-props';

import { browserClient } from '@mcsph/supabase/lib/client';
import { updateCustomer } from '@mcsph/supabase/ops/user';
import { DialogCustomer } from '@/components/dialog/dialog-customer';
import { uploadAndGetAvatarImageUrl } from '@mcsph/supabase/ops/user/utils/storage';
import { useToast } from '@mcsph/ui/components/use-toast';

export function DataTableCustomersToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { mutate } = useSWRConfig();

  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;

  const { toast } = useToast();

  const searchParams = useSearchParams();

  const saveProduct = async (formEvent: FormEvent) => {
    formEvent.preventDefault();

    setLoading(true);

    const supabase = browserClient();
    const formData = new FormData(formEvent.target as HTMLFormElement);

    const userId = formData.get('id') as string;

    if (userId) {
      const { customer } = await updateCustomer(userId, formData, {
        supabase: supabase,
      });

      const res: Record<string, any> = await fetch(
        '/customers/api/auth/update',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avatar_url: customer.avatar_url,
            full_name: customer.full_name,
            shipping_address: customer.shipping_address,
            billing_address: customer.billing_address,
            email: customer.email,
            phone: customer.phone,
            active: customer.active,
          }),
        },
      );

      if (res.error) {
        toast({
          title: 'Invalid user details submitted',
          description: res.error.message,
          variant: 'destructive',
        });
      }
    } else {
      const email = formData.get('email') as string;
      const image = formData.get('image') as File;

      let imageUrl;

      if (image.size > 0) {
        imageUrl = await uploadAndGetAvatarImageUrl(email, image, {
          supabase: supabase,
        });
      }

      // we already have triggers in database to create entry in employees table
      const res: Record<string, any> = await fetch(
        '/customers/api/auth/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avatar_url: imageUrl as string,
            full_name: formData.get('full_name') as string,
            shipping_address: formData.get('shipping_address') as string,
            billing_address: formData.get('billing_address') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            active: !!formData.get('active'),
            password: formData.get('password') as string,
          }),
        },
      );

      if (res.error) {
        toast({
          title: 'Invalid user details submitted',
          description: res.error.message,
          variant: 'destructive',
        });
      }
    }

    await mutate('/customers/api?q=customers');

    setLoading(false);
    setDialog(false);
  };

  useEffect(() => {
    // handles the new product action in command bar
    if (searchParams.get('action') === 'new') {
      setDialog(true);
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-between">
      <div className="block w-full items-center md:flex md:w-auto md:flex-1 md:space-x-2">
        <Input
          placeholder="Filter customers..."
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('id')?.setFilterValue(event.target.value)
          }
          className="w-full md:w-[250px] lg:w-[300px]"
        />

        <Button
          className="my-3 w-full md:my-0 md:w-max"
          onClick={() => setDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>

        <Separator
          orientation="vertical"
          className="ml-4 hidden h-8 md:block"
        />

        {dialog && (
          <DialogCustomer
            save={(details) => saveProduct(details)}
            open={dialog}
            setOpen={setDialog}
            loading={loading}
          />
        )}

        <span className="mr-2 text-sm text-muted-foreground">Filters:</span>

        {table.getColumn('active') && (
          <DataTableFacetedFilter
            column={table.getColumn('active')}
            title="Active"
            options={active}
          />
        )}

        {/* Show a reset filter button, if filtered */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <br />

      <DataTableViewOptions table={table} />
    </div>
  );
}
