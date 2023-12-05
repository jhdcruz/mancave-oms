import { AlertTriangle, Contact } from 'lucide-react';

export const active = [
  {
    value: false,
    label: 'Disabled',
  },
  {
    value: true,
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
