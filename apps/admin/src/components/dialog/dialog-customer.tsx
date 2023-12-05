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

import { adminBrowserClient } from '@mcsph/supabase/lib/admin.client';
import { Badge } from '@mcsph/ui/components/badge';
import { formatDateTime } from '@mcsph/utils/lib/format';
import { cn } from '@mcsph/utils';
import { Skeleton } from '@mcsph/ui/components/skeleton';
import { useToast } from '@mcsph/ui/components/use-toast';
import { Customer } from '@/components/table/customers/table-customers-schema';
import { Textarea } from '@mcsph/ui/components/textarea';

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
export function DialogCustomer({
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
  rowData?: Customer;
}) {
  const [imgLoad, setImgLoader] = useState(true);
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [active, setActive] = useState(rowData?.active ?? true);

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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const email = event.target.value;
    const supabase = adminBrowserClient();

    const { data: customer } = await supabase
      .from('customers')
      .select()
      .eq('email', email)
      .limit(1)
      .single();

    if (customer) {
      // pre-fill all the fields with the existing data
      const idInput = document.querySelector<HTMLInputElement>('#id');
      const nameInput = document.querySelector<HTMLInputElement>('#full_name');
      const shippingInput =
        document.querySelector<HTMLTextAreaElement>('#shipping_address');
      const billingInput =
        document.querySelector<HTMLTextAreaElement>('#billing_address');
      const emailInput = document.querySelector<HTMLInputElement>('#email');
      const phoneInput = document.querySelector<HTMLInputElement>('#phone');

      if (idInput) idInput.defaultValue = customer.id;
      if (emailInput) emailInput.defaultValue = customer.email;
      if (nameInput) nameInput.defaultValue = customer.full_name;
      if (phoneInput) phoneInput.defaultValue = customer.phone;
      if (shippingInput) shippingInput.value = customer.shipping_address;
      if (billingInput) billingInput.value= customer.billing_address;

      setActive(customer.active);

      // update the preview image
      setSelectedImage(customer.avatar_url);
    }
  };

  const sendRecovery = async () => {
    // send a post request to a url
    const res = await fetch('/admin/api/auth/recovery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'recovery', email: rowData?.email }),
    });

    if (res.status < 400) {
      toast({
        title: 'Recovery email sent',
        description: `A recovery email has been sent to ${rowData?.email}`,
      });
    }
  };

  const changePassword = async () => {
    const newPassword = window.prompt('Enter the new password below:');

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
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>Information about the customer.</DialogDescription>
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
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={rowData?.email}
                  className="col-span-3"
                  onChange={checkExisting}
                  required
                />
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={rowData?.full_name}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="phone">Phone #</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={rowData?.phone}
                  className="col-span-3"
                />
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="shipping_address">Shipping Address</Label>
                <Textarea
                  className="resize-none"
                  id="shipping_address"
                  defaultValue={rowData?.shipping_address}
                  name="shipping_address"
                  required
                />
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="billing_address">Billing Address</Label>
                <Textarea
                  className="resize-none"
                  id="billing_address"
                  defaultValue={rowData?.billing_address ?? ''}
                  name="billing_address"
                  required
                />
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
                  <Button className="mb-2 w-[300px]" onClick={sendRecovery}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send recovery email
                  </Button>

                  <Button
                    variant="outline"
                    className="w-[300px]"
                    onClick={changePassword}
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
