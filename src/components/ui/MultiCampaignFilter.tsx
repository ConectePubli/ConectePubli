import { useState, useEffect } from 'react'
import { Campaign } from '@/types/Campaign'

interface MultiCampaignFilterProps {
  campaigns: Campaign[]
  onFilter: (filteredCampaigns: Campaign[]) => void
  showStatusFilter?: boolean // Controls visibility of status filter
  showNichoFilter?: boolean  // Controls visibility of nicho filter
  showCanalFilter?: boolean  // Controls visibility of canal filter
}

export default function MultiCampaignFilter({
  campaigns,
  onFilter,
  showStatusFilter = false,
  showNichoFilter = false,
  showCanalFilter = false,
}: MultiCampaignFilterProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [nichoFilter, setNichoFilter] = useState('')
  const [canalFilter, setCanalFilter] = useState('')

  useEffect(() => {
    const filteredCampaigns = campaigns.filter((campaign) => {
      const matchesSearch = campaign.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        !showStatusFilter || statusFilter === '' || campaign.participantStatus === statusFilter;
      const matchesType =
        typeFilter === '' || campaign.objective?.toLowerCase() === typeFilter;
      const matchesNicho =
        nichoFilter === '' || campaign.nicho?.toLowerCase().includes(nichoFilter.toLowerCase());
      const matchesCanal =
        canalFilter === '' || campaign.canal?.toLowerCase().includes(canalFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesType && matchesNicho && matchesCanal;
    });

    onFilter(filteredCampaigns);
  }, [
    search,
    statusFilter,
    typeFilter,
    nichoFilter,
    canalFilter,
    campaigns,
    onFilter,
    showStatusFilter,
  ]);

  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="search" className="">
            Pesquisar
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar pelo nome da campanha"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex flex-col md:flex-row w-full gap-4">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="type" className="">
              Categoria
            </label>
            <select
              id="type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todos</option>
              <option value="ugc">UGC</option>
              <option value="influencer">Influencer</option>
            </select>
          </div>

          {/* Conditionally render status filter */}
          {showStatusFilter && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="status" className="">
                Status da campanha
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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

          {/* Conditionally render nicho filter */}
          {showNichoFilter && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="nicho" className="">
                Nicho
              </label>
              <input
                type="text"
                id="nicho"
                value={nichoFilter}
                onChange={(e) => setNichoFilter(e.target.value)}
                placeholder="Filtrar por Nicho"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          {/* Conditionally render canal filter */}
          {showCanalFilter && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="canal" className="">
                Canal
              </label>
              <input
                type="text"
                id="canal"
                value={canalFilter}
                onChange={(e) => setCanalFilter(e.target.value)}
                placeholder="Filtrar por Canal"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
