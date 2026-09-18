"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaMagnifyingGlass,
  FaXmark,
  FaPhone,
  FaLocationDot,
  FaBoxOpen,
} from "react-icons/fa6";
// import OrdersTable, from "./components/CustomOrderTable";
import { getAllOrders, updateOrderStatus } from "@/services/order";
import OrdersTable, {
  ORDER_STATUSES,
  AdminOrder,
  StatusBadge,
} from "../orders/components/orderTable";
import { OrderStatus } from "@/types/order";

const TABS: (OrderStatus | "All")[] = ["All", ...ORDER_STATUSES];

const OrdersPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<OrderStatus | "All">("All");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllOrders();
        setOrders((data as AdminOrder[]) ?? []);
        setError(null);
      } catch (err: any) {
        setError(err?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const counts = useMemo(() => {
    const base: Record<string, number> = { All: orders.length };
    ORDER_STATUSES.forEach((s) => {
      base[s] = orders.filter((o) => o.orderStatus === s).length;
    });
    return base;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === "All" || order.orderStatus === activeTab;

      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        `${order.shipping_address?.firstName ?? ""} ${
          order.shipping_address?.lastName ?? ""
        }`
          .toLowerCase()
          .includes(query) ||
        (order.shipping_address?.phone ?? "").includes(query) ||
        (order._id ?? "").toLowerCase().includes(query) ||
        (order.transactionId ?? "").toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, search]);

  const handleStatusChange = async (order: AdminOrder, status: OrderStatus) => {
    const prevOrders = orders;
    setUpdatingId(order._id);

    // optimistic update
    setOrders((prev) =>
      prev.map((o) =>
        o._id === order._id ? { ...o, orderStatus: status } : o,
      ),
    );
    if (selectedOrder?._id === order._id) {
      setSelectedOrder({ ...order, orderStatus: status });
    }

    try {
      await updateOrderStatus(order._id, status);
    } catch (err) {
      // revert on failure
      setOrders(prevOrders);
      if (selectedOrder?._id === order._id) setSelectedOrder(order);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-wide">ORDERS</h1>
          <p className="mt-1 text-sm text-gray-400">
            {orders.length} total order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <FaMagnifyingGlass
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={13}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, TRX ID..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              {tab}
              <span
                className={`ml-1.5 ${active ? "text-gray-300" : "text-gray-400"}`}
              >
                {counts[tab] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* TABLE (separate component) */}
      <OrdersTable
        orders={filteredOrders}
        loading={loading}
        error={error}
        updatingId={updatingId}
        onSelectOrder={setSelectedOrder}
        onStatusChange={handleStatusChange}
      />

      {/* ORDER DETAIL DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Order
                </p>
                <p className="font-mono text-sm font-bold">
                  #{selectedOrder._id?.slice(-6).toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                aria-label="Close"
                className="text-gray-400 transition-colors hover:text-black"
              >
                <FaXmark size={18} />
              </button>
            </div>

            <StatusBadge status={selectedOrder.orderStatus} />

            {/* customer */}
            <div className="mt-6">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Customer
              </p>
              <p className="text-sm font-semibold">
                {selectedOrder.shipping_address?.firstName}{" "}
                {selectedOrder.shipping_address?.lastName}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <FaPhone size={11} /> {selectedOrder.shipping_address?.phone}
                {selectedOrder.shipping_address?.alternativePhone &&
                  ` · ${selectedOrder.shipping_address.alternativePhone}`}
              </p>
              <p className="mt-1 flex items-start gap-1.5 text-xs text-gray-500">
                <FaLocationDot size={11} className="mt-0.5 shrink-0" />
                {selectedOrder.shipping_address?.address},{" "}
                {selectedOrder.shipping_address?.city}
              </p>
            </div>

            {/* product */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                <FaBoxOpen size={11} /> Product
              </p>
              <p className="text-sm">
                Size: {selectedOrder.product?.size || "—"} · Qty:{" "}
                {selectedOrder.pricing?.quantity ?? 1}
              </p>
              {selectedOrder.extras?.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  Extras: {selectedOrder.extras.join(", ")}
                </p>
              )}
            </div>

            {/* pricing */}
            <div className="mt-6 space-y-1.5 border-t border-gray-100 pt-5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>৳{selectedOrder.pricing?.subtotal ?? 0}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span>৳{selectedOrder.pricing?.deliveryCharge ?? 0}</span>
              </div>
              {selectedOrder.pricing?.extrasTotal > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Extras</span>
                  <span>৳{selectedOrder.pricing.extrasTotal}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-100 pt-1.5 font-bold">
                <span>Total</span>
                <span>৳{selectedOrder.pricing?.total ?? 0}</span>
              </div>
            </div>

            {/* payment */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Payment
              </p>
              <p className="text-sm text-gray-600">
                {selectedOrder.paymentMethod}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                TRX ID: {selectedOrder.transactionId || "—"}
              </p>
            </div>

            {/* update status */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Update Status
              </p>
              <select
                value={selectedOrder.orderStatus}
                disabled={updatingId === selectedOrder._id}
                onChange={(e) =>
                  handleStatusChange(
                    selectedOrder,
                    e.target.value as OrderStatus,
                  )
                }
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none transition-colors focus:border-black disabled:opacity-50"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
