import axios from "axios";

// Base API URL
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch all products (with nested sizes/colors) from backend.
 */
export const fetchAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
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
    return response.data;
  } catch (error) {
    console.error(`Error fetching product by ID (${id}):`, error.message);
    throw new Error("Failed to fetch product.");
  }
};

/**
 * Create a new product (Admin only).
 */
export const createProduct = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error.message);
    throw new Error("Failed to create product.");
  }
};

/**
 * Update an existing product (Admin only).
 */
export const updateProduct = async (productId, formData) => {
  try {
    const response = await axios.put(`${API_URL}/products/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product ID ${productId}:`, error.message);
    throw new Error("Failed to update product.");
  }
};

/**
 * Delete a product (Admin only).
 */
/**
 * Delete a product (Admin only).
 */
export const deleteProduct = async (id) => {
  try {
    console.log("Sending DELETE request for product ID:", id);
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    console.log("Delete response:", response.data);  // Log the response data for debugging
    return response.data;  // Return the response to handle it on the frontend
  } catch (error) {
    console.error(`Error deleting product ID ${id}:`, error.message);
    throw new Error('Failed to delete product.');
  }
};

// Define the function to upload an image to S3
export const uploadImageToS3 = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Image uploaded successfully:", response.data);
    return response.data.imageUrl; // Assuming the response contains the image URL
  } catch (error) {
    console.error("Error uploading image:", error.response ? error.response.data : error.message);
    throw new Error("Failed to upload image");
  }
};
