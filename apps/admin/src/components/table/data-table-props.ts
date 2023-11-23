import { Row, Table } from '@tanstack/react-table';

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
