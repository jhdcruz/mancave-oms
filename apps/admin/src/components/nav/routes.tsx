import type {
  CommandActionProps,
  CommandProps,
} from '@mcsph/ui/containers/search-command';
import {
  Activity,
  ArchiveX,
  Hourglass,
  LayoutDashboard,
  PackageCheck,
  Percent,
  Plus,
  ServerCog,
  ShieldEllipsis,
  TrendingDown,
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
      {
        icon: <TrendingDown className="mr-2 h-4 w-4" />,
        href: '/inventory?filter=low',
        title: 'Low Stock',
        description: 'Products that are running out of stock.',
      },
      {
        icon: <ArchiveX className="mr-2 h-4 w-4" />,
        href: '/inventory?filter=out',
        title: 'Out of Stock',
        description: 'View products that are out of stock.',
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
        href: '/orders?filter=recent',
        title: 'Recent Orders',
        description: 'Track recent orders made.',
      },
      {
        icon: <Hourglass className="mr-2 h-4 w-4" />,
        href: '/orders?filter=overdue',
        title: 'Overdue Orders',
        description: 'See orders that requires a follow-up.',
      },
      {
        icon: <PackageCheck className="mr-2 h-4 w-4" />,
        href: '/orders?filter=out',
        title: 'Fulfilled Orders',
        description: 'View fulfilled orders.',
      },
    ],
  },
  {
    trigger: 'Admin',
    icon: <Users2 className="mr-2 h-4 w-4" />,
    name: 'User Management',
    description: 'Manage system employees and users.',
    href: '/admin',
    actions: externalRoutes,
  },
];

const routes = [...mainRoutes, ...externalRoutes]

export default routes;
