import Image from "next/image";
import Link from "next/link";
import img1 from "@/assets/products/img1.png";
import img2 from "@/assets/products/img2.png";
import img3 from "@/assets/products/img3.png";

const ProductsCard = () => {
  return (
    <div className="border p-2">
      <div className="relative group overflow-hidden">
        <Image
          src={img2}
          alt=""
          className="max-h-[350px] xl:max-h-[400px] w-full"
        />
        <div className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            href="/order"
            className="block bg-black py-3 w-full text-white text-center uppercase"
          >
            Order Now
          </Link>
        </div>
      </div>
      <div className="flex justify-between px-3 mt-2">
        <h4 className="text-xs font-semibold">
          Spider Man Premium Dropshoulder Tee
        </h4>
        <p className="text-xs font-semibold">৳ 660</p>
      </div>
    </div>
  );
};

export default ProductsCard;
