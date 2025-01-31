import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import useSWR from "swr";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { authToken } = useAuth();

  // ✅ Fetch cart from backend
  const fetchCart = async () => {
    if (!authToken) return [];
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Failed to load cart:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to load cart.");
      return [];
    }
  };

  const { data: cart = [], mutate } = useSWR(authToken ? "/cart" : null, fetchCart);

  useEffect(() => {
    if (authToken) {
      mutate();
    }
  }, [authToken]);

  const addToCart = async (product) => {
    if (!authToken) {
      toast.error("You need to be logged in to add items to your cart.");
      return;
    }

    try {
      const requestData = {
        productId: Number(product.id),
        selectedSize: product.selectedSize || null,
        selectedColor: product.selectedColor || null,
        quantity: product.quantity || 1,
      };

      console.log("📤 Sending Cart Data:", requestData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart`,
        requestData,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.status === 201 || response.status === 200) {
        mutate(); // ✅ Refresh cart automatically
        toast.success(`Item added to your cart.`);
      } else {
        toast.error("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("❌ Cart API Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Could not add item to cart.");
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      if (!cartItemId) {
        console.error("❌ Invalid item: Missing cartItemId", cartItemId);
        toast.error("Error: Invalid item.");
        return;
      }
  
      console.log(`📤 Removing item with cartItemId: ${cartItemId}`);
  
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
  
      if (response.status === 200) {
        console.log("✅ Removed item from your cart:", response.data);
        mutate(); // Refresh cart
        toast.success("Item removed from your cart.");
      } else {
        throw new Error("Failed to remove item from cart.");
      }
    } catch (error) {
      console.error("❌ Delete error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Could not remove item from cart.");
    }
  };
    
  

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotalQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
