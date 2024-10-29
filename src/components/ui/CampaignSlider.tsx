import React, { useRef } from "react";
import ArrowLeft from "@/assets/icons/arrow-left.svg";
import ArrowRight from "@/assets/icons/arrow-right.svg";
import { Tag } from "lucide-react";

const CampaignSlider = ({ campaigns }) => {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -300, // Ajuste a distância de rolagem conforme necessário
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 300, // Ajuste a distância de rolagem conforme necessário
        behavior: "smooth",
      });
    }
  };

  // Funções para permitir clicar e arrastar no desktop
  let isDown = false;
  let startX;
  let scrollLeftStart;

  const handleMouseDown = (e) => {
    isDown = true;
    sliderRef.current.classList.add("active");
    startX = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftStart = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
    sliderRef.current.classList.remove("active");
  };

  const handleMouseUp = () => {
    isDown = false;
    sliderRef.current.classList.remove("active");
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Ajuste a velocidade de rolagem conforme necessário
    sliderRef.current.scrollLeft = scrollLeftStart - walk;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
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
        className="flex overflow-x-scroll scrollbar-hide scroll-smooth"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {campaigns.map((campaign, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-64 mr-4 ${index === 0 && "ml-4"}`}
          >
            <div className="flex flex-col border border-gray-400 rounded-lg p-4">
              <p className="text-sm font-bold flex flex-row items-center text-[#10438F]">
                <Tag className="mr-2" size={16} />
                {campaign.objective}
              </p>
              <h1 className="text-lg font-bold mt-2">{campaign.name}</h1>
            </div>
            <p className="mt-2 text-md font-semibold">{campaign.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignSlider;
