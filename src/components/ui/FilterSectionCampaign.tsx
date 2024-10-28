import React, { useCallback } from "react";
import { List, Search, ChevronDown } from "lucide-react";
import { useCampaignStore } from "@/store/useCampaignStore";
import { CampaignGoalFilter, StatusFilter } from "@/types/Filters";
import debounce from "lodash.debounce";

const FilterSectionCampaign: React.FC = () => {
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
    <div className="pt-4 pb-5 px-6 bg-gray-100 rounded-lg mx-auto border border-gray-400 mt-5">
      <div className="flex items-center space-x-2">
        <List color="#10438F" />
        <h2 className="text-lg font-bold justify-center">Filtro</h2>
      </div>

      <div className="mt-4 space-y-4 lg:space-y-0 lg:flex lg:space-x-4">
        {/* Campo de Pesquisa */}
        <div className="relative w-full lg:flex-[4]">
          <label htmlFor="campaignSearch" className="sr-only">
            Pesquisar pelo nome da campanha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-black" />
            </div>
            <input
              id="campaignSearch"
              type="text"
              placeholder="Pesquisar pelo nome da campanha"
              onChange={handleSearchTermChange}
              className="w-full pl-10 p-3 py-3 border border-black rounded-lg"
            />
          </div>
        </div>

        <div className="relative w-full lg:flex-[2]">
          <label htmlFor="campaignGoal" className="sr-only">
            Objetivo da campanha
          </label>
          <select
            id="campaignGoal"
            value={campaignGoalFilter}
            onChange={(e) =>
              setCampaignGoalFilter(e.target.value as CampaignGoalFilter)
            }
            className="w-full p-3 py-3 border border-black rounded-lg appearance-none"
          >
            <option value={CampaignGoalFilter.All}>Objetivo da campanha</option>
            <option value={CampaignGoalFilter.UGC}>UGC</option>
            <option value={CampaignGoalFilter.Influenciador}>
              Influenciador
            </option>
          </select>
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-5 w-5 text-black" />
          </span>
        </div>

        <div className="relative w-full lg:flex-[1]">
          <label htmlFor="status" className="sr-only">
            Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="w-full p-3 py-3 border border-black rounded-lg appearance-none"
          >
            <option value={StatusFilter.All}>Status</option>
            <option value={StatusFilter.Completed}>Encerrado</option>
            <option value={StatusFilter.In_Progress}>Em andamento</option>
            <option value={StatusFilter.Ready}>Pronto para iniciar</option>
          </select>
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-5 w-5 text-black" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterSectionCampaign;
