import {
  Banknote,
  ClipboardCheck,
  CreditCard,
  Package,
  PackageCheck,
  PackageSearch,
  PackageX,
  Truck,
  XCircle,
} from 'lucide-react';

export const orderStatuses = [
  {
    value: 'Processing',
    label: 'Processing',
    icon: PackageSearch,
  },
  {
    value: 'Packed',
    label: 'Packed',
    icon: Package,
  },
  {
    value: 'Shipped',
    label: 'Shipped',
    icon: PackageCheck,
  },
  {
    value: 'Fulfilled',
    label: 'Fulfilled',
    icon: ClipboardCheck,
  },
  {
    value: 'Returned',
    label: 'Returned',
    icon: PackageX,
  },
  {
    value: 'Return Request',
    label: 'Return Request',
    icon: Truck,
  },
  {
    value: 'Cancelled',
    label: 'Cancelled',
    icon: XCircle,
  },
];

export const payment = [
  {
    value: 'Cash',
    label: 'Cash',
    icon: Banknote,
  },
  {
    value: 'Card',
    label: 'Credit/Debit Card',
    icon: CreditCard,
  },
];

export const orderDue = [
  {
    value: 'recent',
    label: 'Recent (24h)',
  },
  {
    value: '3d',
    label: '3 Days (3d)',
  },
  {
    value: '7d',
    label: 'Week (7d)',
  },
  {
    value: 'overdue',
    label: 'Overdue (1m+)',
  },
];
