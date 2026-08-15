"use client";

import Ordersummary from "@/components/ui/orderSummary";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
// import Swal from "sweetalert2";
const VALID_PROMOS = ["SAVE10", "FLAME10", "NOBITA10"];

/* Simple inline arrow icon, replaces @mui/icons-material/ArrowForward */
const ArrowForwardIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-5 h-5 ${className}`}
  >
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

/* Reusable Tailwind text field, replaces MUI TextField */
const inputClasses =
  "w-full rounded-[10px] border border-gray-300 bg-white px-3.5 py-[9.6px] text-sm outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600";

const Shipping_Address = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [selectedThana, setSelectedThana] = useState("");

  const productId = searchParams.get("productId");
  const price = Number(searchParams.get("price") || 0);
  const count = Number(searchParams.get("count") || 1);
  const size = searchParams.get("size") || "";

  const product = {
    productId,
    size,
  };

  const subtotal = price * count;

  const Dhaka_Sub_Area = [
    { value: "Savar", label: "Savar" },
    { value: "Narayanganj", label: "Narayanganj" },
    { value: "Keranigonj", label: "Keranigonj" },
    { value: "Dohar", label: "Dohar" },
    { value: "Nobabganj", label: "Nobabganj" },
    { value: "Ashuliya", label: "Ashuliya" },
    { value: "Tongi", label: "Tongi" },
    { value: "Gazipur", label: "Gazipur" },
  ];

  const Dhaka = [
    { value: "Adabor", label: "Adabor" },
    { value: "Badda", label: "Badda" },
    { value: "Banani", label: "Banani" },
    { value: "Bangshal", label: "Bangshal" },
    { value: "Bimanbandar", label: "Bimanbandar" },
    { value: "Bsahantek", label: "Bsahantek" },
    { value: "Cantonment", label: "Cantonment" },
    { value: "Chalkbazar", label: "Chalkbazar" },
    { value: "Dakhin Khan", label: "Dakhin Khan" },
    { value: "Darus-Salam", label: "Darus-Salam" },
    { value: "Demra", label: "Demra" },
    { value: "Dhanmondi", label: "Dhanmondi" },
    { value: "Gandaria", label: "Gandaria" },
    { value: "Gulshan", label: "Gulshan" },
    { value: "Hazaribag", label: "Hazaribag" },
    { value: "Jattrabari", label: "Jattrabari" },
    { value: "Kafrul", label: "Kafrul" },
    { value: "Kalabagan", label: "Kalabagan" },
    { value: "Kamrangirchar", label: "Kamrangirchar" },
    { value: "Khilgaon", label: "Khilgaon" },
    { value: "Khilkhet", label: "Khilkhet" },
    { value: "Kodomtali", label: "Kodomtali" },
    { value: "Kotwali", label: "Kotwali" },
    { value: "Lalbagh", label: "Lalbagh" },
    { value: "Mirpur Model", label: "Mirpur Model" },
    { value: "Mohammadpur", label: "Mohammadpur" },
    { value: "Motijheel", label: "Motijheel" },
    { value: "Mugda", label: "Mugda" },
    { value: "New Market", label: "New Market" },
    { value: "Pallabi", label: "Pallabi" },
    { value: "Paltan", label: "Paltan" },
    { value: "Ramna Model", label: "Ramna Model" },
    { value: "Ramna", label: "Ramna" },
    { value: "Rampura", label: "Rampura" },
    { value: "Rupnagar", label: "Rupnagar" },
    { value: "Sabujbag", label: "Sabujbag" },
    { value: "Shah Ali", label: "Shah Ali" },
    { value: "Shahbag", label: "Shahbag" },
    { value: "Shahjahanpur", label: "Shahjahanpur" },
    { value: "Sutrapur", label: "Sutrapur" },
    { value: "Shyampur", label: "Shyampur" },
    { value: "Sher-e-Bangla Nagar", label: "Sher-e-Bangla Nagar" },
    { value: "Tejgaon Industrial Police", label: "Tejgaon Industrial Police" },
    { value: "Tejgaon", label: "Tejgaon" },
    { value: "Turag", label: "Turag" },
    { value: "Uttara East", label: "Uttara East" },
    { value: "Uttara West", label: "Uttara West" },
    { value: "Uttar Khan", label: "Uttar Khan" },
    { value: "Vatara", label: "Vatara" },
    { value: "Wari", label: "Wari" },
  ];

  const getDeliveryCharge = (thanaName: string) => {
    if (!thanaName) return 90;

    const formatted = thanaName.trim().toLowerCase();

    const isDhaka = Dhaka.some((d) => d.value.toLowerCase() === formatted);
    if (isDhaka) return 50;

    const isSub = Dhaka_Sub_Area.some(
      (d) => d.value.toLowerCase() === formatted,
    );
    if (isSub) return 70;

    return 90;
  };

  const deliveryCharge = getDeliveryCharge(selectedThana);
  const couponDiscount = isPromoValid ? subtotal * 0.1 : 0;

  const pricing = {
    quantity: count,
    subtotal,
    deliveryCharge,
    couponDiscount,
    total: subtotal + deliveryCharge - couponDiscount,
  };

  const handleApplyPromoCode = () => {
    const formatted = promoCodeInput.trim().toUpperCase();

    // if (VALID_PROMOS.includes(formatted)) {
    //   setPromoCode(formatted);
    //   setIsPromoValid(true);

    //   Swal.fire({
    //     icon: "success",
    //     title: "Promo Applied",
    //   });
    // } else {
    //   setPromoCode(null);
    //   setIsPromoValid(false);

    //   Swal.fire({
    //     icon: "error",
    //     title: "Invalid Code",
    //   });
    // }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as any;

    const formData = {
      name: form.name.value,
      phone: form.phone.value,
      address: form.address.value,
      thana: form.thana.value,
      district: form.district.value,
    };

    const orderData = {
      customer: `flame2026-${formData.phone}`,
      product,
      pricing,
      shipping_address: formData,
      paymentMethod: "cash on delivery",
      orderStatus: "Pending",
      appliedPromo: promoCode,
    };

    //     try {
    //     //   const data = await createOrder(orderData);

    //     //   if () {
    //     //     /* PURCHASE EVENT */

    //     //     Swal.fire({
    //     //       icon: "success",
    //     //       title: "আপনার অর্ডার সফল হয়েছে",
    //     //     });

    //     //     router.push("/");
    //     //   }
    //     // } catch (err: any) {
    //     //   Swal.fire({
    //     //     icon: "error",
    //     //     title: "Failed",
    //     //     text: err?.message || "Something went wrong",
    //     //   });
    //     // }
    // };
  };

  return (
    <div className="mx-auto max-w-6xl px-4 mt-32">
      <form onSubmit={handleSubmit} className="mt-16">
        <div className="flex flex-wrap justify-center gap-6">
          {/* LEFT COLUMN */}
          <div className="w-full md:w-[54%]">
            <div className="mt-4 mb-2 rounded-2xl p-6 shadow">
              <h1 className="mb-1 text-2xl font-semibold">CheckOut Page</h1>
              <p className="leading-relaxed">
                Provide your accurate address for product delivery. We will take
                care of bringing it to you.
              </p>
            </div>

            {/* FORM START */}
            <div className="rounded-2xl p-6 shadow">
              <h2 className="mb-6 text-lg font-semibold">
                Enter Your Shipping Details
              </h2>

              <div className="flex items-center justify-center gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter Name"
                    className={inputClasses}
                  />
                </div>

                <div className="flex-1">
                  <label className="mb-1 block text-sm font-semibold">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    placeholder="Enter Phone Number"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-1 block text-sm font-semibold">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Enter Your Address"
                  className={inputClasses}
                />
              </div>

              <div className="mt-5 flex items-center justify-center gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-semibold">
                    Thana
                  </label>
                  <input
                    type="text"
                    name="Upazila"
                    required
                    placeholder="Enter Your Upazila"
                    value={selectedThana}
                    onChange={(e) => setSelectedThana(e.target.value)}
                    className={inputClasses}
                  />
                </div>

                <div className="flex-1">
                  <label className="mb-1 block text-sm font-semibold">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    required
                    placeholder="Enter Distrcit"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="mt-4 w-full md:w-[40%]">
            <Ordersummary
              price={price}
              count={count}
              couponDiscount={couponDiscount}
              deliveryCharge={deliveryCharge}
            />

            <div className="mt-2 rounded-2xl px-4 py-4 shadow">
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 pr-16 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromoCode}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <h3 className="mb-0.5 text-lg font-semibold">Payment Method</h3>
              <p className="leading-relaxed">Cash On Delivery</p>
            </div>

            <button
              type="submit"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#2C2D2D]"
            >
              Confirm Your Order
              <ArrowForwardIcon />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Shipping_Address;
