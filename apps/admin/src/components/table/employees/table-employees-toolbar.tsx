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
import { roles, active } from './table-employees-filters';
import type { DataTableToolbarProps } from '../data-table-props';

import { browserClient } from '@mcsph/supabase/lib/client';
import { updateEmployee } from '@mcsph/supabase/ops/user';
import { DialogEmployee } from '@/components/dialog/dialog-employee';
import { uploadAndGetAvatarImageUrl } from '@mcsph/supabase/ops/user/utils/storage';
import { useToast } from '@mcsph/ui/components/use-toast';

export function DataTableEmployeesToolbar<TData>({
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
      const { employee } = await updateEmployee(userId, formData, {
        supabase: supabase,
      });

      const res: Record<string, any> = await fetch('/admin/api/auth/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar_url: employee.avatar_url,
          first_name: employee.first_name,
          last_name: employee.last_name,
          middle_name: employee.middle_name,
          email: employee.email,
          phone: employee.phone,
          role: employee.role,
          active: employee.active,
        }),
      });

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
      const res: Record<string, any> = await fetch('/admin/api/auth/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar_url: imageUrl as string,
          first_name: formData.get('first_name') as string,
          last_name: formData.get('last_name') as string,
          middle_name: formData.get('middle_name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          role: formData.get('role') as string,
          active: !!formData.get('active'),
          password: formData.get('password') as string,
        }),
      });

      if (res.error) {
        toast({
          title: 'Invalid user details submitted',
          description: res.error.message,
          variant: 'destructive',
        });
      }
    }

    await mutate('/admin/api?q=employees');

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
          placeholder="Filter employees..."
          value={
            ((table.getColumn('sku')?.getFilterValue() as string) ?? '') ||
            ((table.getColumn('name')?.getFilterValue() as string) ?? '')
          }
          onChange={(event) =>
            table.getColumn('sku')?.setFilterValue(event.target.value) &&
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="w-full md:w-[250px] lg:w-[300px]"
        />

        <Button
          className="my-3 w-full md:my-0 md:w-max"
          onClick={() => setDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>

        <Separator
          orientation="vertical"
          className="ml-4 hidden h-8 md:block"
        />

        {dialog && (
          <DialogEmployee
            save={(details) => saveProduct(details)}
            open={dialog}
            setOpen={setDialog}
            loading={loading}
          />
        )}

        <span className="mr-2 text-sm text-muted-foreground">Filters:</span>

        {table.getColumn('role') && (
          <DataTableFacetedFilter
            column={table.getColumn('role')}
            title="Roles"
            options={roles}
          />
        )}

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
