import api from "./api";
import axiosinstance from "axios";

export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};


export const fetchAllProducts = async () => {
  try {
    const response = await axiosinstance.get("https://nrgtrw-images.s3.eu-central-1.amazonaws.com/products.json");
    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error.message);
    if (error.response) {
      console.error("Status Code:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
};
// export const fetchAllProducts = async () => {
//   try {
//     const response = await axios.get($`{import.meta.env.VITE_SERVER_URL}/products`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching all products:", error.message);
//     if (error.response) {
//       console.error("Status Code:", error.response.status);
//       console.error("Headers:", error.response.headers);
//       console.error("Data:", error.response.data);
//     }
//     throw error;
//   }
// };
