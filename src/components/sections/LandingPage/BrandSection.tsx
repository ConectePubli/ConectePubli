import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import useWindowSize from "@/hooks/useWindowSize";
import { BrandLogo } from "@/components/LandingPage/Brand/BrandLogo";

import discordLogo from "@/assets/discord.svg";

export const BrandsSection: React.FC = () => {
  const { width } = useWindowSize();

  const isMobile = width < 768;

  return (
    <section className="py-8">
      {isMobile ? (
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
          }}
        >
          <SwiperSlide>
            <BrandLogo
              imageSrc={discordLogo}
              altText="Discord"
              link="https://discord.com"
            />
          </SwiperSlide>
          <SwiperSlide>
            <BrandLogo
              imageSrc={discordLogo}
              altText="Discord"
              link="https://discord.com"
            />
          </SwiperSlide>
          <SwiperSlide>
            <BrandLogo
              imageSrc={discordLogo}
              altText="Discord"
              link="https://discord.com"
            />
          </SwiperSlide>
          <SwiperSlide>
            <BrandLogo
              imageSrc={discordLogo}
              altText="Discord"
              link="https://discord.com"
            />
          </SwiperSlide>

          {/* Custom navigation buttons */}
          <div className="custom-prev swiper-button-prev"></div>
          <div className="custom-next swiper-button-next"></div>
        </Swiper>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 items-center justify-items-center">
          <BrandLogo
            imageSrc={discordLogo}
            altText="Discord"
            link="https://discord.com"
          />
          <BrandLogo
            imageSrc={discordLogo}
            altText="Discord"
            link="https://discord.com"
          />
          <BrandLogo
            imageSrc={discordLogo}
            altText="Discord"
            link="https://discord.com"
          />
          <BrandLogo
            imageSrc={discordLogo}
            altText="Discord"
            link="https://discord.com"
          />
        </div>
      )}
    </section>
  );
};
