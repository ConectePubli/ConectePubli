import React, { useState, useEffect, useRef } from "react";

interface FeatureCardProps {
  imageSrc: string;
  title: string;
  description: string;
  carousel?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  imageSrc,
  title,
  description,
  carousel,
}) => {
  // Array de frases para o carrossel
  const phrases = [
    "Marcas cadastram campanhas e definem o perfil dos influenciadores-alvo.",
    "Criadores acessam oportunidades e se candidatam diretamente, agilizando o processo.",
    "Marcas aprovam os criadores para participar das campanhas.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Função para avançar para o próximo índice
  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
  };

  // Função para ir para um índice específico
  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    // Inicia o intervalo apenas se o carrossel estiver ativado
    if (carousel) {
      intervalRef.current = setInterval(() => {
        next();
      }, 5000); // 5000ms = 5 segundos

      // Limpa o intervalo ao desmontar ou quando `currentIndex` muda
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, carousel]);

  // Opcional: Reiniciar o intervalo ao clicar manualmente
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-80 sm:h-auto object-cover"
      />
      <div className="px-4 py-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>

        {carousel && (
          <div className="mt-4">
            <div className="relative h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-700 text-center text-sm px-4 transition-opacity duration-1000">
                  {phrases[currentIndex]}
                </p>
              </div>
            </div>
            {/* Indicadores com funcionalidade de clique */}
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
