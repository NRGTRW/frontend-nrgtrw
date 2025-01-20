import React, { createContext, useContext, useState } from "react";

// Create the CartContext
const CartContext = createContext();

// Custom hook to use CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.selectedSize === item.selectedSize &&
          cartItem.selectedColor === item.selectedColor
      );

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem === existingItem
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (item) => {
    setCart((prevCart) =>
      prevCart.filter(
        (cartItem) =>
          cartItem.id !== item.id ||
          cartItem.selectedSize !== item.selectedSize ||
          cartItem.selectedColor !== item.selectedColor
      )
    );
  };

  const moveToWishlist = (item) => {
    removeFromCart(item);
    setWishlist((prevWishlist) => [...prevWishlist, item]);
  };

  const getTotalQuantity = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        moveToWishlist,
        getTotalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
