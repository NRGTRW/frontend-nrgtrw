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
  const [loading, setLoading] = useState(false); // ✅ Prevent multiple requests
  const { authToken } = useAuth();

  const loadWishlist = async () => {
    if (!authToken) {
      toast.error("Please log in to access your wishlist.");
      return;
    }

    try {
      setLoading(true); // ✅ Show loading while fetching
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setWishlist(response.data); // ✅ Update wishlist state
    } catch (error) {
      console.error("Failed to load wishlist:", error.message);
      toast.error("Failed to load wishlist.");
    } finally {
      setLoading(false); // ✅ End loading after fetch
    }
  };

  const addToWishlist = async (product) => {
    if (!authToken) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }

    if (loading) return; // ✅ Prevent duplicate requests
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/wishlist`,
        {
          productId: product.id,
          selectedSize: product.selectedSize || null,
          selectedColor: product.selectedColor || null,
          quantity: product.quantity || 1,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // ✅ Avoid duplicates in the wishlist
      setWishlist((prev) => {
        if (prev.some((item) => item.productId === product.id)) {
          return prev;
        }
        return [...prev, response.data];
      });
      toast.success(`${product.name} added to your wishlist.`);
    } catch (error) {
      toast.error("Failed to add to wishlist. Please try again.");
      console.error(error);
    } finally {
      setLoading(false); // ✅ Allow further requests
    }
  };

  const removeFromWishlist = async (productId, selectedSize, selectedColor) => {
    if (!authToken) {
      toast.error('Please log in to remove items from your wishlist.');
      return;
    }
  
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        data: { selectedSize, selectedColor }, // Pass optional fields
      });
  
      if (response.status === 200) {
        setWishlist((prev) =>
          prev.filter(
            (item) =>
              item.productId !== productId ||
              item.selectedSize !== selectedSize ||
              item.selectedColor !== selectedColor
          )
        );
        toast.success('Item removed from wishlist.');
      } else {
        toast.error('Failed to remove from wishlist.');
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error.message);
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist.');
    }
  };
  

  useEffect(() => {
    if (authToken) {
      loadWishlist();
    }
  }, [authToken]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loadWishlist,
        addToWishlist,
        removeFromWishlist,
        loading, // ✅ Expose loading state
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
