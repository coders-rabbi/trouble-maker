import { CreateOrderResponse, IOrder } from "@/types/order";
import { apiClient } from "../apiClient";

export const createOrder = async (
  orderData: IOrder,
): Promise<CreateOrderResponse> => {
  return apiClient<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const getAllOrders = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
  return res.json();
};

export const updateOrderStatus = async (id: string, status: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderStatus: status }),
  });
  return res.json();
};
