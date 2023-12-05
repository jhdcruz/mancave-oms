import { Metadata } from 'next';
import TableCustomers from '@/components/table/customers/table-customers';

export const metadata: Metadata = {
  title: 'Admin | Man Cave Supplies PH, Inc.',
};

export default async function Inventory() {
  return (
    <div className="container h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers Directory</h2>
          <p className="text-muted-foreground">
            See your company's customers.
          </p>
        </div>
      </div>

      <TableCustomers />
    </div>
  );
}
