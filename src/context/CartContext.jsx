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

  // Add the missing function to calculate the total quantity
  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        getTotalQuantity, // Expose this function to the context
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
