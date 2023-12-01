import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

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

import { browserClient } from '@mcsph/supabase/lib/client';

/**
 * Modal dialog for product details.
 * Requires manual trigger of the dialog.
 *
 * optional `rowData` prop is a function that returns the data of the row
 * for editing/updating of the product.
 *
 * FIXME: This should use the <Form> component
 *        instead of manually creating the form
 *        in combination with react-hook-forms
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
  const [imgLoad, setImgLoader] = useState(true);
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [published, setPublished] = useState(rowData?.published ?? false);

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

    const sku = event.target.value;
    const supabase = browserClient();

    const { data: product, error } = await supabase
      .from('products')
      .select(
        'id, sku, name, type, qty, price, description, image_url, published',
      )
      .eq('sku', sku)
      .limit(1)
      .single();

    if (error) {
      console.error(error);
    }

    if (product) {
      // pre-fill all the fields with the existing data
      const idInput = document.querySelector<HTMLInputElement>('#id');
      const skuInput = document.querySelector<HTMLInputElement>('#sku');
      const nameInput = document.querySelector<HTMLInputElement>('#name');
      const typeInput = document.querySelector<HTMLInputElement>('#type');
      const qtyInput = document.querySelector<HTMLInputElement>('#qty');
      const priceInput = document.querySelector<HTMLInputElement>('#price');
      const descriptionInput =
        document.querySelector<HTMLTextAreaElement>('#description');

      idInput.defaultValue = product.id;
      skuInput.defaultValue = product.sku;
      nameInput.defaultValue = product.name;
      typeInput.defaultValue = product.type;
      qtyInput.defaultValue = product.qty;
      priceInput.defaultValue = product.price;
      descriptionInput.value = product.description;
      setPublished(product.published);

      // update the preview image
      setSelectedImage(product.image_url);
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
      <DialogContent className="data-[state=open]:animate-show data-[state=closed]:animate-hide h-max max-h-screen w-screen overflow-y-scroll rounded-lg md:min-h-max md:min-w-[700px] md:overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Details of the product that will be shown to the customer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={save}>
          <div className="block md:grid md:grid-flow-col md:grid-cols-1 md:gap-4">
            <div className="py-4 md:col-span-2 md:grid">
              {/* Hidden input for ID container for prefilled forms */}
              <div className="mb-3 hidden items-center">
                <Input name="id" id="id" onChange={checkExisting} />
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  name="sku"
                  id="sku"
                  defaultValue={rowData?.sku}
                  placeholder="TDM-09-B"
                  className="col-span-3"
                  minLength={4}
                  onChange={checkExisting}
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
                <Label htmlFor="price">Price each. (&#x20B1;)</Label>
                <Input
                  className="col-span-3"
                  id="price"
                  name="price"
                  defaultValue={rowData?.price}
                  min="0.00"
                  accept="/^d+(.d{1,2})?$/"
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
                    width={320}
                    height={320}
                    alt="Uploaded product's preview image"
                  />
                ) : (
                  <>
                    {rowData?.image_url ? (
                      <>
                        {imgLoad && (
                          <Loader2 className="mx-auto my-3 h-8 w-8 animate-spin" />
                        )}
                        <Image
                          className="mx-auto my-3 rounded-md object-cover"
                          src={rowData?.image_url}
                          width={320}
                          height={320}
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
            </div>
          </div>

          <DialogFooter>
            <div className="flex place-content-end items-center">
              <div className="flex items-center">
                <Label
                  htmlFor="published"
                  className="mx-2 text-muted-foreground"
                >
                  {published ? 'Published' : 'Unpublished'}
                </Label>
                <Switch
                  id="published"
                  checked={published}
                  name="published"
                  onClick={() => setPublished(!published)}
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
