import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Utility to get the token
const getAuthToken = () => localStorage.getItem("token");

// Fetch Wishlist
export const fetchWishlist = async () => {
  try {
    const response = await axios.get(`${API_URL}/wishlist`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch wishlist:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Unable to fetch wishlist. Please try again.");
  }
};

// Add Item to Wishlist
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
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add item to wishlist:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Unable to add item to wishlist. Please try again.");
  }
};

// Remove Item from Wishlist
export const removeFromWishlist = async ({ productId, selectedSize, selectedColor }) => {
  try {
    const response = await axios.delete(`${API_URL}/wishlist/${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: { // Optional data passed in the body
        selectedSize,
        selectedColor,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    throw error;
  }
};