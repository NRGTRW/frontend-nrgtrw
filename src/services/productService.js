import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export const fetchAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error.message);
    throw new Error("Failed to fetch products.");
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product by ID (${id}):`, error.message);
    throw new Error("Failed to fetch product.");
  }
};

export const updateProduct = async (productId, data) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${API_URL}/products/${productId}`, data, {
      headers: {
        "Content-Type":
          typeof data === "object" && data instanceof FormData
            ? "multipart/form-data"
            : "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product ID ${productId}:`, error.message);
    throw new Error("Failed to update product.");
  }
};

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

export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ID ${id}:`, error.message);
    throw new Error("Failed to delete product.");
  }
};

export const uploadImageToS3 = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(`${API_URL}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.imageUrl;
  } catch (error) {
    console.error(
      "Error uploading image:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to upload image");
  }
};
