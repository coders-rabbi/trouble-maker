"use client";

import { AdminOrder, StatusBadge } from "../../orders/components/orderTable";


const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

interface OrderHistoryTableProps {
  orders: AdminOrder[];
  loading: boolean;
  error: string | null;
  onSelectOrder: (order: AdminOrder) => void;
}

const OrderHistoryTable = ({
  orders,
  loading,
  error,
  onSelectOrder,
}: OrderHistoryTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  Loading order history...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  No orders found for this range.
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
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistoryTable;
