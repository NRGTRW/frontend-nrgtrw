import axios from "axios";

// Base URL from your .env (e.g. VITE_API_URL = "http://localhost:3000")
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch all products (with nested sizes/colors) from backend.
 */
export const fetchAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data; // array of products
  } catch (error) {
    console.error("Error fetching all products:", error.message);
    throw new Error("Failed to fetch products.");
  }
};

/**
 * Fetch single product by ID (with nested sizes/colors).
 */
export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data; // single product object
  } catch (error) {
    console.error(`Error fetching product by ID (${id}):`, error.message);
    throw new Error("Failed to fetch product.");
  }
};
