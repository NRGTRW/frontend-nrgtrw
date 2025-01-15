import axiosinstance from "./api.js"

export const fetchItems = async () => {
  try {
    const response = await axiosinstance.get("/items");
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await axiosinstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};
