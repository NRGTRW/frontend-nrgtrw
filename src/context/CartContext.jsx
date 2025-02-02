// CartContext.jsx
import React, { createContext, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import useSWR from "swr";
import { getToken } from "./tokenUtils";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 1) Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      console.log("🛒 Fetched Cart Data:", response.data);

      // Here we ensure the cart item always has the correct image:
      //  - If selectedColor is a URL, use it
      //  - Otherwise use the product's default imageUrl
      //  - Otherwise fall back to "/default-image.png"
      return response.data.map((item) => ({
        ...item,
        imageUrl: item.selectedColor || item.imageUrl || "/default-image.png",
      }));
    } catch (error) {
      console.error("❌ Failed to load cart:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to load cart.");
      return [];
    }
  };

  // 2) Use SWR to load (and cache) the cart
  const { data: cart = [], mutate } = useSWR(getToken() ? "/cart" : null, fetchCart);

  // 3) Add to cart
  const addToCart = async (product) => {
    if (!getToken()) {
      toast.error("You need to be logged in to add items to your cart.");
      return;
    }

    try {
      const requestData = {
        productId: Number(product.productId),
        name: product.name,
        price: product.price,
        selectedSize: product.selectedSize || null,
        selectedColor: product.selectedColor || null,
        quantity: product.quantity || 1,
      };

      console.log("📤 Sending Cart Data:", requestData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart`,
        requestData,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      if (response.status === 201 || response.status === 200) {
        // Refresh cart automatically
        mutate();
      } else {
        toast.error("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("❌ Cart API Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Could not add item to cart.");
    }
  };

  // 4) Remove from cart (with optimistic update)
  const removeFromCart = async (cartItemId) => {
    if (!cartItemId) {
      toast.error("Error: Invalid cart item.");
      return;
    }

    // Immediately remove the item from our local cart (optimistic)
    mutate((currentCart) => currentCart.filter((item) => item.cartItemId !== cartItemId), false);

    try {
      console.log(`📤 Removing item with cartItemId: ${cartItemId}`);

      await toast.promise(
        axios.delete(`${import.meta.env.VITE_API_URL}/cart/${cartItemId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        {
          pending: "Removing item from cart...",
          // success: "Item removed from cart!",
          error: "Failed to remove item from cart.",
        }
      );

      // Finally revalidate to ensure we have the latest state from the server
      mutate();
    } catch (error) {
      console.error("❌ Delete error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Could not remove item from cart.");

      // If there's an error, re‐fetch the cart to revert the optimistic update
      mutate();
    }
  };

  // 5) Get total quantity
  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, getTotalQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
