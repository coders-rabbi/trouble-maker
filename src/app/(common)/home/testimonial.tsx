// Testimonial.tsx
import { ReviewCarousel } from "@/components/ui/reviewCard";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

const Testimonial = () => {
  return (
    <div className="mt-20">
      <div className="flex justify-between items-center">
        <h1 className="uppercase text-2xl font-semibold">Rider Approved</h1>
        <Link href="/reviews" className="uppercase flex items-center gap-1.5">
          View ALL Reviews
          <FaArrowRight />
        </Link>
      </div>
      <ReviewCarousel />
    </div>
  );
};

export default Testimonial;