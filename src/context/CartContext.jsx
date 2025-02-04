import React, { createContext, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import useSWR from "swr";
import { getToken } from "./tokenUtils";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data.map((item) => ({
        ...item,
        imageUrl: item.selectedColor || item.imageUrl || "/default-image.png",
      }));
    } catch (error) {
      console.error("Failed to load cart:", error.response?.data || error.message);
      return [];
    }
  };

  const { data: cart = [], mutate } = useSWR(getToken() ? "/cart" : null, fetchCart);

  const addToCart = async (product) => {
    if (!getToken()) {
      toast.error("🔒 Please log in to add items to your cart.");
      return;
    }
  
    try {
      const requestData = {
        productId: Number(product.productId),
        name: product.name,
        price: product.price,
        selectedSize: product.selectedSize,
        selectedColor: product.selectedColor,
        quantity: product.quantity,
        imageUrl: product.imageUrl
      };
  
      console.log("Sending cart data:", requestData); // Debug log
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart`,
        requestData,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
  
      mutate(); // Refresh cart data
      return response.data;
    } catch (error) {
      console.error("Cart Error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      const errorMessage = error.response?.data?.message 
        || "Failed to update cart. Please check your input.";
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId) => {
    mutate((currentCart) => currentCart.filter((item) => item.cartItemId !== cartItemId), false);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      mutate();
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      mutate();
    }
  };

  const getTotalQuantity = () => cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotalQuantity }}>
      {children}
    </CartContext.Provider>
  );
};