import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext"; // Auth context for token access

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};


export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { authToken } = useAuth();

  const loadWishlist = async () => {
    if (!authToken) {
      toast.error("Please log in to access your wishlist.");
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setWishlist(response.data);
    } catch (error) {
      console.error("Failed to load wishlist:", error.message);
      toast.error("Failed to load wishlist.");
    }
  };

  const addToWishlist = async (item) => {
    if (!authToken) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/wishlist`,
        {
          productId: item.id,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setWishlist((prev) => [...prev, response.data]);
      toast.success(`${item.name} added to wishlist.`);
    } catch (error) {
      console.error("Failed to add to wishlist:", error.message);
      toast.error("Failed to add to wishlist.");
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/wishlist/${itemId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setWishlist((prev) => prev.filter((item) => item.id !== itemId));
      toast.info("Item removed from wishlist.");
    } catch (error) {
      console.error("Failed to remove from wishlist:", error.message);
      toast.error("Failed to remove from wishlist.");
    }
  };

  useEffect(() => {
    if (authToken) {
      loadWishlist();
    }
  }, [authToken]);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
