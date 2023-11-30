import { Metadata } from 'next';

import TableProducts from '@/components/table/products/table-products';

export const metadata: Metadata = {
  title: 'Inventory | Man Cave Supplies PH, Inc.',
};

export default async function Inventory() {
  return (
    <div className="container h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Overview of the products being sold.
          </p>
        </div>
      </div>

      <TableProducts />
    </div>
  );
}
