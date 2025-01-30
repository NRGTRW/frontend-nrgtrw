import axios from "axios";
import { createContext, useContext } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import useSWR from "swr";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const { authToken } = useAuth();
  
  async function fetchWishlist() {
    if (!authToken) return [];
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("✅ Wishlist fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to load wishlist:", error.message);
      toast.error("Failed to load wishlist.");
      return [];
    }
  }

  const { data: wishlist = [], mutate } = useSWR(authToken ? "/wishlist" : null, fetchWishlist);

  // ✅ Define `loadWishlist`
  const loadWishlist = async () => {
    await mutate(); // Refresh wishlist
  };

  const addToWishlist = async (product) => {
    if (!authToken) {
      toast.error("You need to be logged in to add items to your wishlist.");
      return;
    }

    try {
      const requestData = {
        productId: Number(product.id),
        selectedSize: product.selectedSize || null,
        selectedColor: product.selectedColor || null,
        quantity: product.quantity || 1,
      };

      console.log("📤 Sending Wishlist Data:", requestData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/wishlist`,
        requestData,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      console.log("✅ Wishlist API Response:", response.data);

      if (response.status === 201 || response.status === 200) {
        await loadWishlist(); // ✅ Use `loadWishlist` after adding item
        toast.success(`${product.name} added to your wishlist.`);
      } else {
        toast.error("Failed to add item to wishlist.");
      }
    } catch (error) {
      console.error("❌ Wishlist API Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Could not add item to wishlist.");
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    if (!authToken) {
      toast.error("Please log in to remove items from your wishlist.");
      return;
    }

    try {
      console.log("🗑 Removing Wishlist Item:", { wishlistId });

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/wishlist/${wishlistId}`, // ✅ Correct URL format
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        await mutate(); // ✅ Refresh wishlist after removal
        toast.success("Item removed from wishlist.");
      } else {
        toast.error("Failed to remove from wishlist.");
      }
    } catch (error) {
      console.error("❌ Failed to remove from wishlist:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to remove from wishlist.");
    }
};


  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, loadWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
