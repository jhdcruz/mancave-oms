import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Staff Portal | Man Cave Supplies PH, Inc.',
    short_name: 'MCSPH Staff',
    description: 'Employee portal of Man Cave Supplies PH, Inc.',
    start_url: '/',
    display: 'standalone',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
