"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FaArrowUp,
  FaArrowDown,
  FaArrowRight,
  FaBoxesStacked,
  FaCartShopping,
  FaClock,
  FaSackDollar,
} from "react-icons/fa6";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAllProducts } from "@/services/products";
import { AdminOrder } from "./orders/components/orderTable";
import { IProduct } from "@/types/products";
import { getAllOrders } from "@/services/order";

/* ---------- config ---------- */

const STATUS_COLORS: Record<string, string> = {
  Pending: "#D97706",
  Confirmed: "#2563EB",
  Shipped: "#7C3AED",
  Delivered: "#16A34A",
  Cancelled: "#DC2626",
};

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ---------- small bits ---------- */

const KpiCard = ({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta?: number;
  icon: React.ReactNode;
}) => {
  const hasDelta = typeof delta === "number" && isFinite(delta);
  const positive = (delta ?? 0) >= 0;

  return (
    <div className="rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      {hasDelta && (
        <p
          className={`mt-1.5 flex items-center gap-1 text-xs font-semibold ${
            positive ? "text-green-600" : "text-red-500"
          }`}
        >
          {positive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
          {Math.abs(delta as number).toFixed(1)}% vs last 7 days
        </p>
      )}
    </div>
  );
};

/* ---------- page ---------- */

const DashboardOverviewPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [ordersData, productsData] = await Promise.all([
          getAllOrders(),
          getAllProducts(),
        ]);
        setOrders((ordersData as AdminOrder[]) ?? []);
        setProducts((productsData as IProduct[]) ?? []);
        setError(null);
      } catch (err: any) {
        setError(err?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ---- derived data ---- */

  const now = useMemo(() => new Date(), []);
  const sevenDaysAgo = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }, [now]);
  const fourteenDaysAgo = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() - 14);
    return d;
  }, [now]);

  const lastSevenDaysOrders = useMemo(
    () => orders.filter((o) => new Date(o.createdAt) >= sevenDaysAgo),
    [orders, sevenDaysAgo],
  );
  const previousSevenDaysOrders = useMemo(
    () =>
      orders.filter((o) => {
        const t = new Date(o.createdAt);
        return t >= fourteenDaysAgo && t < sevenDaysAgo;
      }),
    [orders, fourteenDaysAgo, sevenDaysAgo],
  );

  const sumRevenue = (list: AdminOrder[]) =>
    list
      .filter((o) => o.orderStatus !== "Cancelled")
      .reduce((sum, o) => sum + (o.pricing?.total ?? 0), 0);

  const totalRevenue = useMemo(() => sumRevenue(orders), [orders]);
  const revenueLast7 = useMemo(
    () => sumRevenue(lastSevenDaysOrders),
    [lastSevenDaysOrders],
  );
  const revenuePrev7 = useMemo(
    () => sumRevenue(previousSevenDaysOrders),
    [previousSevenDaysOrders],
  );
  const revenueDelta =
    revenuePrev7 === 0
      ? 0
      : ((revenueLast7 - revenuePrev7) / revenuePrev7) * 100;

  const ordersDelta =
    previousSevenDaysOrders.length === 0
      ? 0
      : ((lastSevenDaysOrders.length - previousSevenDaysOrders.length) /
          previousSevenDaysOrders.length) *
        100;

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.orderStatus === "Pending"),
    [orders],
  );

  const revenueTrend = useMemo(() => {
    const days: { label: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const dayKey = day.toDateString();

      const dayTotal = orders
        .filter(
          (o) =>
            o.orderStatus !== "Cancelled" &&
            new Date(o.createdAt).toDateString() === dayKey,
        )
        .reduce((sum, o) => sum + (o.pricing?.total ?? 0), 0);

      days.push({ label: formatDay(day.toISOString()), revenue: dayTotal });
    }
    return days;
  }, [orders, now]);

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.orderStatus] = (counts[o.orderStatus] ?? 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [orders]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 6),
    [orders],
  );

  const topProducts = useMemo(() => {
    const countByProductId: Record<string, number> = {};
    orders.forEach((o) => {
      const id = o.product?.productId;
      if (!id) return;
      countByProductId[id] =
        (countByProductId[id] ?? 0) + (o.pricing?.quantity ?? 1);
    });

    return Object.entries(countByProductId)
      .map(([productId, unitsSold]) => {
        const product = products.find((p) => p._id === productId);
        return {
          productId,
          name: product?.name ?? "Unknown product",
          image: product?.images?.[0],
          unitsSold,
        };
      })
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);
  }, [orders, products]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-wide">DASHBOARD</h1>
          <p className="mt-1 text-sm text-gray-400">
            {formatDate(now.toISOString())} · here's what's happening with your
            store
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Revenue"
          value={`৳${totalRevenue.toLocaleString()}`}
          delta={revenueDelta}
          icon={<FaSackDollar size={14} />}
        />
        <KpiCard
          label="Total Orders"
          value={orders.length.toLocaleString()}
          delta={ordersDelta}
          icon={<FaCartShopping size={14} />}
        />
        <KpiCard
          label="Pending Orders"
          value={pendingOrders.length.toLocaleString()}
          icon={<FaClock size={14} />}
        />
        <KpiCard
          label="Total Products"
          value={products.length.toLocaleString()}
          icon={<FaBoxesStacked size={14} />}
        />
      </div>

      {/* CHARTS ROW */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* revenue trend */}
        <div className="rounded-xl border border-gray-200 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold tracking-wide">
              REVENUE — LAST 7 DAYS
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend} margin={{ left: -20 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F3F4F6"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip
                  formatter={(value: number) => [`৳${value}`, "Revenue"]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#111827" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* status breakdown */}
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="mb-4 text-sm font-bold tracking-wide">ORDER STATUS</p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {statusBreakdown.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] ?? "#9CA3AF"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {statusBreakdown.map((entry) => (
              <div
                key={entry.status}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-gray-600">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: STATUS_COLORS[entry.status] ?? "#9CA3AF",
                    }}
                  />
                  {entry.status}
                </span>
                <span className="font-semibold">{entry.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS + TOP PRODUCTS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* recent orders */}
        <div className="rounded-xl border border-gray-200 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <p className="text-sm font-bold tracking-wide">RECENT ORDERS</p>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-black"
            >
              View all <FaArrowRight size={10} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">No orders yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {order.shipping_address?.firstName}{" "}
                      {order.shipping_address?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">
                      ৳{order.pricing?.total ?? 0}
                    </span>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* top products */}
        <div className="rounded-xl border border-gray-200">
          <div className="border-b border-gray-100 p-5">
            <p className="text-sm font-bold tracking-wide">TOP PRODUCTS</p>
          </div>

          {topProducts.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">No sales data yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {topProducts.map((p, i) => (
                <div
                  key={p.productId}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  <span className="w-4 shrink-0 text-xs font-bold text-gray-300">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-gray-400">
                      {p.unitsSold} unit{p.unitsSold !== 1 ? "s" : ""} sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
