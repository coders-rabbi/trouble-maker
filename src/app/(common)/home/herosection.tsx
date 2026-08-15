import logo from "@/assets/logo.png";
import Link from "next/link";
import { LiaShoppingBagSolid } from "react-icons/lia";

const Herosection = () => {
  return (
    <div className="">
      <section className="relative w-full h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/sqta1lox/video/upload/v1786791731/video.mp4" />
          Your browser isn't support the video.
        </video>

        <div className="absolute top-0 left-0 w-full h-full bg-black/40" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase">
            Built for bikers
          </h1>
          <p className="text-lg md:text-xl mb-6 uppercase text-gray-300">
            Built for the rider. Made for the rebels
          </p>
          <Link
            href="/shop"
            className="bg-white uppercase text-black px-6 py-3 rounded-full font-semibold flex gap-1"
          >
            Shop now
            <LiaShoppingBagSolid className="text-xl" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Herosection;
