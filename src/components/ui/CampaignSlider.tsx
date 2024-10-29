// src/components/ui/CampaignSlider.tsx
import React, { useRef } from "react";
import ArrowLeft from "@/assets/icons/arrow-left.svg";
import ArrowRight from "@/assets/icons/arrow-right.svg";
import { Campaign } from "@/types/Campaign";
import CampaignSliderBanner from "@/components/ui/CampaignSliderBanner";

interface CampaignSliderProps {
  campaigns: Campaign[];
}

const CampaignSlider: React.FC<CampaignSliderProps> = ({ campaigns }) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeftStart = useRef<number>(0);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (sliderRef.current) {
      isDragging.current = true;
      sliderRef.current.classList.add("active");
      sliderRef.current.classList.add("no-select");
      startX.current = e.clientX;
      scrollLeftStart.current = sliderRef.current.scrollLeft;
    }
  };

  const handlePointerUp = () => {
    if (sliderRef.current) {
      isDragging.current = false;
      sliderRef.current.classList.remove("active");
      sliderRef.current.classList.remove("no-select");
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !sliderRef.current) return;
    const x = e.clientX;
    const walk = (x - startX.current) * 1;
    sliderRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2 max-w-[98dvw]">
        <p className="text-lg font-bold pl-4">Campanhas</p>
        <div className="flex items-center gap-4 px-4">
          <img
            src={ArrowLeft}
            className="w-5 h-5 cursor-pointer"
            onClick={scrollLeft}
            alt="Scroll Esquerda"
          />
          <img
            src={ArrowRight}
            className="w-5 h-5 cursor-pointer"
            onClick={scrollRight}
            alt="Scroll Direita"
          />
        </div>
      </div>
      <div
        className="flex overflow-x-scroll scrollbar-hide active:cursor-grabbing"
        ref={sliderRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerMove={handlePointerMove}
      >
        {campaigns.map((campaign, index) => (
          <CampaignSliderBanner
            key={campaign.id}
            campaign={campaign}
            isFirst={index === 0}
            onClick={(id) => {
              console.log("Clique na campanha", id);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CampaignSlider;
