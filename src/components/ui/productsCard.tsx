"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/types/products";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface ProductsProps {
  product: IProduct;
}

const ProductsCard = ({ product }: ProductsProps) => {
  const images = [
    product?.media?.thumbnailImage,
    ...(product?.media?.galleryImages ?? []),
  ].filter(Boolean) as string[];

  const [currentIndex, setCurrentIndex] = useState(0);

  // product না থাকলে বা কোনো image না থাকলে "Coming Soon" দেখাও
  if (!product || images.length === 0) {
    return (
      <div className="border p-2">
        <div className="relative flex aspect-[3/4] items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <span className="text-2xl">🕐</span>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Coming Soon
            </p>
          </div>
        </div>
        <div className="flex justify-between px-3 mt-2">
          <h4 className="text-xs font-semibold text-gray-300">
            {product?.basicInfo?.productName || "Product unavailable"}
          </h4>
        </div>
      </div>
    );
  }

  const showPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="border p-2">
      <div className="relative group overflow-hidden aspect-[3/4]">
        <Image
          src={images[currentIndex]}
          alt={product?.basicInfo?.productName}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
          unoptimized
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-black opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white z-10"
            >
              <FaAngleLeft size={16} />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-black opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white z-10"
            >
              <FaAngleRight size={16} />
            </button>

            {/* dots */}
            <div className="absolute bottom-14 left-0 flex w-full items-center justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 z-10">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            href={`/shop/${product?._id}`}
            className="block bg-black py-3 w-full text-white text-center uppercase"
          >
            Order Now
          </Link>
        </div>
      </div>
      <div className="flex justify-between px-3 mt-2">
        <h4 className="text-xs font-semibold">
          {product?.basicInfo?.productName}
        </h4>
        <p className="text-xs font-semibold text-nowrap">
          ৳{" "}
          {product?.pricingInventory?.discountPrice ||
            product?.pricingInventory?.price}
        </p>
      </div>
    </div>
  );
};

export default ProductsCard;
