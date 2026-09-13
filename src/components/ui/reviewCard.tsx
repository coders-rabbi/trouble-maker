// reviewCard.tsx
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import userImage from "@/assets/user.avif";
import { FaStar } from "react-icons/fa";

export function ReviewCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full mt-10 relative"
    >
      <CarouselContent className="-ml-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <div className="p-1 h-full">
              <Card className="h-full">
                <CardContent className="flex flex-col p-6 h-full">
                  <Image
                    src={userImage}
                    alt="Aronno Shikder"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <p className="flex gap-1 text-yellow-400 mt-2.5">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </p>
                  <p className="mt-2.5 text-sm text-muted-foreground line-clamp-4">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Deserunt natus officia consequuntur adipisci laboriosam
                    voluptatum nisi perspiciatis est dolorem unde.
                  </p>
                  <p className="mt-2.5 font-medium">Aronno Shikder</p>
                  <small className="mt-1 text-muted-foreground">
                    Mirpur, Dhaka
                  </small>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* নেভিগেশন বাটনগুলোর পজিশন পরিবর্তন */}
      <div className="flex justify-end gap-2 mt-4">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
}
