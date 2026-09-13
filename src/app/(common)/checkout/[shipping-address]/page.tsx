"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaMobileRetro, FaRegCopy, FaCheck } from "react-icons/fa6";
import { FaShieldAlt, FaWhatsapp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Inventory from "@/components/ui/Inventory";
import { IOrder } from "@/types/order";
import { createOrder } from "@/services/order/order";
import Swal from "sweetalert2";
import Link from "next/link";

/* ---------- static config ---------- */

const BKASH_NUMBER = "01974004221";
const ADVANCE_PAYMENT = 250;

const DELIVERY_ZONES = [
  { id: "inside", label: "Inside Dhaka", charge: 80 },
  { id: "outside", label: "Outside Dhaka", charge: 150 },
] as const;

type DeliveryZoneId = (typeof DELIVERY_ZONES)[number]["id"];

const GIFT_EXTRAS = [
  {
    id: "gift-packaging",
    emoji: "🎁",
    title: "Premium Gift Packaging",
    badge: "BESTSELLER",
    description: "Luxury matte-black box, gold-foil seal, satin ribbon",
    price: 100,
  },
  {
    id: "rose-bouquet",
    emoji: "🌹",
    title: "Rose Bouquet + Wish Letter",
    badge: "ROMANTIC",
    description: "Hand-tied fresh roses & a personally printed note",
    price: 80,
  },
] as const;

/* ---------- reusable bits ---------- */

const inputClasses =
  "w-full border-b border-gray-300 bg-transparent py-2 text-[15px] outline-none transition-colors placeholder:text-gray-400 focus:border-black";

const fieldLabel =
  "mb-1 block text-[11px] font-semibold tracking-wide text-gray-400 uppercase";

const StepBadge = ({ n }: { n: number }) => (
  <span className="mr-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
    {n}
  </span>
);

/* ---------- page ---------- */

const Shipping_Address = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const productId = searchParams.get("productId");
  const price = Number(searchParams.get("price") || 0);
  const count = Number(searchParams.get("count") || 1);
  const size = searchParams.get("size") || "";

  const product = { productId, size };

  const [deliveryZone, setDeliveryZone] = useState<DeliveryZoneId>("outside");
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const deliveryCharge =
    DELIVERY_ZONES.find((z) => z.id === deliveryZone)?.charge ?? 0;

  const selectedExtraItems = GIFT_EXTRAS.filter((g) =>
    selectedExtras.has(g.id),
  );

  const extrasTotal = selectedExtraItems.reduce((sum, g) => sum + g.price, 0);

  const subtotal = price * count;
  const total = subtotal + deliveryCharge + extrasTotal;

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as any;
    const formData = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      address: form.address.value,
      city: form.city.value,
      phone: form.phone.value,
      alternativePhone: form.alternativePhone.value,
      email: form.email?.value,
      notes: form.notes.value,
    };

    const orderData: IOrder = {
      product,
      shipping_address: formData,
      deliveryZone,
      extras: Array.from(selectedExtras),
      transactionId,
      pricing: {
        quantity: count,
        subtotal,
        deliveryCharge,
        extrasTotal,
        total,
      },
      paymentMethod: "bKash / Nagad / Rocket (advance)",
      orderStatus: "Pending",
    };
    console.log(orderData);
    try {
      const response = await createOrder(orderData);
      if (response?.insertedId) {
        Swal.fire({
          icon: "success",
          title: "আপনার অর্ডার সফল হয়েছে",
        });
      }
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "দুঃখিত!",
        text: error?.message || "অর্ডার করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।",
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm font-bold tracking-wide">
          CHECKOUT{" "}
          <span className="ml-1 font-normal text-gray-400">
            — {count} item{count > 1 ? "s" : ""}
          </span>
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Close checkout"
          className="text-gray-500 transition-colors hover:text-black"
        >
          <IoClose size={22} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-10">
          {/* ============ LEFT COLUMN ============ */}
          <div className="w-full">
            {/* STEP 1 — SHIPPING DETAILS */}
            <div className="flex items-center">
              <StepBadge n={1} />
              <h2 className="text-sm font-bold tracking-wide">
                SHIPPING DETAILS
              </h2>
            </div>

            <div className="mt-6 flex gap-5">
              <div className="flex-1">
                <label className={fieldLabel}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="First Name"
                  className={inputClasses}
                />
              </div>
              <div className="flex-1">
                <label className={fieldLabel}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Last Name"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="mt-5">
              <label className={fieldLabel}>Street Address</label>
              <input
                type="text"
                name="address"
                required
                placeholder="House No, Road, Area"
                className={inputClasses}
              />
            </div>

            <div className="mt-5">
              <label className={fieldLabel}>City</label>
              <input
                type="text"
                name="city"
                required
                placeholder="City / District"
                className={inputClasses}
              />
            </div>

            <div className="mt-5 flex flex-col gap-1.5 rounded-2xl bg-blue-50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <FaMobileRetro />
                *Phone Number Instructions:*
              </p>
              <p className="text-xs leading-relaxed text-blue-900">
                Your primary number and alternative number must be different.
                Your primary number should be whatsapp number so we can send
                confirmation details & The alternative number should belong to
                someone who can receive delivery calls on your behalf if you are
                unreachable.
              </p>
            </div>

            <div className="mt-5">
              <label className={fieldLabel}>Phone</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="01XXXXXXXXX"
                className={inputClasses}
              />
            </div>

            <div className="mt-5">
              <label className={fieldLabel}>
                Alternative Number (Mandatory)
              </label>
              <input
                type="tel"
                name="alternativePhone"
                required
                placeholder="01XXXXXXXXX"
                className={inputClasses}
              />
            </div>

            <div className="mt-5">
              <label className={fieldLabel}>EMAIL (OPTIONAL)</label>
              <input
                type="email"
                name="email"
                required
                placeholder="example@gmail.com"
                className={inputClasses}
              />
            </div>

            <div className="mt-5">
              <label className={fieldLabel}>Customisation Notes</label>
              <input
                type="text"
                name="notes"
                placeholder="Any custom details..."
                className={inputClasses}
              />
            </div>

            {/* STEP 2 — DELIVERY ZONE */}
            <div className="mt-10 flex items-center">
              <StepBadge n={2} />
              <h2 className="text-sm font-bold tracking-wide">DELIVERY ZONE</h2>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              {DELIVERY_ZONES.map((zone) => {
                const active = deliveryZone === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setDeliveryZone(zone.id)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      active
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-black hover:border-gray-400"
                    }`}
                  >
                    <p
                      className={`text-[11px] font-semibold uppercase tracking-wide ${
                        active ? "text-gray-300" : "text-gray-400"
                      }`}
                    >
                      {zone.id}
                    </p>
                    <p className="mt-1 text-sm font-bold uppercase">
                      {zone.label}
                    </p>
                    <p
                      className={`mt-1 text-sm ${active ? "text-gray-200" : "text-gray-500"}`}
                    >
                      ৳{zone.charge}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* STEP 3 — GIFT & PREMIUM EXTRAS */}
            <div className="mt-10 flex items-center">
              <StepBadge n={3} />
              <div>
                <h2 className="text-sm font-bold tracking-wide">
                  GIFT & PREMIUM EXTRAS
                </h2>
                <p className="text-xs text-gray-400">
                  Make someone feel extraordinary
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {GIFT_EXTRAS.map((extra) => {
                const active = selectedExtras.has(extra.id);
                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() => toggleExtra(extra.id)}
                    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                      active
                        ? "border-black"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl">
                      {extra.emoji}
                    </span>

                    <span className="flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-bold">{extra.title}</span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
                          {extra.badge}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs text-gray-400">
                        {extra.description}
                      </span>
                    </span>

                    <span className="shrink-0 text-sm font-bold">
                      +৳{extra.price}
                    </span>

                    <span
                      className={`ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        active
                          ? "border-black bg-black text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {active && <FaCheck size={10} />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* STEP 4 — PAYMENT */}
            <div className="mt-10 flex items-center">
              <StepBadge n={4} />
              <h2 className="text-sm font-bold tracking-wide">PAYMENT</h2>
            </div>

            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-xs font-bold text-red-600">
                *Advance payment of ৳{ADVANCE_PAYMENT} is required to confirm
                your order.*
              </p>
              <p className="mt-2 text-xs font-bold text-red-600">
                Send Money via *bKash / Nagad / Rocket* to +{BKASH_NUMBER}*.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-red-500">
                Orders without advance payment will not be confirmed. Please
                provide the correct payment details and TRX ID. Fake or
                incorrect information will result in order cancellation.
              </p>

              <hr className="my-3 border-red-200" />

              <p className="text-xs font-bold text-red-600">
                *Please verify your size before confirmation.*
              </p>
              <p className="mt-2 text-xs leading-relaxed text-red-500">
                Exchange is available only for *non-printed products* with the
                original tag intact and the product in unused condition.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Send to (bKash / Nagad / Rocket)
                </p>
                <p className="mt-0.5 text-lg font-bold">{BKASH_NUMBER}</p>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy number"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-colors hover:border-black hover:text-black"
              >
                {copied ? <FaCheck size={14} /> : <FaRegCopy size={14} />}
              </button>
            </div>

            <div className="mt-5">
              <label className={fieldLabel}>
                Transaction ID / Last 4 Digits
              </label>
              <input
                type="text"
                name="transactionId"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 8821 or TXN123456"
                className={inputClasses}
              />
            </div>
          </div>

          {/* ============ RIGHT COLUMN ============ */}
          <div className="w-full ">
            <div className="sticky top-8">
              <Inventory
                name="Turkish Horse"
                size={size || "M"}
                color="#000000"
                price={price}
                count={count}
                deliveryCharge={deliveryCharge}
                extrasTotal={extrasTotal}
                extras={selectedExtraItems}
                total={total}
              />
            </div>
          </div>

          <div className="w-full">
            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#2C2D2D]"
            >
              <FaShieldAlt size={13} />
              Confirm Order
            </button>

            <Link
              href={`https://wa.me/880${BKASH_NUMBER.slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-3 text-sm font-bold uppercase tracking-wide text-black transition-colors hover:border-black"
            >
              <FaWhatsapp size={15} />
              Order via WhatsApp
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Shipping_Address;
