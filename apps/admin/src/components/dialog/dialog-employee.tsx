import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  UnlockKeyhole,
} from 'lucide-react';

import { Button } from '@mcsph/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@mcsph/ui/components/dialog';
import { Input } from '@mcsph/ui/components/input';
import { Label } from '@mcsph/ui/components/label';
import { Separator } from '@mcsph/ui/components/separator';
import { Switch } from '@mcsph/ui/components/switch';

import { Employee } from '../table/employees/table-employees-schema';

import { adminBrowserClient } from '@mcsph/supabase/lib/admin.client';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@mcsph/ui/components/select';
import { roles } from '../table/employees/table-employees-filters';
import { Badge } from '@mcsph/ui/components/badge';
import { formatDateTime } from '@mcsph/utils/lib/format';
import { cn } from '@mcsph/utils';
import { Skeleton } from '@mcsph/ui/components/skeleton';
import { useToast } from '@mcsph/ui/components/use-toast';

/**
 * Modal dialog for employee details.
 * Requires manual trigger of the dialog.
 *
 * optional `rowData` prop is a function that returns the data of the row
 * for editing/updating of the product.
 *
 * FIXME: This should use the <Form> component
 *        instead of manually creating the form
 *        in combination with react-hook-forms
 */
export function DialogEmployee({
  open = false,
  setOpen,
  loading,
  save,
  rowData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
  save: (formEvent: FormEvent) => Promise<unknown>;
  rowData?: Employee;
}) {
  const [imgLoad, setImgLoader] = useState(true);
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [active, setActive] = useState(rowData?.active ?? true);
  const [authProvided, setAuthProvided] = useState(
    rowData?.auth_provider ?? false,
  );
  const [recoveryRequested, setRecoveryRequested] = useState(false);

  const { toast } = useToast();

  // handles selected image file previewing
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Read the selected image file and set it as the source for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      // No file selected, reset the preview
      setSelectedImage(null);
    }
  };

  const checkExisting = async (event: ChangeEvent<HTMLInputElement>) => {
    // prevent flooding the server with requests
    await new Promise((resolve) => setTimeout(resolve, 500));

    const email = event.target.value;
    const supabase = adminBrowserClient();

    const { data: employee, error } = await supabase
      .from('employees')
      .select()
      .eq('email', email)
      .limit(1)
      .single();

    if (employee) {
      // pre-fill all the fields with the existing data
      const idInput = document.querySelector<HTMLInputElement>('#id');
      const firstNameInput =
        document.querySelector<HTMLInputElement>('#first_name');
      const lastNameInput =
        document.querySelector<HTMLInputElement>('#last_name');
      const middleNameInput =
        document.querySelector<HTMLInputElement>('#middle_name');
      const emailInput = document.querySelector<HTMLInputElement>('#email');
      const phoneInput = document.querySelector<HTMLInputElement>('#phone');
      const roleInput = document.querySelector<HTMLInputElement>('#role');

      if (idInput) idInput.defaultValue = employee.id;
      if (firstNameInput) firstNameInput.defaultValue = employee.first_name;
      if (lastNameInput) lastNameInput.defaultValue = employee.last_name;
      if (middleNameInput) middleNameInput.defaultValue = employee.middle_name;
      if (emailInput) emailInput.defaultValue = employee.email;
      if (phoneInput) phoneInput.defaultValue = employee.phone;
      if (roleInput) roleInput.value = employee.role;

      setActive(employee.active);
      setAuthProvided(employee.auth_provider);

      // update the preview image
      setSelectedImage(employee.avatar_url);
    }
  };

  const sendRecovery = async () => {
    setRecoveryRequested(true);

    // send a post request to a url
    const res = await fetch('/admin/api/auth/recovery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'recovery',
        email: rowData?.email,
      }),
    });

    if (res.status < 400) {
      toast({
        title: 'Recovery email sent',
        description: `A recovery email has been sent to ${rowData?.email}`,
      });

      setRecoveryRequested(false);
      setOpen(false);
    } else {
      toast({
        title: 'Recovery email failed',
        description: `Failed to send recovery email to ${rowData?.email}`,
        variant: 'destructive',
      });

      setRecoveryRequested(false);
    }
  };

  const changePassword = async () => {
    const newPassword = window.prompt('Enter the new password below:');

    if (newPassword) {
      // send a post request to a url
      const res = await fetch('/admin/api/auth/recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'password',
          id: rowData?.id,
          password: newPassword,
        }),
      });

      if (res.status < 400) {
        toast({
          title: 'Password forcefully changed',
          description: `Password has been forcefully changed for ${rowData?.email}`,
        });

        setOpen(false);
      }
    }
  };

  // Reset the selectedImage when the component unmounts
  useEffect(() => {
    return () => {
      setSelectedImage(null);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="data-[state=open]:animate-show data-[state=closed]:animate-hide h-max max-h-screen w-screen overflow-y-scroll rounded-lg md:min-h-max md:min-w-[790px] md:overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>Information about the employee.</DialogDescription>
        </DialogHeader>

        <form onSubmit={save}>
          <div className="block md:grid md:grid-flow-col md:grid-cols-1 md:gap-4">
            <div className="py-4 md:col-span-2 md:grid">
              {rowData && (
                <>
                  <div className="mb-3 items-center text-sm">
                    <Badge variant="secondary" className="mr-2 font-semibold">
                      Created at:
                    </Badge>
                    <span>{formatDateTime(rowData.created_at)}</span>

                    <div className="my-2" />

                    <Badge variant="secondary" className="mr-2 font-semibold">
                      Last Updated:
                    </Badge>
                    <span>{formatDateTime(rowData.last_updated)}</span>
                  </div>

                  <Separator className="my-2" />
                </>
              )}

              {/* Hidden input for ID container for prefilled forms */}
              <div className="mb-3 hidden items-center">
                <Input name="id" id="id" defaultValue={rowData?.id} />
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="email">Email</Label>

                {authProvided ? (
                  <>
                    <p className="my-1 font-medium">{rowData?.email}</p>
                    <Input
                      name="email"
                      id="email"
                      type="email"
                      defaultValue={rowData?.email}
                      placeholder="john.doe@mancave.com"
                      className="col-span-3 hidden"
                      minLength={4}
                      onChange={checkExisting}
                      required
                    />
                    <p className="ml-1 mt-1 text-sm text-muted-foreground">
                      * Third-party auth provider used.
                    </p>
                  </>
                ) : (
                  <Input
                    name="email"
                    id="email"
                    type="email"
                    defaultValue={rowData?.email}
                    placeholder="john.doe@mancave.com"
                    className="col-span-3"
                    minLength={4}
                    onChange={checkExisting}
                    required
                  />
                )}
              </div>

              {!rowData && (
                <div className="my-3 w-full items-center">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    minLength={7}
                    autoComplete="current-password"
                  />
                </div>
              )}

              <Separator className="my-2" />

              <div className="mb-3 items-center">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  defaultValue={rowData?.last_name}
                  placeholder="Doe"
                  className="col-span-3"
                  minLength={2}
                  required
                />
              </div>
              <div className="mb-3 items-center">
                <Label htmlFor="frst_name">First Name</Label>
                <Input
                  className="col-span-3"
                  id="first_name"
                  name="first_name"
                  defaultValue={rowData?.first_name}
                  placeholder="John"
                  minLength={2}
                  required
                />
              </div>
              <div className="mb-3 items-center">
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input
                  className="col-span-3"
                  id="middle_name"
                  name="middle_name"
                  defaultValue={rowData?.middle_name}
                />
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="phone">Phone #.</Label>
                <Input
                  className="col-span-3"
                  id="phone"
                  name="phone"
                  defaultValue={rowData?.phone}
                  pattern="^(\d{11,15}$)"
                />
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="role">Access Level</Label>

                <Select name="role" defaultValue={rowData?.role} required>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="User Role" />
                  </SelectTrigger>
                  <SelectContent id="role">
                    <SelectGroup>
                      <SelectLabel>User Role</SelectLabel>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center">
                            <role.icon className="mr-2 h-4 w-4" />
                            {role.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="hidden md:block" orientation="vertical" />

            <div className="py-4">
              <div className="item-center h-max">
                <Label htmlFor="image">Avatar Image:</Label>
                <Input
                  name="image"
                  id="image"
                  type="file"
                  accept="image/png, image/jpg, image/webp"
                  onChange={handleImageChange}
                />

                {/* Prioritize selected image for previewing, else default to uploaded */}
                {selectedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="mx-auto my-3 rounded-md object-cover"
                    src={selectedImage as string}
                    width={300}
                    height={300}
                    alt="Uploaded product's preview image"
                  />
                ) : (
                  <>
                    {rowData?.avatar_url ? (
                      <>
                        {imgLoad && (
                          <Skeleton className="mx-auto my-3 h-[300px] w-[300px]" />
                        )}
                        <Image
                          className={cn(
                            imgLoad ? 'h-0 w-0' : '',
                            'mx-auto my-3 rounded-md object-cover',
                          )}
                          src={rowData?.avatar_url}
                          width={300}
                          height={300}
                          fetchPriority="low"
                          priority={false}
                          alt="Product's preview image"
                          onLoad={() => setImgLoader(false)}
                        />
                      </>
                    ) : (
                      <div className="mx-auto my-3 items-center p-3 text-center text-muted-foreground">
                        No image uploaded.
                      </div>
                    )}
                  </>
                )}
              </div>

              {rowData && (
                <div className="mx-auto w-[300px] items-center">
                  <Button
                    type="button"
                    className="mb-2 w-[300px]"
                    onClick={() => sendRecovery()}
                    disabled={recoveryRequested || authProvided}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {recoveryRequested
                      ? 'Sending request...'
                      : 'Send recovery email'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-[300px]"
                    onClick={() => changePassword()}
                    disabled={authProvided}
                  >
                    <KeyRound className="mr-2 h-4 w-4" />
                    Change password
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <div className="flex place-content-end items-center">
              <div className="flex items-center">
                <Label htmlFor="active" className="mx-2 text-muted-foreground">
                  {active ? (
                    <div className="flex items-center">
                      <UnlockKeyhole className="mr-2 h-4 w-4" />
                      Active
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <LockKeyhole className="mr-2 h-4 w-4" />
                      Disabled
                    </div>
                  )}
                </Label>
                <Switch
                  id="active"
                  checked={active}
                  name="active"
                  onClick={() => setActive(!active)}
                />
              </div>

              <div className="ml-3 items-center">
                <Button disabled={loading} type="submit">
                  {loading ? <Loader2 className="animate-spin" /> : <>Save</>}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
