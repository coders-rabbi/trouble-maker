"use client";

import Image from "next/image";
import img from "@/assets/products/img2.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsFillBoxSeamFill } from "react-icons/bs";
import ProductsCard from "@/components/ui/productsCard";
import { ArrowTurnForwardIcon } from "@hugeicons/core-free-icons";

const Page = () => {
  const router = useRouter();

  const prpoductId = 1;
  const price = 500;
  const size = "M";
  const quantity = 2;
  const variation = "black";

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-28 px-5 max-w-4xl mx-auto">
        <div>
          <Image src={img} alt="" />
        </div>
        <div>
          <div className="flex justify-between text-2xl gap-10 font-semibold text-nowrap">
            <h1 className="text-2xl font-semibold uppercase text-wrap">
              Spider Man Premium Dropshoulder Tee
            </h1>
            <p>৳ 660</p>
          </div>

          <div className="flex items-center gap-4 mt-7">
            <h2 className="text-xl font-semibold uppercase text-gray-400">
              Select Color:
            </h2>
            <p className="h-5 w-5 bg-white border border-black rounded-full"></p>
            <p className="h-5 w-5 bg-black rounded-full"></p>
          </div>

          <div className="flex items-center gap-4 mt-7">
            <h2 className="text-xl font-semibold uppercase text-gray-400">
              Select Size:
            </h2>
            <p className="bg-white border border-black py-1 px-2">M</p>
            <p className="bg-white border border-black py-1 px-2">L</p>
            <p className="bg-white border border-black py-1 px-2">XL</p>
            <p className="bg-white border border-black py-1 px-2">Xl</p>
          </div>

          <button
            onClick={() => {
              router.push(
                `/checkout/shipping_address?productId=${prpoductId}&price=${price}&count=${quantity}&size=${size}&color=${variation}`,
              );
            }}
            className="mt-[30px] w-full rounded-md bg-black px-4 py-2.5 font-inherit text-white font-medium hover:bg-[#2C2D2D] transition-colors uppercase"
          >
            procced to checkout
          </button>

          {/* product details section */}
          <div>
            <h3 className="uppercase text-gray-400 text-xs mt-7 flex items-center gap-4">
              <BsFillBoxSeamFill />
              Product Details
            </h3>

            <div className="flex flex-col gap-5 mt-7">
              <p className="text-xs text-gray-400">
                Crafted from heavyweight 450 GSM cotton, finished with a refined
                acid wash for a rich, worn-in character and depth. The fabric
                feels dense yet comfortable, holding a structured drape with a
                naturally aged look.
              </p>
              <h3 className="text-xs text-gray-400">
                Why Trouble Make Bangladesh?
              </h3>
              <ul className="text-xs text-gray-400">
                <li>450 GSM premium acid-washed cotton</li>
                <li>450 GSM premium acid-washed cotton</li>
                <li>450 GSM premium acid-washed cotton</li>
                <li>450 GSM premium acid-washed cotton</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="uppercase text-gray-400 text-center mt-32">
          Complementary Pieces
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <ProductsCard key={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
