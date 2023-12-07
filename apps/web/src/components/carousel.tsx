"use client"
import React, { useState, useEffect } from 'react';
import { Product, fetchProducts } from 'data/products';
import { Separator } from '@mcsph/ui/components/separator'; 

interface LandingCarouselProps {
  images: string[];
}

const LandingCarousel: React.FC<LandingCarouselProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentSlide, images.length]);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      const allProducts = await fetchProducts();
      const randomProducts = allProducts.sort(() => Math.random() - 0.5).slice(0, 3);
      setProducts(randomProducts);
    };

    fetchRandomProducts();
  }, []);

  if (images.length === 0) {
    return <div>No images provided.</div>;
  }

  const redirectToProduct = (productId: number) => {
    window.location.href = `/products/${productId}`;
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '50vh',
        }}
      >
        {images.map((imageUrl, index) => (
          <div key={index} style={{ position: 'absolute', width: '100%', height: '100%', opacity: index === currentSlide ? 1 : 0 }}>
            <img
              src={imageUrl}
              alt={`Landscape ${index + 1}`}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        ))}
      </div>
      <Separator style={{ margin: '20px 0' }} />
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '24px', fontWeight: 'bold' }}>Featured Products</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '-20px' }}>
          {products.map((product) => (
            <div key={product.id} style={{ margin: '20px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: '16px', width: '350px', height: '300px' }} onClick={() => redirectToProduct(product.id)}>
              <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '70%', objectFit: 'cover', borderRadius: '8px' }} />
              <p style={{ margin: '8px 0', fontSize: '20px', fontWeight: 'bold' }}>{product.name}</p>
              <p style={{ margin: '8px 0', fontSize: '18px' }}>${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: '20px 0' }} />
      </div>
    </div>
  );
};

export default LandingCarousel;