'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';

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
  save,
  rowData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  save: (formData: FormData) => Promise<unknown>;
  rowData?: Products;
}) {
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);

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
      <DialogContent className="min-w-max">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Details of the product that will be shown to the customer.
          </DialogDescription>
        </DialogHeader>

        <form
          action={save}
          className="grid grid-flow-col auto-rows-auto grid-cols-2 gap-4"
        >
          <div className="col-span-2 grid gap-4 py-4">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="sku">SKU</Label>
              <Input
                name="sku"
                id="sku"
                defaultValue={rowData?.sku}
                placeholder="TDM-09-B"
                className="col-span-3"
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={rowData?.name}
                placeholder="Modern Dining Table"
                className="col-span-3"
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                defaultValue={rowData?.type}
                placeholder="Model 09"
                className="col-span-3"
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label htmlFor="qty">Qty.</Label>
              <Input
                id="qty"
                defaultValue={rowData?.qty}
                type="number"
                min="0"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-5 items-center gap-1.5">
              <Label htmlFor="disabled">Published</Label>
              <Switch
                id="disabled"
                checked={!rowData?.disabled}
                name="disabled"
              />
            </div>
          </div>

          <Separator orientation="vertical" />

          <div className="grid py-4">
            <div className="item-center">
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
                <Image
                  className="mx-auto my-3"
                  src={selectedImage as string}
                  width={300}
                  height={300}
                  alt="Product's preview image"
                />
              ) : (
                <>
                  {rowData?.image_url ? (
                    <Image
                      className="mx-auto my-3"
                      src={rowData?.image_url}
                      width={300}
                      height={300}
                      alt="Product's preview image"
                    />
                  ) : (
                    <div className="mx-auto my-3">No image uploaded.</div>
                  )}
                </>
              )}
            </div>

            <div className="item-center">
              <Label htmlFor="description">Description</Label>
              <Textarea
                className="h-full w-full"
                id="description"
                defaultValue={rowData?.description}
                name="description"
              />
              <p className="text-sm text-muted-foreground">
                This will shown to the customer.
              </p>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
