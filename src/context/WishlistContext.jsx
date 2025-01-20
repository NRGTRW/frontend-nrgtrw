import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      toast.error("Failed to load wishlist.");
    }
  };

  const addToWishlist = async (item) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/wishlist`,
        {
          productId: item.id,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWishlist((prev) => [...prev, response.data]);
      toast.success(`${item.name} added to wishlist.`);
    } catch (error) {
      console.error("Failed to add to wishlist:", error.message);
      toast.error("Failed to add to wishlist.");
    }
  };

  const removeFromWishlist = async (itemId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/wishlist/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((item) => item.id !== itemId));
      toast.info("Item removed from wishlist.");
    } catch (error) {
      console.error("Failed to remove from wishlist:", error.message);
      toast.error("Failed to remove from wishlist.");
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, loadWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
