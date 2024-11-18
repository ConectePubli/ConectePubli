import React from "react";

interface Niche {
  id: string;
  niche: string;
}

interface CampaignRequirementsProps {
  gender?: string;
  min_age?: number;
  max_age?: number;
  min_followers?: number;
  niches?: Niche[];
  genderMap: { [key: string]: string };
  locality?: string[];
}

const CampaignRequirements: React.FC<CampaignRequirementsProps> = ({
  gender,
  min_age,
  max_age,
  min_followers,
  niches,
  genderMap,
  locality,
}) => {
  // Verifique se existem requisitos
  const hasRequirements =
    Boolean(gender) ||
    Boolean(min_age) ||
    Boolean(max_age) ||
    Boolean(min_followers) ||
    (niches && niches?.length > 0) ||
    (locality && locality?.length > 0);

  if (!hasRequirements) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border mt-4">
      <h2 className="font-bold">Requisitos</h2>
      <div className="flex flex-col gap-2 mt-2">
        {/* Gênero */}
        {gender && <p>Gênero: {genderMap[gender]}</p>}

        {/* Idade Mínima */}
        {min_age !== undefined && min_age !== null && (
          <p>Idade mínima: {min_age}</p>
        )}

        {/* Idade Máxima */}
        {max_age !== undefined && max_age !== null && (
          <p>Idade máxima: {max_age}</p>
        )}

        {/* Mínimo de Seguidores */}
        {min_followers !== undefined && min_followers !== null && (
          <p>
            Mínimo de seguidores:{" "}
            {Number(min_followers).toLocaleString("pt-BR")}
          </p>
        )}

        {/* Nichos */}
        {niches && niches?.length > 0 && (
          <>
            <p>Atuar em, no mínimo, um dos nichos:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {niches.map((niche) => (
                <span
                  key={niche.id}
                  className="bg-[#10438F] text-white px-3 py-2 text-md rounded-md flex items-center font-semibold cursor-default select-none"
                  title={niche.niche}
                >
                  #{niche.niche}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Locality */}
        {locality && locality.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <p>Localidades permitidas:</p>
            <p>{locality.join(", ")}</p> {/* Display as a comma-separated string */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignRequirements;
