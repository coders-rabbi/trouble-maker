import ProductsCard from "@/components/ui/productsCard";
import Herosection from "./home/herosection";
import TrandingProducts from "./home/trandingProducts";
import BestSellingProducts from "./home/bestSellingProducts";
import Testimonial from "./home/testimonial";
import { getAllProducts } from "@/services/products";

const page = async () => {
  const allProducts = await getAllProducts();
  return (
    <div className="">
      <Herosection />
      <Testimonial />
      <TrandingProducts products={allProducts} />
      <BestSellingProducts products={allProducts}/>
    </div>
  );
};

export default page;
