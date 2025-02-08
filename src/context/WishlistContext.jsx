import axios from "axios";
import { createContext, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import useSWR from "swr";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { authToken } = useAuth();

  async function fetchWishlist(token) {
    if (!token) {
      console.error("❌ No token provided. Cannot fetch wishlist.");
      return [];
    }

    const apiUrl = `${import.meta.env.VITE_API_URL}/wishlist`;
    // console.log(`🔍 Fetching wishlist from: ${apiUrl}`);
    // console.log(`🔑 Using Token: ${token}`);

    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Failed to load wishlist:", error.message);
      console.error(
        "📌 Error Response:",
        error.response?.data || "No additional data",
      );
      return [];
    }
  }

  const { data: wishlist = [], mutate } = useSWR(
    authToken ? ["/wishlist", authToken] : null,
    () => fetchWishlist(authToken),
  );

  const loadWishlist = async () => {
    await mutate();
  };

  useEffect(() => {
    if (authToken) {
      loadWishlist();
    }
  }, [authToken]);

  const addToWishlist = async (product) => {
    if (!authToken) {
      toast.error(
        "💖 Want to save this for later? Log in to manage your wishlist.",
      );
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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/wishlist`,
        requestData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        },
      );

      console.log("✅ Wishlist Item Added!");
      await mutate(); 
    } catch (error) {
      console.error(
        "❌ Wishlist API Error:",
        error.response?.data || error.message,
      );
      toast.error(
        error.response?.data?.message ||
          "🚨 Could not add to wishlist. Please try again later!",
      );
    }
  };

  const removeFromWishlist = async (wishlistId) => {
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
        },
      );
      await mutate();
    } catch (error) {
      console.error(
        "❌ Failed to remove from wishlist:",
        error.response?.data || error.message,
      );
      toast.error(
        error.response?.data?.message ||
          `Failed to remove ${productName} from wishlist.`,
      );
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
