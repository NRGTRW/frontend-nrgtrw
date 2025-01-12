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
