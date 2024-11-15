// src/components/LandingPage/FeaturesCard/FeatureCardWithCarousel.tsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface FeatureCardWithCarouselProps {
  imageSrc: string;
  title: string;
  description: string;
  carouselItems: string[];
}

export const FeatureCardWithCarousel: React.FC<
  FeatureCardWithCarouselProps
> = ({ imageSrc, title, description, carouselItems }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-80 sm:h-96 object-cover" // Aumentei a altura para sm:h-96
      />
      <div className="px-4 py-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2 flex-1">{description}</p>

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          className="mt-4"
        >
          {carouselItems.map((item, index) => (
            <SwiperSlide key={index}>
              <p className="text-gray-700">• {item}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
