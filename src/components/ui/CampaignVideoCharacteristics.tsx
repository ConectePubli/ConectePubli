import React from "react";
import useIndividualCampaignStore from "@/store/useIndividualCampaignStore";
import { useTranslation } from "react-i18next";

const CampaignVideoCharacteristics: React.FC = () => {
  const { t } = useTranslation();
  const { campaign } = useIndividualCampaignStore();

  if (!campaign) {
    return null;
  }

  const { audio_format, min_video_duration, max_video_duration } = campaign;

  // Verifica se pelo menos uma característica está presente
  const hasVideoCharacteristics =
    Boolean(audio_format) ||
    Boolean(min_video_duration) ||
    Boolean(max_video_duration);

  if (!hasVideoCharacteristics) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border mt-4">
      <h2 className="font-bold">{t("Características do Vídeo")}</h2>
      <div className="flex flex-col gap-2 mt-2">
        {/* Tipo de Vídeo */}
        {audio_format && (
          <p className="text-black">
            {t("Tipo de vídeo:")} {audio_format}
          </p>
        )}

        {/* Duração Mínima */}
        {min_video_duration !== undefined && min_video_duration !== null && (
          <p className="text-black">
            {t("Duração mínima:")} {min_video_duration}
          </p>
        )}

        {/* Duração Máxima */}
        {max_video_duration !== undefined && max_video_duration !== null && (
          <p className="text-black">
            {t("Duração máxima:")} {max_video_duration}
          </p>
        )}
      </div>
    </div>
  );
};

export default CampaignVideoCharacteristics;
