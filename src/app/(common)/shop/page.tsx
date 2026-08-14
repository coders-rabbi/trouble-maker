import ProductsCard from "@/components/productsCard";
import React from "react";

const page = () => {
  return (
    <div className="mt-28 h-full">
      <h1 className="font-bold text-xl md:text-2xl lg:text-3xl uppercase mb-5">
        Archives
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-rows-4 xl:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <ProductsCard />
        ))}
      </div>
    </div>
  );
};

export default page;
