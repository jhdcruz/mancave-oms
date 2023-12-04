import { Metadata } from 'next';
import TableEmployees from '@/components/table/employees/table-employees';

export const metadata: Metadata = {
  title: 'Admin | Man Cave Supplies PH, Inc.',
};

export default async function Inventory() {
  return (
    <div className="container h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Employees Directory</h2>
          <p className="text-muted-foreground">
            See the list of employees with access.
          </p>
        </div>
      </div>

      <TableEmployees />
    </div>
  );
}
