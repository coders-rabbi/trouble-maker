"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaMagnifyingGlass,
  FaXmark,
  FaPhone,
  FaLocationDot,
  FaBoxOpen,
  FaFileArrowDown,
} from "react-icons/fa6";
import OrderHistoryTable from "./components/orderTableHistory";
import {
  AdminOrder,
  ORDER_STATUSES,
  StatusBadge,
} from "../orders/components/orderTable";
import { OrderStatus } from "@/types/order";
import { getOrderHistory } from "@/services/order";

const TABS: (OrderStatus | "All")[] = ["All", ...ORDER_STATUSES];

/* ---------- helpers ---------- */

const toDateInputValue = (d: Date) => d.toISOString().slice(0, 10);

const isWithinRange = (iso: string, from: string, to: string) => {
  if (!from && !to) return true;
  const time = new Date(iso).getTime();
  if (isNaN(time)) return true;
  if (from && time < new Date(from).getTime()) return false;
  if (to && time > new Date(to).getTime() + 24 * 60 * 60 * 1000 - 1)
    return false;
  return true;
};

const exportToCsv = (orders: AdminOrder[]) => {
  const header = ["Order ID", "Customer", "Phone", "Total", "Status", "Date"];

  const rows = orders.map((o) => [
    o._id,
    `${o.shipping_address?.firstName ?? ""} ${o.shipping_address?.lastName ?? ""}`.trim(),
    o.shipping_address?.phone ?? "",
    o.pricing?.total ?? 0,
    o.orderStatus,
    o.createdAt,
  ]);

  const csvContent = [header, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `order-history-${toDateInputValue(new Date())}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

/* ---------- summary card ---------- */

const SummaryCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="rounded-xl border border-gray-200 p-4">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
      {label}
    </p>
    <p className="mt-1 text-xl font-bold">{value}</p>
  </div>
);

/* ---------- page ---------- */

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<OrderStatus | "All">("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getOrderHistory();
        setOrders((data as AdminOrder[]) ?? []);
        setError(null);
      } catch (err: any) {
        setError(err?.message || "Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesTab =
          activeTab === "All" || order.orderStatus === activeTab;

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

        const matchesDate = isWithinRange(order.createdAt, fromDate, toDate);

        return matchesTab && matchesSearch && matchesDate;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [orders, activeTab, search, fromDate, toDate]);

  const summary = useMemo(() => {
    const totalRevenue = filteredOrders
      .filter((o) => o.orderStatus !== "Cancelled")
      .reduce((sum, o) => sum + (o.pricing?.total ?? 0), 0);

    const delivered = filteredOrders.filter(
      (o) => o.orderStatus === "Delivered",
    ).length;
    const cancelled = filteredOrders.filter(
      (o) => o.orderStatus === "Cancelled",
    ).length;

    return {
      total: filteredOrders.length,
      totalRevenue,
      delivered,
      cancelled,
    };
  }, [filteredOrders]);

  const clearFilters = () => {
    setSearch("");
    setActiveTab("All");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-wide">ORDER HISTORY</h1>
          <p className="mt-1 text-sm text-gray-400">
            Full log of every order, filterable by date, status, or customer.
          </p>
        </div>

        <button
          onClick={() => exportToCsv(filteredOrders)}
          disabled={filteredOrders.length === 0}
          className="flex shrink-0 items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-black disabled:opacity-40"
        >
          <FaFileArrowDown size={13} />
          Export CSV
        </button>
      </div>

      {/* SUMMARY */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Orders (Filtered)" value={summary.total} />
        <SummaryCard label="Revenue" value={`৳${summary.totalRevenue}`} />
        <SummaryCard label="Delivered" value={summary.delivered} />
        <SummaryCard label="Cancelled" value={summary.cancelled} />
      </div>

      {/* FILTERS */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <FaMagnifyingGlass
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={13}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, order/TRX ID..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-black"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-black"
          />
          {(search || fromDate || toDate || activeTab !== "All") && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-gray-500 underline-offset-2 hover:underline"
            >
              Clear
            </button>
          )}
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
            </button>
          );
        })}
      </div>

      {/* TABLE */}
      <OrderHistoryTable
        orders={filteredOrders}
        loading={loading}
        error={error}
        onSelectOrder={setSelectedOrder}
      />

      {/* ORDER DETAIL DRAWER (read-only) */}
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

            <div className="flex items-center justify-between">
              <StatusBadge status={selectedOrder.orderStatus} />
              <p className="text-xs text-gray-400">
                {new Date(selectedOrder.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
