import type {
  CommandActionProps,
  CommandProps,
} from '@mcsph/ui/containers/search-command';
import {
  Activity,
  LayoutDashboard,
  Percent,
  Plus,
  ServerCog,
  ShieldEllipsis,
  ShieldPlus,
  UserPlus,
  Users2,
  Warehouse,
} from 'lucide-react';

export const externalRoutes: CommandActionProps[] = [
  {
    icon: <Activity className="mr-2 h-4 w-4" />,
    href: 'https://app.axiom.co/sia305-yewe/dashboards/nJkqv1vu228EakiXm',
    title: 'Health',
    description: "Monitor the system's performance and health.",
    external: true,
  },
  {
    icon: <ShieldEllipsis className="mr-2 h-4 w-4" />,
    href: 'https://app.axiom.co/sia305-yewe/stream/vercel?caseSensitive=0&ig=&q=',
    title: 'Logs',
    description: 'View the system logs and events.',
    external: true,
  },
  {
    icon: <ServerCog className="mr-2 h-4 w-4" />,
    href: 'https://mcsph.sentry.io/projects/mancave-admin/?issuesType=unhandled&project=4506235118157824',
    title: 'Sentry',
    description: 'Check for system errors and issues.',
    external: true,
  },
];

export const mainRoutes: CommandProps[] = [
  {
    trigger: 'Dashboard',
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    name: 'Dashboard',
    description: 'Overview of the system.',
    href: '/',
  },
  {
    trigger: 'Inventory',
    icon: <Warehouse className="mr-2 h-4 w-4" />,
    name: 'Overview',
    description: 'View the entire product inventory.',
    href: '/inventory',
    actions: [
      {
        icon: <Plus className="mr-2 h-4 w-4" />,
        href: '/inventory?action=new',
        title: 'New product',
        description: 'Add new product to the inventory',
      },
    ],
  },
  {
    trigger: 'Orders',
    icon: <Percent className="mr-2 h-4 w-4" />,
    name: 'Orders / Purchases',
    description: 'View the entire product inventory.',
    href: '/orders',
    actions: [
      {
        icon: <Plus className="mr-2 h-4 w-4" />,
        href: '/orders?action=new',
        title: 'Recent Orders',
        description: 'Track recent orders made.',
      },
    ],
  },
  {
    trigger: 'Staffs',
    icon: <ShieldPlus className="mr-2 h-4 w-4" />,
    name: 'User Management',
    description: 'Manage system users/employees',
    href: '/admin',
    actions: [
      ...externalRoutes,
      {
        icon: <UserPlus className="mr-2 h-4 w-4" />,
        href: '/admin?action=new',
        title: 'Employees',
        description: 'Add new employee.',
      },
    ],
  },
  {
    trigger: 'Customers',
    icon: <Users2 className="mr-2 h-4 w-4" />,
    name: 'Customers',
    description: 'Manage system customers.',
    href: '/customers',
    actions: [
      {
        icon: <UserPlus className="mr-2 h-4 w-4" />,
        href: '/customers?action=new',
        title: 'Customers',
        description: 'Add new customer.',
      },
    ]
  }
];

const routes = [...mainRoutes, ...externalRoutes];

export default routes;
