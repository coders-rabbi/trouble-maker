export type DeliveryZoneId = "inside" | "outside";

export interface OrderProduct {
  productId: string | null;
  size: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phone: string;
  alternativePhone: string;
  email?: string;
  notes?: string;
}

export interface OrderPricing {
  quantity: number;
  subtotal: number;
  deliveryCharge: number;
  extrasTotal: number;
  total: number;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentMethod = "bKash / Nagad / Rocket (advance)";

export interface IOrder {
  product: OrderProduct;
  shipping_address: ShippingAddress;
  deliveryZone: DeliveryZoneId;
  extras: string[]; // gift extra ids, e.g. ["gift-packaging", "rose-bouquet"]
  transactionId: string;
  pricing: OrderPricing;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
}


// types/order.ts এ যোগ করুন

export interface CreateOrderResponse {
  insertedId?: string;
  acknowledged?: boolean;
  message?: string;
}