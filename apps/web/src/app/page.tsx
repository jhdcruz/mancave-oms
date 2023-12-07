import { Metadata } from 'next';
import React from 'react';
import LandingCarousel from '@/components/carousel';
import { Separator } from '@mcsph/ui/components/separator';

export const metadata: Metadata = {
  title: 'About Us | Man Cave Supplies PH, Inc.',
};

export default function AboutUs() {
  const images = [
    'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80',
    'https://images.unsplash.com/photo-1463620910506-d0458143143e?q=80',
    'https://images.unsplash.com/photo-1627226325480-f46163bc38c2?q=80',
    'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80',
    'https://images.unsplash.com/photo-1613082442324-62ef5249275e?q=80',
  ];

  return (
    <div style={{ margin: '0', padding: '0', overflow: 'hidden' }}>
      <LandingCarousel images={images} />

      <div style={{ padding: '8px 0' }}>
        <Separator />
      </div>
    </div>
  );
}