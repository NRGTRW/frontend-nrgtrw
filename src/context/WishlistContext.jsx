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

  const loadWishlist = async () => {
    await mutate();
  };

  const addToWishlist = async (product) => {
    if (!authToken) {
      toast.error("You need to be logged in to add items to your wishlist.");
      return;
    }
  
    // ✅ Use `id` if `productId` is missing
    const productId = product.productId || product.id; 
  
    if (!productId || isNaN(Number(productId))) {
      console.error("❌ Invalid product ID:", product);
      toast.error("Error: Invalid product ID.");
      return;
    }
  
    try {
      const requestData = {
        productId: Number(productId), // ✅ Always ensure it's a number
        selectedSize: product.selectedSize || null,
        selectedColor: product.selectedColor || null,
        quantity: product.quantity || 1,
      };
  
      console.log("📤 Sending Wishlist Data:", requestData);
  
      await toast.promise(
        axios.post(`${import.meta.env.VITE_API_URL}/wishlist`, requestData, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        {
          pending: `Adding ${product.name} to wishlist...`,
          success: `${product.name} added to your wishlist!`,
          error: `Failed to add ${product.name} to wishlist.`,
        }
      );
  
      await mutate();
    } catch (error) {
      console.error("❌ Wishlist API Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || `Could not add ${product.name} to wishlist.`);
    }
  };
  
  

  const removeFromWishlist = async (wishlistId) => {
    if (!authToken) {
      toast.error("Please log in to remove items from your wishlist.");
      return;
    }
  
    // ✅ Find the item in the wishlist to get the product name
    const item = wishlist.find((item) => item.id === wishlistId);
    const productName = item?.product?.name || "Item"; // ✅ Fallback to avoid "undefined"
  
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
  
      await mutate();
    } catch (error) {
      console.error("❌ Failed to remove from wishlist:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || `Failed to remove ${productName} from wishlist.`);
    }
  };
  

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, loadWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
