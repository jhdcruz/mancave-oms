"use client"
import { useEffect, useState } from 'react';
import { fetchProducts, Product } from 'data/products';
import { ScrollArea } from '@mcsph/ui/components/scroll-area';
import Link from 'next/link';
import { Button } from '@mcsph/ui/components/button';
import { Separator } from '@mcsph/ui/components/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@mcsph/ui/components/sheet';
import { Badge } from '@mcsph/ui/components/badge';

interface CartItem extends Product {
  quantity: number;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };

    fetchData();
  }, []);

  const addToCart = (productId: number) => {
    const selectedProduct = products.find((product) => product.id === productId);
    const isInCart = cart.some((item) => item.id === productId);

    if (selectedProduct && !isInCart) {
      setCart((prevCart) => [...prevCart, { ...selectedProduct, quantity: 1 }]);
      setIsSheetOpen(true); 
      console.log(`Product with ID ${productId} added to cart.`);
    } else if (isInCart) {
      console.log(`Product with ID ${productId} is already in the cart.`);
    } else {
      console.log(`Product with ID ${productId} not found.`);
    }
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

  const proceedToCheckout = () => {
    closeSheet();
    window.location.href = '/checkout';
  };

  const continueShopping = () => {
    closeSheet();
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mx-4 mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Top Products</h2>
          <p className="text-sm text-muted-foreground">Top picks for you. Updated daily.</p>
        </div>
      </div>

      <div className="relative mx-4">
        <ScrollArea>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 pb-4">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-300 p-4 rounded-md cursor-pointer flex flex-col items-center">
                <Link href={`/products/${product.id}`}>
                  <div className="relative w-full h-48 mb-2 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-center">{product.name}</h2>
                  <p className="text-center">Quantity: {product.qty}</p>
                  <p className="text-center">₱{product.price}</p>
                </Link>
                <Button onClick={() => addToCart(product.id)} className="mt-auto">
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Cart Sheet */}
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
                  <Badge style={{ color: '#000', margin: '0 10px', fontSize: '1.2em' }}>{item.quantity}</Badge>
                  <Button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} style={{ fontSize: '1em', padding: '5px' }}>+</Button>
                  <Button onClick={() => handleRemoveFromCart(item.id)} style={{ marginLeft: '10px', color: 'red', fontSize: '1em', padding: '5px' }}>
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
            <SheetClose asChild>
              <Button onClick={continueShopping}>Continue Shopping</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}