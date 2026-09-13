import { IProduct } from "@/types/products";
import { apiClient } from "../apiClient";


export const getAllProducts = async (): Promise<IProduct[]> => {
  return apiClient<IProduct[]>("/products", {
    method: "GET",
  });
};

export const getProductById = async (id: string): Promise<IProduct> => {
  return apiClient<IProduct>(`/products/${id}`, {
    method: "GET",
  });
};

export const createProduct = async (
  payload: FormData | Omit<IProduct, "_id">,
): Promise<IProduct> => {
  const isFormData = payload instanceof FormData;

  return apiClient<IProduct>("/products", {
    method: "POST",
    body: isFormData ? payload : JSON.stringify(payload),
  });
};

export const updateProduct = async (
  id: string,
  payload: FormData | Partial<IProduct>,
): Promise<IProduct> => {
  const isFormData = payload instanceof FormData;

  return apiClient<IProduct>(`/products/${id}`, {
    method: "PATCH",
    body: isFormData ? payload : JSON.stringify(payload),
  });
};

export const deleteProduct = async (
  id: string,
): Promise<{ message: string }> => {
  return apiClient<{ message: string }>(`/products/${id}`, {
    method: "DELETE",
  });
};
