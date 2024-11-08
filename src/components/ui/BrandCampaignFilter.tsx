import React, { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useCampaignStore } from "@/store/useCampaignStore";
import {
  CampaignGoalFilter,
  StatusFilter,
  ChannelFilter,
  NicheFilter,
} from "@/types/Filters";
import debounce from "lodash.debounce";
import SocialNetworks from "@/types/SocialNetworks";

interface BrandCampaignFilterProps {
  showSearch?: boolean;
  showCampaignGoal?: boolean;
  showStatus?: boolean;
  showNiche?: boolean;
  showChannel?: boolean;
}

const BrandCampaignFilter: React.FC<BrandCampaignFilterProps> = ({
  showSearch = false,
  showCampaignGoal = false,
  showStatus = false,
  showNiche = false,
  showChannel = false,
}) => {
  const {
    statusFilter,
    setStatusFilter,
    campaignGoalFilter,
    setCampaignGoalFilter,
    setPage,
    setSearchTerm,
    nicheFilter,
    setNicheFilter,
    channelFilter,
    setChannelFilter,
    fetchCampaignNiches,
  } = useCampaignStore();

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(1);
    }, 500),
    [],
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
            <label htmlFor="campaignSearch">Pesquisar</label>
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
        )}

        <div className="w-full flex gap-4 items-end">
          {/* Campaign Goal Filter */}
          {showCampaignGoal && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="campaignGoal">Objetivo</label>
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
                <option value={CampaignGoalFilter.Influencer}>
                  Influencer
                </option>
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
                <option value={StatusFilter.All}>Todos</option>
                <option value={StatusFilter.Completed}>Encerrado</option>
                <option value={StatusFilter.In_Progress}>Em andamento</option>
                <option value={StatusFilter.Ready}>Pronto para iniciar</option>
              </select>
            </div>
          )}

          {/* Nicho Filter */}
          {showNiche && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="niche">Nicho</label>
              <select
                id="niche"
                value={nicheFilter}
                onChange={(e) => {
                  setNicheFilter(e.target.value as NicheFilterType);
                  setPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todos</option>
                <option value="wbjwvgn35jl2iu9">
                  Alimentação Saudável e Nutrição
                </option>
                <option value="a0ncq9dg4v7cmz9">Arte e Cultura</option>
                <option value="lpm6yrf4urto14w">Automóveis e Carros</option>
                <option value="9q6bw2i19giyiia">Beleza e Maquiagem</option>
                <option value="hdsi00boer6d5mg">Casamento e Eventos</option>
                <option value="ivmu1hp099n1h9u">Culinária e Receitas</option>
                <option value="izdgizoz6er5pxw">
                  Decoração e Design de Interiores
                </option>
                <option value="ijuid0vqlv5qxp4">DIY e Faça Você Mesmo</option>
                <option value="hg741zthi1gqi81">Educação e Aprendizagem</option>
                <option value="g6hyiz45wc2qlug">
                  Empreendedorismo e Negócios
                </option>
                <option value="awhq9yfj4xz05rn">Esportes e Atletismo</option>
                <option value="g9srav9129qfgfy">Filmes e Séries</option>
                <option value="g7kz8f7rbr7zts2">
                  Finanças e Investimentos
                </option>
                <option value="2zoquwxqy7hujmz">Fitness e Bem-Estar</option>
                <option value="y8gr468eaznraf8">
                  Fotografia e Edição de Imagens
                </option>
                <option value="48057ll34wtwq9c">
                  Gaming e Jogos Eletrônicos
                </option>
                <option value="5lhtvf2pc0hd7lb">Gastronomia</option>
                <option value="4vjhn1xc0p2tcw8">Hobbies e Passatempos</option>
                <option value="c4nat015oqec63e">LGBTQ+ e Diversidade</option>
                <option value="f7jk3s1zd5aguh9">Livros e Literatura</option>
                <option value="4js8of340uvwypw">
                  Marcas Sustentáveis e Éticas
                </option>
                <option value="ytiegnssolpy33l">
                  Maternidade e Paternidade
                </option>
                <option value="nyapordvvgyy0wz">Moda e Estilo</option>
                <option value="o81rnpf652vh1d5">Moda Feminina</option>
                <option value="gh5eezcgkees7sx">Moda Masculina</option>
                <option value="1s6wx04ogodlxru">Música e Entretenimento</option>
                <option value="llwiy0i4s0mex1o">Pet Lovers</option>
                <option value="od62mqfr5b0t60u">
                  Saúde Mental e Bem-Estar emocional
                </option>
                <option value="i43dbddebc57fit">
                  Sustentabilidade e Meio Ambiente
                </option>
                <option value="57bppfj91zexo6n">
                  Tecnologia e Eletrônicos
                </option>
                <option value="jhpjpepuyull7x2">Viagens e Turismo</option>
              </select>
            </div>
          )}

          {/* Canal Filter */}
          {showChannel && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="channels">Canal</label>
              <select
                id="channels"
                value={channelFilter}
                onChange={(e) => {
                  setChannelFilter(e.target.value as ChannelFilterType);
                  setPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value={ChannelFilter.All}>Todos</option>
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
