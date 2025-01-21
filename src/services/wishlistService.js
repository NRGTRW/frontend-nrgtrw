import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchWishlist = async () => {
  try {
    const response = await axios.get(`${API_URL}/wishlist`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    throw error;
  }
};

export const addToWishlist = async (item) => {
  try {
    const response = await axios.post(`${API_URL}/wishlist`, item, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (item) => {
  try {
    const response = await axios.delete(`${API_URL}/wishlist`, {
      data: item,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    throw error;
  }
};
