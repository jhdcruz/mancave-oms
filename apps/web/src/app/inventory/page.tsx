import dynamic from 'next/dynamic';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Man Cave Supplies PH, Inc.',
};

const DynamicProductPage = dynamic(() => import('app/inventory/page-client'), { ssr: false });

export default function Index() {
  return <DynamicProductPage />;
}