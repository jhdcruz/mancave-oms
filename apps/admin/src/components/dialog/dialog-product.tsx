import { ChangeEvent, FormEvent, Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

import { Button } from '@mcsph/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@mcsph/ui/components/dialog';
import { Input } from '@mcsph/ui/components/input';
import { Label } from '@mcsph/ui/components/label';
import { Separator } from '@mcsph/ui/components/separator';
import { Switch } from '@mcsph/ui/components/switch';
import { Textarea } from '@mcsph/ui/components/textarea';

import { Products } from '../table/products/table-products-schema';

/**
 * Modal dialog for product details.
 * Requires manual trigger of the dialog.
 *
 * optional `rowData` prop is a function that returns the data of the row
 * for editing/updating of the product.
 */
export function DialogProduct({
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
  rowData?: Products;
}) {
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);

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

  // Reset the selectedImage when the component unmounts
  useEffect(() => {
    return () => {
      setSelectedImage(null);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-max max-h-screen w-full overflow-y-scroll rounded-lg md:min-h-max md:min-w-[700px] md:overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Details of the product that will be shown to the customer.
          </DialogDescription>
        </DialogHeader>

        <form
          className="block md:grid md:grid-flow-col md:grid-cols-1 md:gap-4"
          onSubmit={save}
        >
          <div className="py-4 md:col-span-2 md:grid">
            <div className="mb-3 items-center">
              <Label htmlFor="sku">SKU</Label>
              <Input
                name="sku"
                id="sku"
                defaultValue={rowData?.sku}
                placeholder="TDM-09-B"
                className="col-span-3"
                minLength={4}
                required
              />
            </div>
            <div className="mb-3 items-center">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={rowData?.name}
                placeholder="Modern Dining Table"
                className="col-span-3"
                minLength={3}
                required
              />
            </div>
            <div className="mb-3 items-center">
              <Label htmlFor="type">Type</Label>
              <Input
                className="col-span-3"
                id="type"
                name="type"
                defaultValue={rowData?.type}
                placeholder="Model 09"
                minLength={3}
                required
              />
            </div>
            <div className="mb-3 items-center">
              <Label htmlFor="qty">Qty.</Label>
              <Input
                className="col-span-3"
                id="qty"
                name="qty"
                type="number"
                defaultValue={rowData?.qty}
                min={0}
                required
              />
            </div>

            <div className="mb-3 items-center">
              <Label htmlFor="description">Description</Label>
              <Textarea
                className="h-[90%] resize-none"
                id="description"
                defaultValue={rowData?.description ?? ''}
                name="description"
              />
              <p className="text-sm text-muted-foreground">
                This will shown to the customer.
              </p>
            </div>
          </div>

          <Separator className="hidden md:block" orientation="vertical" />

          <div className="py-4">
            <div className="item-center h-[93%]">
              <Label htmlFor="image">Image:</Label>
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
                  width={340}
                  height={340}
                  alt="Uploaded product's preview image"
                />
              ) : (
                <Suspense
                  fallback={<Loader2 className="h-8 w-8 animate-spin" />}
                >
                  {rowData?.image_url ? (
                    <Image
                      className="mx-auto my-3 rounded-md object-cover"
                      src={rowData?.image_url}
                      width={340}
                      height={340}
                      alt="Product's preview image"
                      fetchPriority="low"
                    />
                  ) : (
                    <div className="mx-auto my-3">No image uploaded.</div>
                  )}
                </Suspense>
              )}
            </div>

            <div className="flex place-content-end items-center">
              <div className="flex items-center">
                <Label
                  htmlFor="published"
                  className="mx-2 text-muted-foreground"
                >
                  Published
                </Label>
                <Switch
                  id="published"
                  defaultChecked={rowData?.published}
                  name="published"
                />
              </div>

              <div className="ml-3 items-center">
                <Button disabled={loading} type="submit">
                  {loading ? <Loader2 className="animate-spin" /> : <>Submit</>}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}