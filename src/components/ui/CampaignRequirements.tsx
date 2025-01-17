import React from "react";
import useIndividualCampaignStore from "@/store/useIndividualCampaignStore";
import { genderMap } from "@/utils/genderMap";
import { t } from "i18next";

interface Niche {
  id: string;
  niche: string;
}

const CampaignRequirements: React.FC = () => {
  const { campaign } = useIndividualCampaignStore();

  if (!campaign) {
    return null;
  }

  const { gender, min_age, max_age, min_followers, expand, address } = campaign;
  const niches: Niche[] | undefined = expand?.niche;

  // Verifique se existem requisitos
  const hasRequirements =
    Boolean(gender) ||
    Boolean(min_age) ||
    Boolean(max_age) ||
    Boolean(min_followers) ||
    (niches && niches.length > 0);

  if (!hasRequirements) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border mt-4">
      <h2 className="font-bold">{t("Requisitos")}</h2>
      <div className="flex flex-col gap-2 mt-2">
        {/* Gênero */}
        {gender && (
          <p>
            {t("Gênero: ")}
            {genderMap[gender]}
          </p>
        )}

        {/* Idade Mínima */}
        {min_age && (
          <p>
            {t("Idade mínima: ")}
            {min_age}
          </p>
        )}

        {/* Idade Máxima */}
        {max_age && (
          <p>
            {t("Idade máxima: ")}
            {max_age}
          </p>
        )}

        {/* Mínimo de Seguidores */}
        {min_followers && (
          <p>
            {t("Mínimo de seguidores:")}{" "}
            {Number(min_followers).toLocaleString("pt-BR")}
          </p>
        )}

        {/* Localidades */}
        {address && (
          <div className="flex flex-wrap gap-2">
            <p>{t("Localidades permitidas:")}</p>
            <p>{address}</p>
          </div>
        )}

        {/* Nichos */}
        {niches && niches?.length > 0 && (
          <>
            <p>{t("Atuar em, no mínimo, um dos nichos:")}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {niches.map((niche) => (
                <span
                  key={niche.id}
                  className="bg-[#10438F] text-white px-3 py-2 text-md rounded-md flex items-center font-semibold cursor-default select-none"
                  title={niche.niche}
                >
                  #{t(niche.niche)}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignRequirements;
