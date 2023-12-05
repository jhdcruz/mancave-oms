import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard | Man Cave Supplies PH, Inc.',
};

export default function Index() {

  redirect('/inventory');

  return <>Wassup</>;
}
