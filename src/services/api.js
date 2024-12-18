import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

export const fetchMaterials = () => api.get("/materials");
export const fetchCategories = () => api.get("/categories");
