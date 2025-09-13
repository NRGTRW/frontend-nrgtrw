import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import useSWR from "swr";
import { getToken } from "./tokenUtils";

// Create a singleton context using global variable to prevent multiple instances
if (!window.__CART_CONTEXT__) {
  const contextId = Math.random().toString(36).substr(2, 9);
  window.__CART_CONTEXT__ = createContext({
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    getTotalQuantity: () => 0,
    mutate: () => {},
    _isDefault: true, // Add identifier to distinguish default from provider value
    _contextId: contextId, // Add unique identifier
  });
}

const CartContext = window.__CART_CONTEXT__;

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};

export const CartProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = getToken();
      if (newToken !== token) {
        setToken(newToken);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mappedData = response.data.map((item) => ({
        ...item,
        imageUrl: item.selectedColor || item.imageUrl || "/default-image.png",
      }));
      return mappedData;
    } catch (error) {
      return [];
    }
  };

  const { data: cart = [], mutate } = useSWR(
    token ? `cart-${token}` : null,
    fetchCart,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0, // Disable auto-refresh
    }
  );

  const addToCart = async (product) => {
    if (!token) {
      toast.error("🔒 Please log in to add items to your cart.");
      return;
    }
    try {
      // Always use product.id as productId
      const productId = product.id || product.productId;
      const requestData = {
        productId: Number(productId),
        name: product.name,
        price: product.price,
        selectedSize: product.selectedSize,
        selectedColor: product.selectedColor,
        quantity: product.quantity,
        imageUrl: product.imageUrl,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      mutate(); // Refresh cart data
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add item to cart. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId) => {
    mutate(
      (currentCart) =>
        currentCart.filter((item) => item.cartItemId !== cartItemId),
      false,
    );
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mutate();
    } catch (error) {
      mutate();
    }
  };

  const getTotalQuantity = () => {
    const total = cart.reduce((total, item) => total + item.quantity, 0);
    return total;
  };

  const contextValue = { cart, addToCart, removeFromCart, getTotalQuantity, mutate, _isDefault: false, _contextId: CartContext._currentValue?._contextId || 'provider' };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
