// CartPage.js
import React from 'react';

const CartPage = ({ cart }: { cart: any }) => {
  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {cart.map((item: any) => (
          <li key={item.id}>
            {item.name} - ₱{item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartPage;
