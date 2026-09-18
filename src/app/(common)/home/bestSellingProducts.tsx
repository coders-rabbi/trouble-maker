import ProductsCard from "@/components/ui/productsCard";
import { IProduct } from "@/types/products";
import React from "react";
import { FaGripfire } from "react-icons/fa";
import { GiElectric } from "react-icons/gi";

interface ProductsProps {
  products: IProduct[];
}

const BestSellingProducts = ({products}: ProductsProps) => {
  return (
    <div className="mt-20">
      <p className="mb-2 uppercase font-semibold flex items-center gap-1 text-xs">
        <GiElectric className="text-[#FF4000]" />
        Best selling
      </p>
      <h1 className="uppercase font-semibold text-2xl md:text-3xl xl:text-4xl">
        Best selling
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-5">
        {products.map((item) => (
          <ProductsCard key={item?._id} product={item}/>
        ))}
      </div>
    </div>
  );
};

export default BestSellingProducts;
