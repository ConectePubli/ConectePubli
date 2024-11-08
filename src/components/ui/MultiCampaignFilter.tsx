import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { Campaign } from "@/types/Campaign";
import { useCampaignStore } from "@/store/useCampaignStore";
import SocialNetworks from "@/types/SocialNetworks";

interface MultiCampaignFilterProps {
  showStatusFilter?: boolean;
  showNichoFilter?: boolean;
  showCanalFilter?: boolean;
}

export default function MultiCampaignFilter({
  showStatusFilter = false,
  showNichoFilter = false,
  showCanalFilter = false,
}: MultiCampaignFilterProps) {
  const {
    statusFilter,
    setStatusFilter,
    campaignGoalFilter,
    setCampaignGoalFilter,
    setPage,
    setSearchTerm,
    fetchCampaignNiches,
  } = useCampaignStore();

  const [nichoFilter, setNichoFilter] = useState("");
  const [canalFilter, setCanalFilter] = useState("");
  const [nicheOptions, setNicheOptions] = useState([]);
  const channelOptions = SocialNetworks.map((network) => network.name);

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    const loadNiches = async () => {
      const niches = await fetchCampaignNiches();
      setNicheOptions(niches);
    };
    loadNiches();
  }, [fetchCampaignNiches]);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Field */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="search">Pesquisar</label>
          <input
            type="text"
            id="search"
            placeholder="Pesquisar pelo nome da campanha"
            onChange={handleSearchTermChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex flex-col md:flex-row w-full gap-4">
          {/* Campaign Goal Filter */}
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="type">Categoria</label>
            <select
              id="type"
              value={campaignGoalFilter}
              onChange={(e) => {
                setCampaignGoalFilter(e.target.value as CampaignGoalFilter);
                setPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todos</option>
              <option value="ugc">UGC</option>
              <option value="influencer">Influencer</option>
            </select>
          </div>

          {/* Status Filter */}
          {showStatusFilter && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="status">Status da campanha</label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as StatusFilter);
                  setPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todos</option>
                <option value="waiting">Aguardando</option>
                <option value="approved">Aprovado</option>
                <option value="completed">Concluído</option>
                <option value="sold_out">Esgotado</option>
              </select>
            </div>
          )}

          {/* Nicho Filter */}
          {showNichoFilter && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="nicho">Nicho</label>
              <select
                id="nicho"
                value={nichoFilter}
                onChange={(e) => setNichoFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todos</option>
                {nicheOptions.map((niche) => (
                  <option key={niche.id} value={niche.id}>
                    {niche.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Canal Filter */}
          {showCanalFilter && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="canal">Canal</label>
              <select
                id="canal"
                value={canalFilter}
                onChange={(e) => setCanalFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todos</option>
                {channelOptions.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
