import Image from "next/image";
import img from "@/assets/products/img2.png";

interface InventoryProps {
  name: string;
  size: string;
  color: string; // hex code, e.g. "#000000"
  price: number;
  count: number;
  deliveryCharge: number;
  extrasTotal?: number;
  total: number;
}

const Inventory = ({
  name,
  size,
  color,
  price,
  count,
  deliveryCharge,
  extrasTotal = 0,
  total,
}: InventoryProps) => {
  const subtotal = price * count;

  return (
    <div className="rounded-2xl bg-[#F7F7F8] p-6">
      <h2 className="font-serif text-xl italic">Inventory</h2>

      {/* product row */}
      <div className="mt-5 flex gap-3 border-b border-gray-200 pb-5">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-200">
          <Image src={img} alt={name} className="h-full w-full object-cover" />
        </div>

        <div>
          <p className="text-sm font-bold uppercase">{name}</p>
          <p className="mt-0.5 text-xs text-gray-400">Size: {size}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            />
            Color: {color}
          </p>
          <p className="mt-1 text-sm font-bold">৳{price}</p>
        </div>
      </div>

      {/* line items */}
      <div className="mt-4 flex justify-between text-xs">
        <p className="uppercase tracking-wide text-gray-400">Subtotal</p>
        <p className="text-gray-600">৳{subtotal.toFixed(0)}</p>
      </div>

      <div className="mt-2 flex justify-between text-xs">
        <p className="uppercase tracking-wide text-gray-400">Delivery</p>
        <p className="text-gray-600">৳{deliveryCharge.toFixed(0)}</p>
      </div>

      {extrasTotal > 0 && (
        <div className="mt-2 flex justify-between text-xs">
          <p className="uppercase tracking-wide text-gray-400">Extras</p>
          <p className="text-gray-600">৳{extrasTotal.toFixed(0)}</p>
        </div>
      )}

      <hr className="mt-4 border-gray-200" />

      <div className="mt-4 flex items-center justify-between">
        <p className="font-serif text-xl italic">Total</p>
        <p className="text-xl font-bold">৳{total.toFixed(0)}</p>
      </div>
    </div>
  );
};

export default Inventory;
