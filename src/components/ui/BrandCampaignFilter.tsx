import React, { useCallback } from "react";
import { Search } from "lucide-react";
import { useCampaignStore } from "@/store/useCampaignStore";
import { CampaignGoalFilter, StatusFilter } from "@/types/Filters";
import debounce from "lodash.debounce";

const BrandCampaignFilter: React.FC = () => {
  const {
    statusFilter,
    setStatusFilter,
    campaignGoalFilter,
    setCampaignGoalFilter,
    setPage,
    setSearchTerm,
  } = useCampaignStore();

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(1);
    }, 500),
    []
  );

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  return (
    <div className="mb-6 mt-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Search Field */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="campaignSearch" className="">
            Pesquisar
          </label>
          <div className="relative z-0">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-black" />
            </div>
            <input
              id="campaignSearch"
              type="text"
              placeholder="Pesquisar pelo nome da campanha"
              onChange={handleSearchTermChange}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Campaign Goal Filter */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="campaignGoal" className="">
            Objetivo da campanha
          </label>

          <select
            id="campaignGoal"
            value={campaignGoalFilter}
            onChange={(e) => {
              setCampaignGoalFilter(e.target.value as CampaignGoalFilter);
              setPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value={CampaignGoalFilter.All}>Todos</option>
            <option value={CampaignGoalFilter.UGC}>UGC</option>
            <option value={CampaignGoalFilter.Influencer}>Influencer</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="status" className="">
            Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter);
              setPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value={StatusFilter.All}>Todos</option>
            <option value={StatusFilter.Completed}>Encerrado</option>
            <option value={StatusFilter.In_Progress}>Em andamento</option>
            <option value={StatusFilter.Ready}>Pronto para iniciar</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BrandCampaignFilter;
