"use client";

import { IOrder, OrderStatus } from "@/types/order";

/* ---------- config ---------- */

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];

export type AdminOrder = IOrder & {
  _id: string;
  createdAt: string;
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-purple-50 text-purple-700 border-purple-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
  Returned: "bg-orange-50 text-orange-700 border-orange-200",
};

/* ---------- small bits ---------- */

export const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
      STATUS_STYLES[status as OrderStatus] ??
      "bg-gray-50 text-gray-600 border-gray-200"
    }`}
  >
    {status}
  </span>
);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ---------- table ---------- */

interface OrdersTableProps {
  orders: AdminOrder[];
  loading: boolean;
  error: string | null;
  updatingId: string | null;
  onSelectOrder: (order: AdminOrder) => void;
  onStatusChange: (order: AdminOrder, status: OrderStatus) => void;
}

const OrdersTable = ({
  orders,
  loading,
  error,
  updatingId,
  onSelectOrder,
  onStatusChange,
}: OrdersTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  Loading orders...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  No orders found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => onSelectOrder(order)}
                  className="cursor-pointer border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    #{order._id?.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">
                      {order.shipping_address?.firstName}{" "}
                      {order.shipping_address?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.shipping_address?.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.product?.size ? `Size: ${order.product.size}` : "—"}
                    {order.pricing?.quantity
                      ? ` · Qty ${order.pricing.quantity}`
                      : ""}
                  </td>
                  <td className="px-4 py-3 font-bold">
                    ৳{order.pricing?.total ?? 0}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td
                    className="px-4 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={order.orderStatus}
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        onStatusChange(order, e.target.value as OrderStatus)
                      }
                      className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold outline-none transition-colors focus:border-black disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
