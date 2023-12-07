"use client"
import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { fetchProductById, fetchProducts, Product } from 'data/products';
import { Badge } from "@mcsph/ui/components/badge";
import { Button } from "@mcsph/ui/components/button";
import { Input } from '@mcsph/ui/components/input';
import { Label } from '@mcsph/ui/components/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@mcsph/ui/components/sheet';
import { Separator } from '@mcsph/ui/components/separator';

interface CartItem {
  id: number;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
}

function ProductsClientComponent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      const productId = searchParams.get('productId') || pathname.split('/').pop();

      if (productId) {
        const singleProduct = await fetchProductById(productId);
        setProduct(singleProduct);
      } else {
        const allProducts = await fetchProducts();
        setProducts(allProducts);
      }
    };

    fetchProductData();
  }, [pathname, searchParams]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const addToCart = () => {
    if (product) {
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedCart = cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
        setCart(updatedCart);
      } else {

        setCart([...cart, { id: product.id, name: product.name, image_url: product.image_url, price: product.price, quantity }]);
      }

      setIsSheetOpen(true);
    }
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  const proceedToCheckout = () => {
    closeSheet();
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
  };

  const handleRemoveFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px', height: '100vh' }}>
      {product ? (
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1000px' }}>
          <div style={{ width: '700px', height: '500px', overflow: 'hidden', marginRight: '40px', backgroundColor: 'transparent' }}>
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
            />
          </div>
          <div style={{ width: '700px', border: '4px solid #000', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5em', marginBottom: '15px' }}>{product.name}</h2>
            <Badge style={{ color: '#000', margin: '0 0 15px 0', fontSize: '1.2em' }}>Price: ₱{product.price.toFixed(2)}</Badge>
            <p style={{ fontSize: '1.5em', marginBottom: '15px', opacity: 0.8 }}>{product.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
              <Button onClick={decreaseQuantity} style={{ fontSize: '1.5em', padding: '10px' }}>-</Button>
              <Badge style={{ color: '#000', margin: '0 10px', fontSize: '1em' }}>{quantity}</Badge>
              <Button onClick={increaseQuantity} style={{ fontSize: '1.5em', padding: '10px' }}>+</Button>
            </div>
            <Button onClick={addToCart} style={{ fontSize: '1.5em' }}>
              Add to Cart
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: '2.5em', marginBottom: '20px' }}>All Products</h2>
          <ul style={{ padding: '0', listStyle: 'none' }}>
            {products.map((p) => (
              <li key={p.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', maxWidth: '1000px' }}>
                <div style={{ width: '700px', height: '500px', overflow: 'hidden', marginRight: '40px', backgroundColor: 'transparent' }}>
                  <img
                    src={p.image_url}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ width: '700px', border: '4px solid #000', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2em', marginBottom: '15px' }}>{p.name}</h3>
                  <Badge style={{ color: '#000', margin: '0 0 15px 0', fontSize: '1.2em' }}>Price: ₱{p.price.toFixed(2)}</Badge>
                  <p style={{ fontSize: '1.2em', marginBottom: '15px' }}>{p.description}</p>
                  <Button style={{ fontSize: '1.5em' }}>View Details</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    <Sheet open={isSheetOpen}>
        <SheetContent style={{ width: '50%', maxWidth: '500px' }}>
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
            <Separator style={{ margin: '16px 0' }} />
          </SheetHeader>

          <SheetDescription>
            {cart.map((item, index) => (
              <div key={item.id} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <img src={item.image_url} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', marginRight: '10px' }} />
                  <div style={{ flex: 1 }}>
                    <p>{item.name}</p>
                    <p>Price: ₱{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity === 1} style={{ fontSize: '1em', padding: '5px' }}>
                    -
                  </Button>
                  <Badge style={{ margin: '0 10px', fontSize: '1.2em' }}>{item.quantity}</Badge>
                  <Button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} style={{ fontSize: '1em', padding: '5px' }}>+</Button>
                  <Button variant="destructive" onClick={() => handleRemoveFromCart(item.id)} style={{ marginLeft: '10px', fontSize: '1em', padding: '5px' }}>
                    Delete
                  </Button>
                </div>
                {index < cart.length - 1 && <hr style={{ width: '100%', border: '1px solid #ccc', margin: '10px 0' }} />}
              </div>
            ))}
            <Separator style={{ margin: '16px 0' }} />
          </SheetDescription>
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={proceedToCheckout}>Proceed to Checkout</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProductsClientComponent;