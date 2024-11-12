import React from "react";

interface CampaignVideoCharacteristicsProps {
  video_type?: string;
  min_video_duration?: string;
  max_video_duration?: string;
}

const CampaignVideoCharacteristics: React.FC<
  CampaignVideoCharacteristicsProps
> = ({ video_type, min_video_duration, max_video_duration }) => {
  // Verifica se pelo menos uma característica está presente
  const hasVideoCharacteristics =
    Boolean(video_type) ||
    Boolean(min_video_duration) ||
    Boolean(max_video_duration);

  if (!hasVideoCharacteristics) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border mt-4">
      <h2 className="font-bold">Características do Vídeo</h2>
      <div className="flex flex-col gap-2 mt-2">
        {/* Tipo de Vídeo */}
        {video_type && (
          <p className="text-black">Tipo de vídeo: {video_type}</p>
        )}

        {/* Duração Mínima */}
        {min_video_duration !== undefined && min_video_duration !== null && (
          <p className="text-black">Duração mínima: {min_video_duration}</p>
        )}

        {/* Duração Máxima */}
        {max_video_duration !== undefined && max_video_duration !== null && (
          <p className="text-black">Duração máxima: {max_video_duration}</p>
        )}
      </div>
    </div>
  );
};

export default CampaignVideoCharacteristics;
