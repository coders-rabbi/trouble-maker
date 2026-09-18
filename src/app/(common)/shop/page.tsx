import ProductsCard from "@/components/ui/productsCard";
import { getAllProducts } from "@/services/products";
import React from "react";

const page = async () => {
  const allProducts = await getAllProducts();
  
  console.log(allProducts)
  return (
    <div className="mt-10">
      <h1 className="font-bold text-xl md:text-2xl lg:text-3xl uppercase mb-5">
        Archives
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-rows-4 xl:grid-cols-5 gap-3">
        {allProducts.map((item) => (
          <ProductsCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default page;
