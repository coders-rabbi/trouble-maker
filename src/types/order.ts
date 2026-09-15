export interface IProduct {
  productId: string;
  size: string;
}

export interface IShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phone: string;
  alternativePhone?: string;
  email: string;
  notes?: string;
}

export interface IPricing {
  quantity: number;
  subtotal: number;
  deliveryCharge: number;
  extrasTotal: number;
  total: number;
}

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export interface IOrder {
  _id: string;
  product: IProduct;
  shipping_address: IShippingAddress;
  deliveryZone: "inside" | "outside";
  extras: string[];
  transactionId: string;
  pricing: IPricing;
  paymentMethod: string;
  orderStatus: OrderStatus;
  orderId: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Generic API wrapper — backend always returns this shape
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type CreateOrderResponse = ApiResponse<IOrder>;
export type GetOrdersResponse = ApiResponse<IOrder[]>;
export type UpdateOrderStatusResponse = ApiResponse<IOrder>;
