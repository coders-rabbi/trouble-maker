import { ApiResponse, CreateOrderResponse, IOrder } from "@/types/order";
import { apiClient } from "../apiClient";

export const createOrder = async (
  orderData: IOrder,
): Promise<CreateOrderResponse> => {
  return apiClient<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const getAllOrders = async (): Promise<IOrder[]> => {
  const res = await apiClient<ApiResponse<IOrder[]>>("/orders", {
    method: "GET",
  });
  return res.data;
};

export const getOrderHistory = async (): Promise<IOrder[]> => {
  const res = await apiClient<ApiResponse<IOrder[]>>("/orders/history", {
    method: "GET",
  });
  return res.data;
};

export const updateOrderStatus = async (
  id: string,
  status: string,
): Promise<IOrder> => {
  const res = await apiClient<ApiResponse<IOrder>>(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ orderStatus: status }),
  });
  return res.data;
};
