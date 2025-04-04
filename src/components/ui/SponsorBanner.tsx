import { useEffect, useState } from "react";
import bannerEXPO from "@/assets/banners/BannerPatrocinadorEXPO.jpg";
import bannerIAPOI from "@/assets/banners/BannerPatrocinadorIAPOI.jpg";
import bannerLuciano from "@/assets/banners/BannerLuciano.jpeg";
import bannerAnuncie from "@/assets/banners/BannerPatrocine.jpeg";
import bannerTrianon from "@/assets/banners/BannerTrianon.jpg";

import Translator from "../i18n/Translator";

type Sponsor = {
  id: string;
  image: string;
  url?: string;
};

const SponsorBanner = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);

  useEffect(() => {
    // Dados mockados
    const sponsors: Sponsor[] = [
      {
        id: "1",
        image: bannerEXPO,
        url: "https://expoempreendedor.com.br/",
      },
      {
        id: "2",
        image: bannerIAPOI,
        url: "https://wa.me/5569993312323?text=IAPOI+marcas",
      },
      {
        id: "3",
        image: bannerLuciano,
        url: "https://www.instagram.com/santiagobs.cont?igsh=aHZ5Y253NXdtbzN3",
      },
      {
        id: "4",
        image: bannerAnuncie,
        url: "https://wa.me/5511913185849",
      },
      {
        id: "5",
        image: bannerTrianon,
        url: "https://www.hoteltrianon.com.br",
      },
    ];

    setSponsors(sponsors.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (sponsors.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSponsorIndex((prevIndex) => (prevIndex + 1) % sponsors.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sponsors]);

  if (sponsors.length === 0) {
    return null;
  }

  const currentSponsor = sponsors[currentSponsorIndex];
  const imageUrl = currentSponsor.image;

  const SponsorImage = (
    <img
      src={imageUrl}
      alt={`Patrocinador ${currentSponsorIndex + 1}`}
      className="w-full max-h-[90px] object-contain"
    />
  );

  return (
    <div
      className="flex justify-center items-center mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl"
      style={{
        backgroundImage: "linear-gradient(to right, #10438F 50%, #FF672F 50%)",
      }}
    >
      <div className="relative">
        {currentSponsor.url ? (
          <a
            href={currentSponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-h-[90px] sm:max-h-32 object-contain"
          >
            {SponsorImage}
          </a>
        ) : (
          SponsorImage
        )}
        <div className="absolute top-0 right-0 bg-black bg-opacity-75 text-white text-xs text-[10px] px-[4px] py-[2px]">
          <Translator path="Patrocinado" />
        </div>
      </div>
    </div>
  );
};

export default SponsorBanner;
