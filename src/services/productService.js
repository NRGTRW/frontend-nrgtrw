import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export const fetchAllProducts = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`); // Adjust the endpoint as necessary
  return response.data;
};


// export const fetchAllProducts = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/products`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching all products:", error.message);
//     throw new Error("Failed to fetch products.");
//   }
// };

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product by ID (${id}):`, error.message);
    throw new Error("Failed to fetch product.");
  }
};
