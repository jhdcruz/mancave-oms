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
import { tableEmployeesSchema } from './table-employees-schema';
import type { DataTableRowActionsProps } from '../data-table-props';

import { DialogEmployee } from '@/components/dialog/dialog-employee';
import { DialogDelete } from '@/components/dialog/dialog-delete';

import { deleteEmployee, updateEmployee } from '@mcsph/supabase/ops/user';
import { browserClient } from '@mcsph/supabase/lib/client';

export function TableEmployeeRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { mutate } = useSWRConfig();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [updateDialog, setUpdateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const employee = tableEmployeesSchema.parse(row.original);

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

    await deleteEmployee(id, { supabase: supabase });

    await mutate('/admin/api?q=employees');

    setDeleteDialog(false);
    setDeleteLoading(false);
  };

  const saveEdit = async (formEvent: FormEvent) => {
    formEvent.preventDefault();

    setUpdateLoading(true);

    const supabase = browserClient();

    const formData = new FormData(formEvent.target as HTMLFormElement);

    const { employee: updatedEmployee } = await updateEmployee(
      employee?.id,
      formData,
      {
        supabase: supabase,
      },
    );

    await fetch('/admin/api/auth/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: employee?.id,
        avatar_url: updatedEmployee?.avatar_url,
        first_name: updatedEmployee?.first_name,
        last_name: updatedEmployee?.last_name,
        middle_name: updatedEmployee?.middle_name,
        email: updatedEmployee?.email,
        phone: updatedEmployee?.phone,
        role: updatedEmployee?.role,
        active: updatedEmployee?.active,
      }),
    });

    await mutate('/admin/api?q=employees');

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
            {employee?.email}
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
        <DialogEmployee
          save={(details) => saveEdit(details)}
          open={updateDialog}
          setOpen={setUpdateDialog}
          loading={updateLoading}
          rowData={employee}
        />
      )}
      {deleteDialog && (
        <DialogDelete
          open={deleteDialog}
          setOpen={setDeleteDialog}
          item={`Email: ${employee?.email}`}
          deleteFn={() => deleteSelected(employee?.id)}
          loading={deleteLoading}
        />
      )}
    </>
  );
}
