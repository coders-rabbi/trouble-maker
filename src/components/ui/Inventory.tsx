"use client";

interface ExtraItem {
  id: string;
  emoji: string;
  title: string;
  price: number;
}

interface InventoryProps {
  name: string;
  size: string;
  color: string;
  price: number;
  count: number;
  deliveryCharge: number;
  extrasTotal: number;
  extras?: ExtraItem[]; // 👈 নতুন prop
  total: number;
}

const Inventory = ({
  name,
  size,
  color,
  price,
  count,
  deliveryCharge,
  extrasTotal,
  extras = [],
  total,
}: InventoryProps) => {
  const subtotal = price * count;

  return (
    <div className="rounded-2xl border border-gray-200 p-5">
      <h3 className="text-sm font-bold tracking-wide">ORDER SUMMARY</h3>

      {/* Product info */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-xs text-gray-400">
            Size: {size} · Qty: {count}
          </p>
        </div>
        <p className="font-bold">৳{subtotal}</p>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Delivery */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Delivery Charge</span>
        <span className="font-semibold">৳{deliveryCharge}</span>
      </div>

      {/* Extras (heading যোগ হবে এখানে) */}
      {extras.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Gift & Premium Extras
          </p>
          {extras.map((extra) => (
            <div
              key={extra.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                <span>{extra.emoji}</span>
                <span>{extra.title}</span>
              </span>
              <span className="font-bold">+৳{extra.price}</span>
            </div>
          ))}
        </div>
      )}

      <hr className="my-4 border-gray-200" />

      {/* Total */}
      <div className="flex items-center justify-between text-base font-bold">
        <span>Total</span>
        <span>৳{total}</span>
      </div>
    </div>
  );
};

export default Inventory;
