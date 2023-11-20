import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Man Cave Supplies PH, Inc.',
    short_name: 'MC Supplies',
    description:
      'Unleash the power of personalized interiors, where every piece tells a story. Transform your home into a haven of comfort and sophistication with our handpicked furnishings. Explore the art of living well with Man Cave Supplies PH – where every corner becomes a masterpiece.',
    start_url: '/',
    display: 'standalone',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
