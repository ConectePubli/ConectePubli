/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCampaignStore } from "@/store/useCampaignStore";
import { format } from "date-fns";
import { useNavigate } from "@tanstack/react-router";
import { formatDateUTC } from "@/utils/formatDateUTC";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Button } from "./button";
import { Campaign } from "@/types/Campaign";
import pb from "@/lib/pb";
import { generateUniqueName } from "@/services/createCampaign";
import { toast } from "react-toastify";
import { useState } from "react";
import { Spinner } from "phosphor-react";

const CampaignsTable: React.FC = () => {
  const { t } = useTranslation();
  const { campaigns, isLoading, error } = useCampaignStore();
  const [isDuplicating, setIsDuplicating] = useState(false);
  const navigate = useNavigate();

  const handleDuplicateCampaign = async (originalCampaign: Campaign) => {
    if (
      originalCampaign.status === "analyzing" ||
      originalCampaign.status === "rejected"
    ) {
      toast.error(t("Apenas campanhas aprovadas podem ser duplicadas."));
      return;
    }
    setIsDuplicating(true);
    try {
      const existingUniqueNames: string[] = await pb
        .collection("Campaigns")
        .getFullList({ fields: "unique_name" })
        .then((campaigns) => campaigns.map((c) => c.unique_name));

      const baseName = originalCampaign.name
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .split(/\s+/)
        .slice(0, 5)
        .join("_");

      const newUniqueName = generateUniqueName(baseName, existingUniqueNames);

      let coverFile: File | undefined = undefined;
      if (originalCampaign.cover_img && originalCampaign.collectionId) {
        const fileUrl = `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${originalCampaign.collectionId}/${originalCampaign.id}/${originalCampaign.cover_img}`;
        const res = await fetch(fileUrl);
        if (!res.ok) {
          throw new Error("Erro ao baixar a imagem de capa.");
        }
        const blob = await res.blob();
        coverFile = new File([blob], originalCampaign.cover_img as string, {
          type: blob.type,
        });
      }

      const {
        id,
        created,
        updated,
        collectionId,
        collectionName,
        ...restCampaign
      } = originalCampaign;

      const newDraftData: Partial<Campaign> = {
        ...restCampaign,
        status: "draft",
        unique_name: newUniqueName,
      };

      if (coverFile) {
        newDraftData.cover_img = coverFile;
      }

      const newCampaign = await pb.collection("Campaigns").create(newDraftData);

      navigate({
        to: "/dashboard-marca/criar-campanha",
        search: {
          campaign_id: newCampaign.id,
          is_draft: true,
          is_duplicated: true,
        },
      });
    } catch (error) {
      console.error("Erro ao duplicar campanha:", error);
      toast.error(t("Erro ao duplicar campanha"));
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <div>
      <table className="w-full bg-white rounded-t-lg border-collapse">
        <thead className="bg-[#10438F] text-white rounded-t-lg">
          <tr>
            <th className="py-3 px-4 text-left whitespace-nowrap rounded-tl-lg">
              {t("Nome")}
            </th>
            <th className="py-3 px-4 text-left whitespace-nowrap">
              {t("Objetivo")}
            </th>
            <th className="py-3 px-4 text-left whitespace-nowrap">
              {t("Inscritos")}
            </th>
            <th className="py-3 px-4 text-left whitespace-nowrap">
              {t("Aprovados")}
            </th>
            <th className="py-3 px-4 text-left whitespace-nowrap">
              {t("Início/Fim Inscrições")}
            </th>
            <th className="py-3 px-4 text-left whitespace-nowrap">
              {t("Início/Fim Campanha")}
            </th>
            <th className="py-3 px-4 text-left whitespace-nowrap">
              {t("Status")}
            </th>
            <th className="py-3 px-4 text-left whitespace-nowrap rounded-tr-lg">
              {t("Ações")}
            </th>
          </tr>
        </thead>
        <tbody className="border border-gray-200 border-t-0">
          {isLoading ? (
            <tr>
              <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                {t("Carregando campanhas...")}
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={8} className="py-4 px-4 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : campaigns.length > 0 ? (
            campaigns.map((campaign) => {
              const participations =
                campaign.expand?.Campaigns_Participations_via_campaign || [];

              const inscritos = participations.length;

              const aprovados = participations.filter(
                (p) => p.status === "approved" || p.status === "completed"
              ).length;

              return (
                <tr
                  key={campaign.id}
                  className="border-t border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (
                      campaign.status === "analyzing" ||
                      campaign.status === "rejected"
                    ) {
                      navigate({
                        to: "/dashboard/campanhas/$campaignId/status",
                        params: { campaignId: campaign.id },
                      });
                    } else {
                      navigate({
                        to: "/dashboard/campanhas/$campaignId/aprovar",
                        params: { campaignId: campaign.id },
                      });
                    }
                  }}
                >
                  <td className="py-2 px-4 font-semibold">
                    {campaign.name}
                    <br />
                    <span className="text-xs text-gray-500">
                      {format(
                        new Date(campaign.created),
                        "dd/MM/yyyy HH:mm:ss"
                      )}
                    </span>
                  </td>

                  <td className="py-2 px-4 font-semibold">
                    {campaign.objective}
                  </td>

                  <td className="py-2 px-4 font-semibold">{inscritos}</td>

                  <td className="py-2 px-4 font-semibold">{aprovados}</td>

                  <td className="py-2 px-4 font-semibold">
                    {campaign.subscription_start_date
                      ? formatDateUTC(campaign.subscription_start_date)
                      : "N/A"}{" "}
                    <span className="hidden lg:inline"> - </span>
                    <br />{" "}
                    {campaign.subscription_end_date
                      ? formatDateUTC(campaign.subscription_end_date)
                      : "N/A"}
                  </td>

                  <td className="py-2 px-4 font-semibold">
                    {campaign.beginning
                      ? formatDateUTC(campaign.beginning)
                      : "N/A"}{" "}
                    <span className="hidden lg:inline"> - </span>
                    <br /> {campaign.end ? formatDateUTC(campaign.end) : "N/A"}
                  </td>

                  <td
                    className={`py-2 px-4 font-semibold ${
                      campaign.status === "in_progress"
                        ? "text-[#28A745]"
                        : campaign.status === "ended"
                          ? "text-gray-700"
                          : ""
                    }`}
                  >
                    {campaign.status === "in_progress"
                      ? t("Em andamento")
                      : campaign.status === "ended"
                        ? t("Campanha encerrada")
                        : campaign.status === "ready"
                          ? t("Sua campanha foi aprovada! Pronta para Iniciar")
                          : campaign.status === "analyzing"
                            ? t("Em análise")
                            : campaign.status === "rejected"
                              ? t("Campanha recusada")
                              : ""}
                  </td>

                  <td
                    className="py-2 px-4 font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Button
                          variant="blue"
                          size="sm"
                          className="w-full flex items-center justify-center"
                          onClick={() => handleDuplicateCampaign(campaign)}
                        >
                          {isDuplicating ? (
                            <>
                              <Spinner className="mr-2 h-4 w-4 animate-spin" />{" "}
                              {t("Duplicando...")}
                            </>
                          ) : (
                            t("Duplicar campanha")
                          )}
                        </Button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                {t("Nenhuma campanha disponível.")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsTable;
