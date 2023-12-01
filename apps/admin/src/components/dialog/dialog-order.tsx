import { FormEvent, useEffect, useState } from 'react';
import useSWR from 'swr';
import { Loader2, Plus, Trash2 } from 'lucide-react';

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

import type {
  OrderDetails,
  Orders,
} from '@/components/table/orders/table-orders-schema';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@mcsph/ui/components/select';

import { formatCurrency, formatDateTime } from '@mcsph/utils/lib/format';
import {
  orderStatuses,
  payment,
} from '@/components/table/orders/table-orders-filter';
import { Textarea } from '@mcsph/ui/components/textarea';
import { Badge } from '@mcsph/ui/components/badge';
import { ScrollArea } from '@mcsph/ui/components/scroll-area';
import { useToast } from '@mcsph/ui/components/use-toast';
import { Switch } from '@mcsph/ui/components/switch';

import { browserClient } from '@mcsph/supabase/lib/client';
import { getProductBySku } from '@mcsph/supabase/ops/products';

/**
 * Modal dialog for order details.
 * Requires manual trigger of the dialog.
 *
 * optional `rowData` prop is a function that returns the data of the row
 * for editing/updating of the product.
 *
 * FIXME: This should use the <Form> component
 *        instead of manually creating the form
 *        in combination with react-hook-forms
 */
export function DialogOrder({
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
  rowData?: Orders;
}) {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [paid, setPaid] = useState(rowData?.payment_status);

  const { toast } = useToast();

  // gets the product orders for specific id
  const { data: productOrders, isLoading } = useSWR(
    rowData?.id ? `/orders/api?order=${rowData.id}` : null,
  );

  // Handles adding of products in the ScrollArea
  const orderProduct = async () => {
    // get the sku from the input
    // then add to the orders state
    const getSku = document.getElementById('order_product') as HTMLInputElement;
    const getQty = document.getElementById('order_qty') as HTMLInputElement;
    const productSku = getSku.value;
    const orderQty = getQty.value;

    // save the sku to the state which in turn
    // will be used to fetch the product details
    // when a change is detected
    const { data: productDetails } = await getProductBySku(productSku, {
      supabase: browserClient(),
    });

    if (productDetails) {
      // Check if the product with the same SKU already exists in the orders array
      const existingOrderIndex = orders.findIndex(
        (order) => order.product.sku === productDetails.sku,
      );

      if (existingOrderIndex !== -1) {
        // If it exists, update the quantity of that product by adding the new quantity to the existing one
        const updatedOrders = [...orders];
        updatedOrders[existingOrderIndex].qty += parseInt(orderQty);

        setOrders(updatedOrders);
      } else {
        // If it doesn't exist, add the new product to the orders array
        const productDetail: OrderDetails = {
          id: null,
          qty: parseInt(orderQty),
          product: productDetails,
        };

        setOrders([...orders, productDetail]);
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Product not found',
        description: 'Please check the SKU and try again.',
      });
    }
  };

  // Handles removing of products in the ScrollArea
  const removeProductFromOrder = async (sku: string) => {
    const updatedOrders = orders.filter((order) => order.product.sku !== sku);

    setOrders(updatedOrders);
  };

  useEffect(() => {
    setOrders(productOrders?.data ?? []);
  }, [productOrders, rowData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="data-[state=open]:animate-show data-[state=closed]:animate-hide h-max max-h-screen w-screen overflow-y-scroll rounded-lg md:min-h-max md:min-w-[750px] md:overflow-y-auto">
        <form onSubmit={save}>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {rowData ? (
                <>
                  <Badge
                    variant="outline"
                    className="mr-2 font-semibold"
                    title="Reference Number"
                  >
                    Ref. #: {rowData.id}
                  </Badge>
                </>
              ) : (
                <>Details of order that will be shown to the customer.</>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 block md:grid md:grid-flow-col md:grid-cols-1 md:gap-4">
            <div className="py-4 md:col-span-2 md:grid">
              {rowData && (
                <>
                  <div className="mb-3 items-center text-sm">
                    <Badge variant="secondary" className="mr-2 font-semibold">
                      Ordered at:
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

              <div className="mb-3 items-center">
                <Label htmlFor="order_status">Order Status</Label>

                <Select
                  name="order_status"
                  defaultValue={rowData?.order_status}
                  required
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Order Status" />
                  </SelectTrigger>
                  <SelectContent id="order_status">
                    <SelectGroup>
                      <SelectLabel>Order Status</SelectLabel>
                      {orderStatuses.map((orderStatus) => (
                        <SelectItem
                          key={orderStatus.value}
                          value={orderStatus.value}
                        >
                          <div className="flex items-center">
                            <orderStatus.icon className="mr-2 h-4 w-4" />
                            {orderStatus.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="customer_name">Customer</Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  defaultValue={rowData?.customers?.full_name}
                  className="col-span-3"
                  disabled={!!rowData}
                />
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="customer_email">Email</Label>
                <Input
                  id="customer_email"
                  name="customer_email"
                  defaultValue={rowData?.customers?.email}
                  className="col-span-3"
                  disabled={!!rowData}
                />
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="phone">Phone #</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={rowData?.customers?.phone}
                  className="col-span-3"
                  disabled={!!rowData}
                />
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="shipping_address">Shipping Address</Label>
                <Textarea
                  className="resize-none"
                  id="shipping_address"
                  defaultValue={rowData?.customers?.shipping_address ?? ''}
                  name="shipping_address"
                  disabled={!!rowData}
                  required
                />
              </div>

              <div className="mb-3 items-center">
                <Label htmlFor="billing_address">Billing Address</Label>
                <Textarea
                  className="resize-none"
                  id="billing_address"
                  defaultValue={rowData?.customers?.billing_address ?? ''}
                  name="billing_address"
                  disabled={!!rowData}
                />
              </div>
            </div>

            <Separator className="hidden md:block" orientation="vertical" />
            <Separator className="my-2 md:hidden" />

            <div className="items-center py-4">
              <div className="flex items-end">
                <div className="mr-2 items-center">
                  <Label htmlFor="order_product">SKU:</Label>
                  <Input
                    id="order_product"
                    name="order_product"
                    disabled={!!rowData}
                  />
                </div>
                <div className="w-[60px] items-center">
                  <Label htmlFor="order_qty">Qty.</Label>
                  <Input
                    id="order_qty"
                    name="order_qty"
                    type="number"
                    defaultValue={1}
                    min={1}
                    disabled={!!rowData}
                  />
                </div>
                <div className="ml-2 items-center">
                  <Button
                    size="icon"
                    type="button"
                    onClick={orderProduct}
                    disabled={!!rowData}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="my-3 h-[70%] w-full rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    Products Ordered:
                  </h4>

                  {isLoading ? (
                    <Loader2 className="mx-auto my-6 w-full animate-spin items-center justify-center" />
                  ) : (
                    <>
                      {/* list of products that were ordered */}
                      {orders?.map((order) => (
                        <>
                          <div
                            key={order.product.sku}
                            className="w-full text-sm"
                          >
                            <div className="flex w-full items-center">
                              {!rowData && (
                                <Button
                                  variant="ghost"
                                  className="mr-2 text-red-500"
                                  onClick={() =>
                                    removeProductFromOrder(order.product.sku)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}

                              <div className="block w-full">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold">
                                    {order.product.sku}
                                  </span>
                                  <span className="text-right">
                                    x{order.qty}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span>
                                    {order.product.name} / {order.product.type}
                                  </span>
                                  <span className="ml-auto text-right font-semibold">
                                    {formatCurrency(
                                      order.product.price * order.qty,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator className="my-2" />
                        </>
                      ))}
                    </>
                  )}
                </div>
              </ScrollArea>

              <div className="my-2 flex items-center justify-between">
                <div>
                  <Label htmlFor="payment">Payment Method</Label>

                  <Select
                    name="payment"
                    defaultValue={rowData?.payment}
                    disabled={!!rowData}
                    required
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent id="payment">
                      <SelectGroup>
                        <SelectLabel>Payment Method</SelectLabel>
                        {payment.map((paymentStatus) => (
                          <SelectItem
                            key={paymentStatus.value}
                            value={paymentStatus.value}
                          >
                            <div className="flex items-center">
                              <paymentStatus.icon className="mr-2 h-4 w-4" />
                              {paymentStatus.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="ml-2 text-right">
                  <Label htmlFor="total_price" className="text-sm">
                    Total.
                  </Label>
                  <p className="font-semibold">
                    {rowData ? (
                      <>{formatCurrency(rowData?.total_price ?? 0)}</>
                    ) : (
                      <>
                        {formatCurrency(
                          orders.reduce(
                            (a, b) => a + b.product.price * b.qty,
                            0,
                          ),
                        )}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <div className="flex place-content-end items-center">
              <div className="flex items-center">
                <Label htmlFor="payment_status" className="mx-2 capitalize">
                  {paid ? 'Paid' : 'Unpaid'}
                </Label>
                <Switch
                  id="payment_status"
                  defaultChecked={paid}
                  name="payment_status"
                  onClick={() => setPaid(!paid)}
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
