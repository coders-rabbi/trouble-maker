"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { BsFillBoxSeamFill } from "react-icons/bs";
import ProductsCard from "@/components/ui/productsCard";
import { useState, useEffect } from "react";
import chartImg from "@/assets/chart.jpeg";
import useSWR from "swr";
import { getAllProducts, getSingleProduct } from "@/services/products";

const Page = () => {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>();
  const router = useRouter();
  const prodId = useParams();

  const { data: singleProducts } = useSWR("singleProduct", () =>
    getSingleProduct(prodId?.productId as string),
  );

  const {
    data: allProducts,
    error,
    isLoading,
  } = useSWR("allProducts", () => getAllProducts());

  // product লোড হওয়ার পর main image সেট করে দাও
  useEffect(() => {
    if (singleProducts?.media?.thumbnailImage) {
      setSelectedImage(singleProducts.media.thumbnailImage);
    }
    if (singleProducts?.variation?.color?.length) {
      setSelectedColor(singleProducts.variation.color[0]);
    }
    if (singleProducts?.variation?.size?.length) {
      setSelectedSize(singleProducts?.variation.size[0]);
    }
  }, [singleProducts]);

  const handleIncrease = () => {
    const stock =
      singleProducts?.pricingInventory?.stockKeepingUnit ?? Infinity;
    setQuantity((prev) => (prev < stock ? prev + 1 : prev));
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-28 px-5 max-w-4xl mx-auto">
        <div>
          {/* Main Image */}
          <div className="relative w-full h-[450px]">
            <Image
              src={
                selectedImage ||
                (singleProducts?.media?.thumbnailImage as string)
              }
              alt={singleProducts?.basicInfo?.productName || "Product image"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-3 mt-3 overflow-x-auto">
            {/* thumbnailImage কেও gallery তে দেখাতে চাইলে নিচের লাইনটা রাখো */}
            {[
              singleProducts?.media?.thumbnailImage,
              ...(singleProducts?.media?.galleryImages ?? []),
            ]
              .filter(Boolean)
              .map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl as string)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border transition-all ${
                    selectedImage === imgUrl
                      ? "border-black ring-1 ring-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={imgUrl as string}
                    alt={`${singleProducts?.basicInfo?.productName || "Product"} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-2xl gap-10 font-semibold text-nowrap">
            <h1 className="text-xl font-semibold uppercase text-wrap">
              {singleProducts?.basicInfo?.productName}
            </h1>
            <p>৳ {singleProducts?.pricingInventory?.price}</p>
          </div>

          {/* Color Selection */}
          {/* Color Selection */}
          <div className="flex items-center gap-4 mt-7">
            <h2 className="text-sm font-semibold uppercase text-gray-400">
              Select Color:
            </h2>
            <div className="flex items-center gap-3">
              {singleProducts?.variation?.color?.map((colorOption) => (
                <button
                  key={colorOption}
                  onClick={() => setSelectedColor(colorOption)}
                  style={{ backgroundColor: colorOption }}
                  className={`h-5 w-5 rounded-full border transition-all ${
                    selectedColor === colorOption
                      ? "ring-2 ring-black ring-offset-2 border-black"
                      : "border-gray-300"
                  }`}
                  aria-label={`${colorOption} color`}
                  title={colorOption}
                />
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="flex items-center gap-4 mt-7">
            <h2 className="text-sm font-semibold uppercase text-gray-400">
              Quantity:
            </h2>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={handleDecrease}
                className="px-3 py-1 text-sm hover:bg-gray-100 transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-4 py-1 text-sm min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="px-3 py-1 text-sm hover:bg-gray-100 transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Size Selection */}
          <div className="flex justify-between items-center mt-7">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase text-gray-400 mr-2">
                Select Size:
              </h2>
              {singleProducts?.variation?.size.map((sizeOption) => (
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
                `/checkout/shipping_address?productId=${singleProducts?._id}&price=${singleProducts?.pricingInventory?.price}&count=${quantity}&size=${selectedSize}&color=${selectedColor}&name=${singleProducts?.basicInfo?.productName}`,
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
              <div
                className="text-xs text-gray-400 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: singleProducts?.basicInfo?.longDescription || "",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="uppercase text-gray-400 text-center mt-32">
          Complementary Pieces
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-5">
          {allProducts?.map((item) => (
            <ProductsCard key={item?._id} product={item} />
          ))}
        </div>
      </div>

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
