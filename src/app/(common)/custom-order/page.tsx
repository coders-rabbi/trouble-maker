"use client";

// import { createCustomOrder } from "@/services/orderService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function CustomOrderForm() {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [leftSleeveImage, setLeftSleeveImage] = useState<string | null>(null);
  const [rightSleeveImage, setRightSleeveImage] = useState<string | null>(null);

  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    thana: "",
    jela: "",
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const customOrderData = {
      shippingInfo,
      frontImage,
      backImage,
      leftSleeveImage,
      rightSleeveImage,
    };

    try {
      //   const data = await createCustomOrder(customOrderData);
      const data = null;

      Swal.fire({
        icon: "success",
        title: "আপনার কাস্টম অর্ডার সফল হয়েছে",
      });

      router.push("/");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-32 px-4 md:px-0">
      <h1 className="text-xl font-semibold text-center md:text-start">
        Provide the necessary information for your custom order.
      </h1>
      <p className="text-center md:text-start">
        To create your preferred design, please send us an image of the design
        along with the detailed information.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <label
            htmlFor="front-image"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer overflow-hidden hover:border-gray-400 transition-colors"
          >
            {frontImage ? (
              <img
                src={frontImage}
                alt="Front Image"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-500 text-center px-2">
                Front Image
              </span>
            )}
            <input
              id="front-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFrontImage(URL.createObjectURL(file));
              }}
            />
          </label>

          <label
            htmlFor="back-image"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer overflow-hidden hover:border-gray-400 transition-colors"
          >
            {backImage ? (
              <img
                src={backImage}
                alt="Back Image"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-500 text-center px-2">
                Back Image
              </span>
            )}
            <input
              id="back-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setBackImage(URL.createObjectURL(file));
              }}
            />
          </label>

          <label
            htmlFor="left-sleeve-image"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer overflow-hidden hover:border-gray-400 transition-colors"
          >
            {leftSleeveImage ? (
              <img
                src={leftSleeveImage}
                alt="Left Hange Image"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-500 text-center px-2">
                Left Hange Image
              </span>
            )}
            <input
              id="left-sleeve-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setLeftSleeveImage(URL.createObjectURL(file));
              }}
            />
          </label>

          <label
            htmlFor="right-sleeve-image"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer overflow-hidden hover:border-gray-400 transition-colors"
          >
            {rightSleeveImage ? (
              <img
                src={rightSleeveImage}
                alt="Right Hand Image"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-500 text-center px-2">
                Right Hand Image
              </span>
            )}
            <input
              id="right-sleeve-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setRightSleeveImage(URL.createObjectURL(file));
              }}
            />
          </label>
        </div>

        <div>
          <label
            htmlFor="suggestion"
            className="block mb-2 text-sm font-medium"
          >
            Your Notes/Description
          </label>
          <textarea
            id="suggestion"
            name="suggestion"
            rows={5}
            placeholder="Example: Size, Color, Design Info..."
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Shipping Details */}
        <div>
          <h1 className="text-xl font-semibold mb-4">Shipping Details</h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={shippingInfo.firstName}
                onChange={handleShippingChange}
                placeholder="Example: Aronno"
                required
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block mb-2 text-sm font-medium"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={shippingInfo.lastName}
                onChange={handleShippingChange}
                placeholder="Example: Shikder"
                required
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium"
              >
                ঠিকানা
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                placeholder="House/Road/Area Details"
                required
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={shippingInfo.phone}
                onChange={handleShippingChange}
                placeholder="01XXXXXXXXX"
                required
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="thana" className="block mb-2 text-sm font-medium">
                Upazila
              </label>
              <input
                id="thana"
                name="thana"
                type="text"
                value={shippingInfo.thana}
                onChange={handleShippingChange}
                placeholder="Upazila Name"
                required
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="jela" className="block mb-2 text-sm font-medium">
                District
              </label>
              <input
                id="jela"
                name="jela"
                type="text"
                value={shippingInfo.jela}
                onChange={handleShippingChange}
                placeholder="District Name"
                required
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors uppercase"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
}
