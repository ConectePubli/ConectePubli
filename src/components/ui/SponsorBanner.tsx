import pb from "@/lib/pb";
import { Sponsor } from "@/types/Sponsor";
import { useEffect, useState } from "react";

const SponsorBanner = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const records = await pb.collection<Sponsor>("sponsors").getFullList({
          filter: "active = true",
        });
        setSponsors(records);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };

    fetchSponsors();
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
  const imageUrl = pb.getFileUrl(currentSponsor, currentSponsor.image);

  return (
    <div
      className="relative flex justify-center items-center"
      style={{
        backgroundImage: "linear-gradient(to right, #10438F 50%, #FF672F 50%)",
      }}
    >
      <a href={currentSponsor.url} target="_blank" rel="noopener noreferrer">
        <img
          src={imageUrl}
          alt={`Patrocinador ${currentSponsorIndex + 1}`}
          className="w-full max-h-24 sm:max-h-32 object-contain"
        />
      </a>
      <div className="absolute top-0 left-0 bg-black bg-opacity-75 text-white text-xs px-2 py-1">
        Patrocinado
      </div>
    </div>
  );
};

export default SponsorBanner;
