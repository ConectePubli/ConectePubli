import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import CampaignCard from "@/components/ui/CampaignCard";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { Campaign } from "@/types/Campaign";
import pb from "@/lib/pb";
import { UserAuth } from "@/types/UserAuth";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-influencer/"
)({
  component: Page,
});

function Page() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [campaigns, setCampaigns] = useState<CampaignParticipation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCampaignParticipations = async () => {
    setIsLoading(true);
    const user: UserAuth = JSON.parse(
      localStorage.getItem("pocketbase_auth") as string
    );

    const records = await pb
      .collection("Campaigns_Participations")
      .getFullList<CampaignParticipation>({
        filter: `Influencer="${user.model.id}"`,
        expand: "Campaign,Influencer",
      });

    setCampaigns(records);
    setIsLoading(false);
  };

  const { mutate: getCampaigns } = useMutation({
    mutationFn: async () => {
      await fetchCampaignParticipations();
    },
    onError: () => {
      setCampaigns([]);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    getCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCampaigns = campaigns.filter((participation) => {
    const campaign = participation.expand.Campaign as Campaign;
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "" || participation.status === statusFilter;
    const matchesType =
      typeFilter === "" || campaign.genre?.toLowerCase() === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const noDataMessage =
    !isLoading && filteredCampaigns.length === 0
      ? "Nenhum resultado encontrado para o filtro selecionado."
      : null;

  const noCampaignsMessage =
    !isLoading && campaigns.length === 0
      ? "Você ainda não está participando de nenhuma campanha."
      : null;

  return (
    <div className="mx-auto py-6">
      <h1 className="text-2xl font-bold mb-2">Minhas Participações</h1>
      <p className="text-gray-700 mb-6">
        Acompanhe todas as campanhas nas quais você se inscreveu e gerencie suas
        participações.
      </p>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex gap-4">
          <div className="w-1/2">
            <label htmlFor="search" className="sr-only">
              Pesquisar pelo nome da campanha
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

          <div className="w-1/4">
            <label htmlFor="type" className="sr-only">
              Categoria
            </label>
            <select
              id="type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Categoria</option>
              <option value="ugc">UGC</option>
              <option value="influencer">Influencer</option>
            </select>
          </div>

          <div className="w-1/4">
            <label htmlFor="status" className="sr-only">
              Status da campanha
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Status da campanha</option>
              <option value="waiting">Em espera</option>
              <option value="approved">Aprovado</option>
              <option value="completed">Concluído</option>
              <option value="sold_out">Esgotado</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {noDataMessage || noCampaignsMessage ? (
            <p>{noDataMessage || noCampaignsMessage}</p>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((participation) => (
                <CampaignCard
                  key={participation.id}
                  campaign={participation.expand.Campaign}
                  participationStatus={participation.status}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Page;
