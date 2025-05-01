import React, { useCallback } from "react";
import { Search } from "lucide-react";
import { useCampaignStore } from "@/store/useCampaignStore";
import {
  CampaignGoalFilter,
  StatusFilter,
  ChannelFilter,
  ParticipationStatusFilter,
  NicheFilterType,
  ChannelFilterType,
  NicheFilter,
} from "@/types/Filters";
import debounce from "lodash.debounce";
import SocialNetworks from "@/types/SocialNetworks";
import { useTranslation } from "react-i18next";

interface BrandCampaignFilterProps {
  showSearch?: boolean;
  showCampaignGoal?: boolean;
  showStatus?: boolean;
  showParticipationStatus?: boolean;
  showNiche?: boolean;
  showChannel?: boolean;
}

const BrandCampaignFilter: React.FC<BrandCampaignFilterProps> = ({
  showSearch = false,
  showCampaignGoal = false,
  showStatus = false,
  showParticipationStatus = false,
  showNiche = false,
  showChannel = false,
}) => {
  const { t } = useTranslation();
  const {
    statusFilter,
    setStatusFilter,
    campaignGoalFilter,
    setCampaignGoalFilter,
    participationStatusFilter,
    setParticipationStatusFilter,
    setPage,
    setSearchTerm,
    nicheFilter,
    setNicheFilter,
    channelFilter,
    setChannelFilter,
  } = useCampaignStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(1);
    }, 500),
    [setSearchTerm, setPage]
  );

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  return (
    <div className="mb-6 mt-4">
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        {/* Conditionally render each field based on props */}

        {/* Search Field */}
        {showSearch && (
          <div className="w-full flex flex-col flex-wrap gap-2">
            <label htmlFor="campaignSearch">{t("Pesquisar")}</label>
            <div className="relative z-0">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-black" />
              </div>
              <input
                id="campaignSearch"
                type="text"
                placeholder={t("Pesquisar pelo nome da campanha")}
                onChange={handleSearchTermChange}
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="w-full flex gap-4 items-end">
          {/* Campaign Goal Filter */}
          {showCampaignGoal && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="campaignGoal">{t("Objetivo").toString()}</label>
              <select
                id="campaignGoal"
                value={campaignGoalFilter}
                onChange={(e) => {
                  setCampaignGoalFilter(e.target.value as CampaignGoalFilter);
                  setPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value={CampaignGoalFilter.All}>{t("Todos")}</option>
                <option value={CampaignGoalFilter.UGC}>UGC</option>
                <option value={CampaignGoalFilter.IGC}>IGC</option>
                <option value={CampaignGoalFilter.Both}>UGC + IGC</option>
              </select>
            </div>
          )}

          {/* Status Filter */}
          {showStatus && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as StatusFilter);
                  setPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value={StatusFilter.All}>{t("Todos")}</option>
                <option value={StatusFilter.Completed}>
                  {t("Campanha encerrada")}
                </option>
                <option value={StatusFilter.In_Progress}>
                  {t("Em andamento")}
                </option>
                <option value={StatusFilter.Ready}>
                  {t("Pronto para iniciar")}
                </option>
              </select>
            </div>
          )}

          {/* Participation Status Filter */}
          {showParticipationStatus && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="participacao">{t("Participação")}</label>
              <select
                id="participacao"
                value={participationStatusFilter}
                onChange={(e) => {
                  setParticipationStatusFilter(
                    e.target.value as ParticipationStatusFilter
                  );
                  setPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value={ParticipationStatusFilter.All}>
                  {t("Todos")}
                </option>
                <option value={ParticipationStatusFilter.Completed}>
                  {t("Trabalho Concluido")}
                </option>
                <option value={ParticipationStatusFilter.Approved}>
                  {t("Trabalho em Progresso")}
                </option>
                <option value={ParticipationStatusFilter.Waiting}>
                  {t("Proposta Pendente")}
                </option>
                <option value={ParticipationStatusFilter.Sold_out}>
                  {t("Vagas Esgotadas")}
                </option>
                <option value={ParticipationStatusFilter.Canceled}>
                  {t("Cancelado")}
                </option>
              </select>
            </div>
          )}

          {/* Nicho Filter */}
          {showNiche && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="niche">{t("Nicho")}</label>
              <select
                id="niche"
                value={nicheFilter}
                onChange={(e) => {
                  setNicheFilter(e.target.value as NicheFilterType);
                  setPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {Object.entries(NicheFilter).map(([key, value]) => (
                  <option key={key} value={key}>
                    {t(value) || t("Todos")}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Canal Filter */}
          {showChannel && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="channels">{t("Canal")}</label>
              <select
                id="channels"
                value={channelFilter}
                onChange={(e) => {
                  setChannelFilter(e.target.value as ChannelFilterType);
                  setPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value={ChannelFilter.All}>{t("Todos")}</option>
                {SocialNetworks.map((network) => (
                  <option key={network.name} value={network.name}>
                    {network.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandCampaignFilter;
