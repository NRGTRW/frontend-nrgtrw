import api from "./api";
import { AxiosResponse } from "axios";

export const fetchCategories = async (): Promise<AxiosResponse> => {
  return api.get("/categories");
};

export const fetchCategoryBySlug = async (slug: string): Promise<AxiosResponse> => {
  return api.get(`/categories/${slug}`);
};
