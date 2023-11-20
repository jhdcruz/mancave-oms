import {
  Building,
  LayoutDashboard,
  Plus,
  ShoppingCart,
  Warehouse,
} from 'lucide-react';

export const externalRoutes = [
  {
    icon: <ShoppingCart className="mr-2 h-4 w-4" />,
    icon_button: <ShoppingCart size={20} />,
    href: '/cart',
    title: 'Shopping Cart',
    description: 'View the your shopping cart.',
    external: true,
  },
];

const routes = [
  {
    trigger: 'Dashboard',
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    name: 'Dashboard',
    description: 'Overview of the system.',
    href: '/',
  },
  {
    trigger: 'Products',
    icon: <Warehouse className="mr-2 h-4 w-4" />,
    name: 'Product Catalogue',
    description: 'View our product catalogue.',
    href: '/inventory',
    actions: [
      {
        icon: <Plus className="mr-2 h-4 w-4" />,
        href: '/products?filter=recent',
        title: 'Recently added products',
        description: 'View recently added products.',
      },
    ],
  },
  {
    trigger: 'About Us',
    icon: <Building className="mr-2 h-4 w-4" />,
    name: 'About the company',
    description: "Learn about the company's humble beginnings.",
    href: '/about',
  },
];

export default routes;
