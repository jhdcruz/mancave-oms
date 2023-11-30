import { FormEvent, useEffect, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';

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

import {
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

import { formatDateTime } from '@mcsph/utils/lib/format';
import {
  orderStatuses,
  payment,
} from '@/components/table/orders/table-orders-filter';
import { Textarea } from '@mcsph/ui/components/textarea';
import { Badge } from '@mcsph/ui/components/badge';
import useSWR from 'swr';
import { ScrollArea } from '@mcsph/ui/components/scroll-area';

/**
 * Modal dialog for order details.
 * Requires manual trigger of the dialog.
 *
 * optional `rowData` prop is a function that returns the data of the row
 * for editing/updating of the product.
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
  const [sku, searchSku] = useState<String>();

  // gets the product orders for specific id
  const { data: productOrders, isLoading } = useSWR(
    `/orders/api?order=${rowData?.id}`,
  );

  // getting the product details from SKU from the input
  const { data: productDetails } = useSWR(`/inventory/api?sku=${sku}`);

  const orderProduct = async () => {
    // get the sku from the input
    // then add to the orders state
    const getSku = document.getElementById('product_item') as HTMLInputElement;
    const getQty = document.getElementById('qty') as HTMLInputElement;
    const productSku = getSku.value;
    const orderQty = getQty.value;

    // save the sku to the state which in turn
    // will be used to fetch the product details
    // when a change is detected
    searchSku(productSku);

    // append the bought qty
    const productDetail: OrderDetails = [...productDetails, { qty: orderQty }];

    // get the product details from the api
    // then add to the orders state
    setOrders([...orders, productDetail]);
  };

  useEffect(() => {
    setOrders(productOrders?.data ?? []);
  }, [productOrders, rowData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="data-[state=open]:animate-show data-[state=closed]:animate-hide h-max max-h-screen w-screen overflow-y-scroll rounded-lg md:min-h-max md:min-w-[700px] md:overflow-y-auto">
        <form onSubmit={save}>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Details of order that will be shown to the customer.
            </DialogDescription>
          </DialogHeader>

          <div className="block md:grid md:grid-flow-col md:grid-cols-1 md:gap-4">
            <div className="py-4 md:col-span-2 md:grid">
              {rowData && (
                <div className="text-sm">
                  <div className="mb-1 items-center">
                    <Badge
                      variant="secondary"
                      className="text-sm font-semibold"
                      title="Reference number"
                    >
                      {rowData.id}
                    </Badge>
                  </div>

                  <div className="mb-1 items-center">
                    <p>
                      Ordered at:{' '}
                      <span className="font-semibold">
                        {formatDateTime(rowData.created_at)}
                      </span>
                    </p>
                  </div>

                  <div className="mb-1 items-center">
                    <p>
                      Last Updated:{' '}
                      <span className="font-semibold">
                        {formatDateTime(rowData.last_updated)}
                      </span>
                    </p>
                  </div>

                  <Separator />
                </div>
              )}

              <div className="mb-3 items-center">
                <Select
                  name="status"
                  defaultValue={rowData?.order_status}
                  required
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Order Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Order Status</SelectLabel>
                      {orderStatuses.map((orderStatus) => (
                        <SelectItem
                          key={orderStatus.value}
                          value={orderStatus.value}
                        >
                          <orderStatus.icon className="mr-2 h-4 w-4" />
                          {orderStatus.label}
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

              <div className="mb-3 items-center">
                <Label htmlFor="status">Order Status</Label>

                <Select
                  name="status"
                  defaultValue={rowData?.payment_status}
                  required
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Payment Status</SelectLabel>
                      {payment.map((paymentStatus) => (
                        <SelectItem
                          key={paymentStatus.value}
                          value={paymentStatus.value}
                        >
                          <paymentStatus.icon className="mr-2 h-4 w-4" />
                          {paymentStatus.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="hidden md:block" orientation="vertical" />

            <div className="items-center py-4">
              <ScrollArea className="h-[50%] rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    Products Ordered:
                  </h4>

                  {isLoading ? (
                    <Loader2 className="my-4 animate-spin items-center justify-center" />
                  ) : (
                    <>
                      {/* list of products that were ordered */}
                      {orders?.map((order) => (
                        <>
                          <div key={order.id} className="text-sm">
                            <span>{order.products.sku}</span>
                            <span className="text-right">x{order.qty}</span>
                            <br />
                            <span>{order.products.type}</span>
                            <span className="text-right">
                              {order.products.price * order.qty}
                            </span>
                          </div>
                          <Separator className="my-2" />
                        </>
                      ))}
                    </>
                  )}
                </div>
              </ScrollArea>

              <div className="flex items-center">
                <div className="items-center">
                  <Label htmlFor="product_item">Product:</Label>
                  <Input
                    id="product_item"
                    name="product"
                  />
                </div>
                <div className="mb-3 items-center">
                  <Label htmlFor="qty">Qty.</Label>
                  <Input
                    id="qty"
                    name="qty"
                    type="number"
                    defaultValue={1}
                    min={1}
                  />
                </div>
                <div className="ml-1 items-center">
                  <Button size="icon" onClick={orderProduct}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button disabled={loading} type="submit">
              {loading ? <Loader2 className="animate-spin" /> : <>Save</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
