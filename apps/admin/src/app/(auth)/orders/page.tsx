import { Metadata } from 'next';

import TableOrders from '@/components/table/orders/table-orders';

export const metadata: Metadata = {
  title: 'Orders | Man Cave Supplies PH, Inc.',
};

export default async function Orders() {
  return (
    <div className="container h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            List of orders made by the customers.
          </p>
        </div>
      </div>

      <TableOrders />
    </div>
  );
}
