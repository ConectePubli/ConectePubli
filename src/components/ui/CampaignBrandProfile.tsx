import React from "react";
import BackgroundPlaceholder from "@/assets/background-placeholder.webp";
import ProfilePlaceholder from "@/assets/profile-placeholder.webp";
import LocationPin from "@/assets/icons/location-pin.svg";
import SocialNetworks from "@/types/SocialNetworks";
import { Link } from "lucide-react";
import useIndividualCampaignStore from "@/store/useIndividualCampaignStore";
import { formatLocation } from "@/utils/formatLocation";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const CampaignBrandProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const brand = useIndividualCampaignStore(
    (state) => state.campaign?.expand?.brand
  );

  if (!brand) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border relative">
      {/* Imagem de Capa */}
      <img
        src={
          brand.cover_img
            ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${brand.collectionName}/${brand.id}/${brand.cover_img}`
            : BackgroundPlaceholder
        }
        alt="Capa da Marca"
        className="w-full h-28 object-cover rounded-t-lg"
      />

      {/* Imagem de Perfil */}
      <div className="absolute left-16 transform -translate-x-1/2 -translate-y-1/2">
        <img
          src={
            brand.profile_img
              ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${brand.collectionName}/${brand.id}/${brand.profile_img}`
              : ProfilePlaceholder
          }
          alt="Perfil da Marca"
          className="w-16 h-16 rounded-full border-4 border-white object-cover cursor-pointer"
          onClick={() => navigate({ to: `/marca/${brand.username}` })}
        />
      </div>

      {/* Conteúdo da Marca */}
      <div className="p-4 mt-8">
        {/* Nome da Marca */}
        {brand.name && (
          <h2
            className="font-bold break-words break-all cursor-pointer"
            onClick={() => navigate({ to: `/marca/${brand.username}` })}
          >
            {brand.name}
          </h2>
        )}

        {/* Localização */}
        {brand && formatLocation(brand) && (
          <div className="flex flex-row items-center mt-3">
            <img src={LocationPin} alt="Localização" className="w-5 h-5 mr-1" />
            <p
              className="text-orange-600 font-bold text-md truncate max-w-xs"
              title={formatLocation(brand)}
            >
              {formatLocation(brand)}
            </p>
          </div>
        )}

        {/* Website */}
        {brand.web_site && (
          <div className="mt-3 flex flex-row items-center">
            <Link className="text-black mr-2" size={16} />
            <a
              className="text-[#10438F] font-semibold text-md hover:underline"
              href={brand.web_site}
              target="_blank"
              rel="noopener noreferrer"
            >
              {brand.web_site}
            </a>
          </div>
        )}

        {/* Bio da Empresa */}
        <p className="text-black mt-3 font-bold">{t("Sobre a empresa")}</p>
        <p className="text-black text-md mt-2 break-words line-clamp-6">
          {brand.bio || t("Biografia não informada.")}
        </p>

        {/* Redes Sociais */}
        {SocialNetworks.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 sm-medium:gap-2">
            {SocialNetworks.map((network) => {
              const url = network.url(brand);
              if (!url) return null;

              return (
                <a
                  key={network.name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center border border-[#10438F] text-[#10438F] px-2 py-1 text-sm sm-medium:text-base rounded-md font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200 sm-medium:px-3 sm-medium:py-2 sm-medium:text-md"
                >
                  <img
                    src={network.icon}
                    alt={`Ícone do ${network.name}`}
                    className="w-4 h-4 mr-1 sm-medium:w-5 sm-medium:h-5 sm-medium:mr-2"
                  />
                  {network.name}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignBrandProfile;
