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
  },
];

const routes = [
  {
    trigger: 'Products',
    icon: <Warehouse className="mr-2 h-4 w-4" />,
    name: 'Product Catalogue',
    description: 'View our product catalogue.',
    href: '/inventory',
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
