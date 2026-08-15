import ProductsCard from "@/components/ui/productsCard";
import Herosection from "./home/herosection";
import TrandingProducts from "./home/trandingProducts";
import BestSellingProducts from "./home/bestSellingProducts";
import Testimonial from "./home/testimonial";

const page = () => {
  return (
    <div className="">
      <Herosection />
      <Testimonial />
      <TrandingProducts />
      <BestSellingProducts />
    </div>
  );
};

export default page;
