import axios from "axios";
import { createContext, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import useSWR from "swr";

// Create the Wishlist context
const WishlistContext = createContext();

// Custom hook to use the Wishlist context
export const useWishlist = () => useContext(WishlistContext);

// Provider component
export const WishlistProvider = ({ children }) => {
  const { authToken } = useAuth();

  // Function to fetch the wishlist data using the auth token
  async function fetchWishlist(token) {
    if (!token) {
      console.error("❌ No token provided. Cannot fetch wishlist.");
      return [];
    }

    const apiUrl = `${import.meta.env.VITE_API_URL}/wishlist`;
    console.log(`🔍 Fetching wishlist from: ${apiUrl}`);
    console.log(`🔑 Using Token: ${token}`);

    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Wishlist fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to load wishlist:", error.message);
      console.error("📌 Error Response:", error.response?.data || "No additional data");
      // toast.error("Failed to load wishlist.");
      return [];
    }
  }

  // Use SWR to fetch wishlist data when an authToken exists
  const { data: wishlist = [], mutate } = useSWR(
    authToken ? [`/wishlist`, authToken] : null,
    () => fetchWishlist(authToken)
  );

  // Function to manually reload the wishlist
  const loadWishlist = async () => {
    await mutate();
  };

  // Automatically re-fetch the wishlist whenever the authToken changes (e.g., after login)
  useEffect(() => {
    if (authToken) {
      loadWishlist();
    }
  }, [authToken]);

  // Function to add an item to the wishlist
  const addToWishlist = async (product) => {
    if (!authToken) {
      toast.error("You need to be logged in to add items to your wishlist.");
      return;
    }

    const productId = product.productId || product.id;
    if (!productId || isNaN(Number(productId))) {
      console.error("❌ Invalid product ID:", product);
      toast.error("Error: Invalid product ID.");
      return;
    }

    const requestData = {
      productId: Number(productId),
      selectedSize: product.selectedSize || null,
      selectedColor: product.selectedColor || null,
      quantity: product.quantity || 1,
    };

    console.log("🛒 Adding to Wishlist:", requestData);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/wishlist`, requestData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log("✅ Wishlist Item Added!");
      await mutate(); // ✅ Re-fetch wishlist to update UI
    } catch (error) {
      console.error("❌ Wishlist API Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Could not add item to wishlist.");
    }
  };

  // Function to remove an item from the wishlist
  const removeFromWishlist = async (wishlistId) => {
    if (!authToken) {
      toast.error("Please log in to remove items from your wishlist.");
      return;
    }

    // Ensure item exists before removing
    const item = wishlist.find((item) => item.id === wishlistId);
    const productName = item?.product?.name || "Item";

    try {
      console.log("🗑 Removing Wishlist Item:", { wishlistId, productName });
      await toast.promise(
        axios.delete(`${import.meta.env.VITE_API_URL}/wishlist/${wishlistId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        {
          pending: `Removing ${productName} from wishlist...`,
          success: `${productName} removed from your wishlist!`,
          error: `Failed to remove ${productName} from wishlist.`,
        }
      );
      await mutate(); // ✅ Re-fetch wishlist after removal
    } catch (error) {
      console.error("❌ Failed to remove from wishlist:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || `Failed to remove ${productName} from wishlist.`
      );
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, loadWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
