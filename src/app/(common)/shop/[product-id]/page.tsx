"use client";

import Image from "next/image";
import img from "@/assets/products/img2.png";
import { useRouter } from "next/navigation";
import { BsFillBoxSeamFill } from "react-icons/bs";
import ProductsCard from "@/components/ui/productsCard";
import { useState } from "react";
import chartImg from "@/assets/chart.jpeg";

const Page = () => {
  const router = useRouter();

  const [selectedColor, setSelectedColor] = useState("white");
  const [selectedSize, setSelectedSize] = useState("M");
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const productId = 1;
  const price = 660;
  const quantity = 2;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-28 px-5 max-w-4xl mx-auto">
        <div>
          <Image src={img} alt="Spider Man Premium Dropshoulder Tee" />
        </div>
        <div>
          <div className="flex justify-between text-2xl gap-10 font-semibold text-nowrap">
            <h1 className="text-xl font-semibold uppercase text-wrap">
              Spider Man Premium Dropshoulder Tee
            </h1>
            <p>৳ {price}</p>
          </div>

          {/* Color Selection */}
          <div className="flex items-center gap-4 mt-7">
            <h2 className="text-sm font-semibold uppercase text-gray-400">
              Select Color:
            </h2>
            <button
              onClick={() => setSelectedColor("white")}
              className={`h-5 w-5 bg-white border rounded-full transition-all ${
                selectedColor === "white"
                  ? "ring-2 ring-black ring-offset-2 border-black"
                  : "border-gray-300"
              }`}
              aria-label="White color"
            />
            <button
              onClick={() => setSelectedColor("black")}
              className={`h-5 w-5 bg-black rounded-full transition-all ${
                selectedColor === "black"
                  ? "ring-2 ring-black ring-offset-2"
                  : ""
              }`}
              aria-label="Black color"
            />
          </div>

          {/* Size Selection */}
          <div className="flex justify-between items-center mt-7">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase text-gray-400 mr-2">
                Select Size:
              </h2>
              {["M", "L", "XL", "XXL"].map((sizeOption) => (
                <button
                  key={sizeOption}
                  onClick={() => setSelectedSize(sizeOption)}
                  className={`border text-xs py-1 px-3 transition-all ${
                    selectedSize === sizeOption
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  {sizeOption}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsSizeChartOpen(true)}
              className="text-xs uppercase hover:underline"
            >
              size chart
            </button>
          </div>

          <button
            onClick={() => {
              router.push(
                `/checkout/shipping_address?productId=${productId}&price=${price}&count=${quantity}&size=${selectedSize}&color=${selectedColor}`,
              );
            }}
            className="mt-[30px] w-full rounded-md bg-black px-4 py-2.5 font-inherit text-white font-medium hover:bg-[#2C2D2D] transition-colors uppercase"
          >
            proceed to checkout
          </button>

          {/* product details section */}
          <div>
            <h3 className="uppercase text-gray-400 text-xs mt-7 flex items-center gap-4">
              <BsFillBoxSeamFill />
              Product Details
            </h3>

            <div className="flex flex-col gap-5 mt-7">
              <p className="text-xs text-gray-400">
                Crafted from heavyweight 450 GSM cotton, finished with a refined
                acid wash for a rich, worn-in character and depth. The fabric
                feels dense yet comfortable, holding a structured drape with a
                naturally aged look.
              </p>
              <h3 className="text-xs text-gray-400">
                Why Trouble Make Bangladesh?
              </h3>
              <ul className="text-xs text-gray-400 list-disc list-inside">
                <li>450 GSM premium acid-washed cotton</li>
                <li>Durable stitching and comfortable fit</li>
                <li>Pre-shrunk fabric to maintain size</li>
                <li>Unique vintage acid wash finish</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="uppercase text-gray-400 text-center mt-32">
          Complementary Pieces
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <ProductsCard key={item} />
          ))}
        </div>
      </div>

      {/* Size Chart Modal */}
      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setIsSizeChartOpen(false)}
        >
          <div
            className="relative bg-white rounded-md p-4 w-full max-w-lg max-h-[85vh] sm:max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg z-10"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex-1 min-h-0 mt-6">
              <Image
                src={chartImg}
                alt="Size Chart"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
