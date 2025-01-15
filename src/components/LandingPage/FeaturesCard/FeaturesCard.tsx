import { t } from "i18next";
import React, { useState, useEffect, useRef } from "react";

interface FeatureCardProps {
  imageSrc: string;
  title: string;
  descriptionBrand: string;
  descriptionCreator: string;
  carousel?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  imageSrc,
  title,
  descriptionBrand,
  descriptionCreator,
  carousel,
}) => {
  const phrases = [
    t("Marcas cadastram campanhas e definem o perfil dos creators-alvo."),
    t(
      "Criadores acessam oportunidades e se candidatam diretamente, agilizando o processo."
    ),
    t("Marcas aprovam os criadores para participar das campanhas."),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (carousel) {
      intervalRef.current = setInterval(() => {
        next();
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, carousel]);

  useEffect(() => {
    if (carousel) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        next();
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, carousel]);

  return (
    <div className="bg-[#FCFCFC] rounded-lg shadow-md overflow-hidden">
      <img src={imageSrc} alt={title} className="w-full h-80 object-cover" />
      <div className="px-3 py-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2">
          <span className="font-semibold text-gray-700">
            {t("Para Marcas:")}
          </span>{" "}
          {descriptionBrand}
        </p>
        <p className="text-gray-600 mt-2">
          <span className="font-semibold text-gray-700">
            {t("Para Criadores:")}
          </span>{" "}
          {descriptionCreator}
        </p>

        {carousel && (
          <div className="mt-4">
            <div className="relative h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-700 text-center text-sm px-2 transition-opacity duration-1000">
                  {phrases[currentIndex]}
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-2 space-x-2">
              {phrases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`w-3 h-3 rounded-full focus:outline-none ${
                    index === currentIndex
                      ? "bg-blue-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Mostrar frase ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
