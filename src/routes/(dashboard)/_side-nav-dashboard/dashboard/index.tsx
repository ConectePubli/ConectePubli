import { useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticatedBrands, isAuthenticatedInfluencer } from "@/lib/auth";
import { Campaign } from "@/types/Campaign";
import CampaignCard from "@/components/ui/CampaignCard";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/"
)({
  component: Page,
  beforeLoad: async () => {
    const isBrandAuth = await isAuthenticatedBrands();
    const isInfluencerAuth = await isAuthenticatedInfluencer();

    if (!isBrandAuth && !isInfluencerAuth) {
      throw redirect({
        to: "/login123new",
      });
    }
  },
});

const campaignsData: Campaign[] = [
  {
    id: 1,
    title: "Friends of Scouting - Donor Support",
    time: "32 Minutos atrás",
    description:
      "Kimberley Jules é uma influenciadora do Instagram, conhecida por seu conteúdo único e relacionável.",
    price: "R$425,00/pessoa",
    vacancies: 4,
    status: "Concluído",
    statusColor: "text-green-500",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?fit=crop&w=800&q=80",
    date: "01/01/2022 - 02/02/2022",
  },
  {
    id: 2,
    title: "New Brand Awareness Campaign",
    time: "2 Horas atrás",
    description:
      "Uma campanha focada em aumentar a conscientização da marca em novos mercados.",
    price: "R$300,00/pessoa",
    vacancies: 2,
    status: "Aberto",
    statusColor: "text-blue-500",
    image:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?fit=crop&w=800&q=80",
    date: "15/02/2022 - 30/03/2022",
  },
];

function Page() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredCampaigns = campaignsData.filter((campaign) => {
    const matchesSearch = campaign.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "" || campaign.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto py-6">
      <h1 className="text-2xl font-bold mb-2">Minhas Participações</h1>
      <p className="text-gray-700 mb-6">
        Acompanhe todas as campanhas nas quais você se inscreveu e gerencie suas
        participações.
      </p>

      <div className="flex gap-4 mb-6">
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

        <div className="w-1/3">
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
            <option value="concluído">Concluído</option>
            <option value="aberto">Aberto</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}

export default Page;
