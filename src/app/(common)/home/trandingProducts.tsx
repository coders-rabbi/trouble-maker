import ProductsCard from "@/components/ui/productsCard";
import React from "react";
import { FaGripfire } from "react-icons/fa";

const TrandingProducts = () => {
  return (
    <div className="mt-10">
      <p className="mb-2 uppercase font-semibold flex items-center gap-1 text-xs">
        <FaGripfire className="text-[#FF4000]" />
        Tending now
      </p>
      <h1 className="uppercase font-semibold text-2xl md:text-3xl xl:text-4xl">
        Trending now
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-5">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <ProductsCard key={item}/>
        ))}
      </div>
    </div>
  );
};

export default TrandingProducts;
