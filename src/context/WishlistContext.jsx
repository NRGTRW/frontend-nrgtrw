import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext"; // Import the AuthContext to access authToken and logOut

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { authToken, logOut } = useAuth(); // Access authToken and logOut from AuthContext

  const loadWishlist = async () => {
    if (!authToken) {
      console.error("No auth token available.");
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setWishlist(response.data); // Set the wishlist data
    } catch (error) {
      console.error("Failed to load wishlist:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logOut(); // Log out the user if the session is expired
      }
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
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (!wishlist.some((existingItem) => existingItem.id === response.data.id)) {
        setWishlist((prev) => [...prev, response.data]);
        toast.success(`${item.name} added to wishlist.`);
      } else {
        toast.error("Item already in wishlist.");
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error.message);
      toast.error("Failed to add to wishlist.");
    }
  };

  const removeFromWishlist = async (itemId) => {
    if (!authToken) {
      toast.error("Please log in to manage your wishlist.");
      return;
    }
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
    loadWishlist();
  }, [authToken]); // Reload wishlist whenever the authToken changes

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, loadWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
