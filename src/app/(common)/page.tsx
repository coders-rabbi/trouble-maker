import ProductsCard from "@/components/ui/productsCard";
import Herosection from "./home/herosection";
import TrandingProducts from "./home/trandingProducts";
import BestSellingProducts from "./home/bestSellingProducts";

const page = () => {
  return (
    <div className="">
      <Herosection />
      <TrandingProducts />
      <BestSellingProducts />
    </div>
  );
};

export default page;
