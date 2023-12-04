import { AlertTriangle, Contact } from 'lucide-react';

export const active = [
  {
    value: true,
    label: 'Disabled',
  },
  {
    value: false,
    label: 'Active',
  },
];

export const roles = [
  {
    value: 'Admin',
    label: 'Admin',
    icon: AlertTriangle,
  },
  {
    value: 'Staff',
    label: 'Staff',
    icon: Contact,
  },
];
