import { useEffect, useState } from "react";

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
    const mockSponsors: Sponsor[] = [];
    setSponsors(mockSponsors);
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
      className="w-full max-h-24 sm:max-h-32 object-contain"
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
            className="w-full max-h-24 sm:max-h-32 object-contain"
          >
            {SponsorImage}
          </a>
        ) : (
          SponsorImage
        )}
        <div className="absolute top-0 right-0 bg-black bg-opacity-75 text-white text-xs text-[10px] px-[4px] py-[2px]">
          Patrocinado
        </div>
      </div>
    </div>
  );
};

export default SponsorBanner;
