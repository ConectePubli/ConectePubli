// src/components/ui/CampaignSlider.tsx
import React, { useRef, useCallback, useEffect } from "react";
import ArrowLeft from "@/assets/icons/arrow-left.svg";
import ArrowRight from "@/assets/icons/arrow-right.svg";
import { Campaign } from "@/types/Campaign";
import CampaignSliderBanner from "@/components/ui/CampaignSliderBanner";

interface CampaignSliderProps {
  campaigns: Campaign[];
}

const CampaignSlider: React.FC<CampaignSliderProps> = ({ campaigns }) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startTime = useRef(0);
  const scrollLeftStart = useRef(0);

  const dragThreshold = 5;
  const clickThreshold = 150;

  // Função de clique nos banners
  const handleBannerClick = useCallback((id: string) => {
    console.log("Clique na campanha", id); //TODO
  }, []);

  // Handler para o movimento do ponteiro
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!sliderRef.current) return;

      const x = e.clientX;
      const walk = x - startX.current;

      // Detecta se o movimento excede o limiar para considerar como arraste
      if (!isDragging.current && Math.abs(walk) > dragThreshold) {
        isDragging.current = true;
      }

      if (isDragging.current) {
        sliderRef.current.scrollLeft = scrollLeftStart.current - walk;
      }
    },
    [dragThreshold]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (!sliderRef.current) return;

      const endTime = Date.now();
      const duration = endTime - startTime.current;
      const endX = e.clientX;
      const walk = endX - startX.current;

      isDragging.current = false;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      if (duration < clickThreshold && Math.abs(walk) < dragThreshold) {
        const element = document.elementFromPoint(e.clientX, e.clientY);
        let campaignId: string | null = null;

        let el: HTMLElement | null = element as HTMLElement;

        while (el && el !== sliderRef.current) {
          if (el.dataset.campaignId) {
            campaignId = el.dataset.campaignId;
            break;
          }
          el = el.parentElement;
        }

        if (campaignId) {
          handleBannerClick(campaignId);
        }
      }
    },
    [handlePointerMove, handleBannerClick, clickThreshold, dragThreshold]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (sliderRef.current) {
        isDragging.current = false;
        startX.current = e.clientX;
        startTime.current = Date.now();
        scrollLeftStart.current = sliderRef.current.scrollLeft;

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
      }
    },
    [handlePointerMove, handlePointerUp]
  );

  const scrollLeftHandler = useCallback(() => {
    if (sliderRef.current) {
      const sliderWidth = sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({
        left: -sliderWidth,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollRightHandler = useCallback(() => {
    if (sliderRef.current) {
      const sliderWidth = sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({
        left: sliderWidth,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2 max-w-[98vw]">
        <p className="text-lg font-bold pl-4">Campanhas</p>
        <div className="flex items-center gap-4 px-4">
          <button
            onClick={scrollLeftHandler}
            className="w-5 h-5 cursor-pointer"
            aria-label="Scroll Esquerda"
          >
            <img src={ArrowLeft} alt="Scroll Esquerda" />
          </button>
          <button
            onClick={scrollRightHandler}
            className="w-5 h-5 cursor-pointer"
            aria-label="Scroll Direita"
          >
            <img src={ArrowRight} alt="Scroll Direita" />
          </button>
        </div>
      </div>

      <div
        className="flex overflow-x-scroll scrollbar-hide active:cursor-grabbing"
        ref={sliderRef}
        onPointerDown={handlePointerDown}
      >
        {campaigns.map((campaign, index) => (
          <CampaignSliderBanner
            key={campaign.id}
            campaign={campaign}
            isFirst={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default CampaignSlider;