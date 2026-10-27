import api from "./axiosInstance";
import type { Category } from "../../types/product";

export const categoryApi = {
  list: () => api.get<{ categories: Category[] }>("/categories").then((res) => res.data.categories),
};