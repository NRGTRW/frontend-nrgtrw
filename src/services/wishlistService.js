import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

export const fetchWishlist = async () => {
  try {
    const response = await axios.get(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch wishlist:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
        "Unable to fetch wishlist. Please try again."
    );
  }
};

export const addToWishlist = async (item) => {
  try {
    const response = await axios.post(
      `${API_URL}/wishlist`,
      {
        productId: item.productId,
        selectedSize: item.selectedSize || null,
        selectedColor: item.selectedColor || null,
        quantity: item.quantity || 1,
      },
      { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add item to wishlist:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
        "Unable to add item to wishlist. Please try again."
    );
  }
};

export const removeFromWishlist = async (wishlistId) => {
  try {
    console.log("🗑 Removing Wishlist Item:", { wishlistId });
    const response = await axios.delete(`${API_URL}/wishlist/${wishlistId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to remove item from wishlist:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
        "Unable to remove item from wishlist. Please try again."
    );
  }
};
