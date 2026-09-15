
import { ApiResponse, IProduct } from "@/types/order";
import { apiClient } from "../apiClient";

// export const createProduct = async (
//   productData: IProduct,
// ): Promise<CreateProductResponse> => {
//   return apiClient<CreateProductResponse>("/products/create-product", {
//     method: "POST",
//     body: JSON.stringify(productData),
//   });
// };

export const getAllProducts = async (): Promise<IProduct[]> => {
  const res = await apiClient<ApiResponse<IProduct[]>>("/products", {
    method: "GET",
  });
  return res.data;
};

export const getSingleProduct = async (id: string): Promise<IProduct> => {
  const res = await apiClient<ApiResponse<IProduct>>(`/products/${id}`, {
    method: "GET",
  });
  return res.data;
};

export const searchProducts = async (query: string): Promise<IProduct[]> => {
  const res = await apiClient<ApiResponse<IProduct[]>>(
    `/products/search?q=${encodeURIComponent(query)}`,
    { method: "GET" },
  );
  return res.data;
};

export const getProductsByCategory = async (
  category: string,
): Promise<IProduct[]> => {
  const res = await apiClient<ApiResponse<IProduct[]>>(
    `/products/category/${encodeURIComponent(category)}`,
    { method: "GET" },
  );
  return res.data;
};

export const updateProduct = async (
  id: string,
  productData: Partial<IProduct>,
): Promise<IProduct> => {
  const res = await apiClient<ApiResponse<IProduct>>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(productData),
  });
  return res.data;
};

export const deleteProduct = async (id: string): Promise<IProduct> => {
  const res = await apiClient<ApiResponse<IProduct>>(`/products/${id}`, {
    method: "DELETE",
  });
  return res.data;
};
