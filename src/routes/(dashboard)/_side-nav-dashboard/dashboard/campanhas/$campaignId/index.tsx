import { createFileRoute, useMatch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// Simulação de uma função que busca os dados da campanha a partir do ID
async function fetchCampaignData(campaignId: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: campaignId,
        name: "Campanha Exemplo",
        description: "Esta é uma descrição detalhada da campanha exemplo.",
        status: "Ativa",
        createdAt: "2023-09-01",
      });
    }, 1000);
  });
}

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/"
)({
  component: CampaignPage,
});

function CampaignPage() {
  const {
    params: { campaignId },
  } = useMatch({
    from: "/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/",
  });

  const [campaignData, setCampaignData] = useState<null | {
    id: string;
    name: string;
    description: string;
    status: string;
    createdAt: string;
  }>(null);

  useEffect(() => {
    const loadCampaignData = async () => {
      const data = (await fetchCampaignData(campaignId)) as {
        id: string;
        name: string;
        description: string;
        status: string;
        createdAt: string;
      };
      setCampaignData(data);
    };

    loadCampaignData();
  }, [campaignId]);

  if (!campaignData) {
    return <div>Carregando dados da campanha...</div>;
  }

  return (
    <div>
      <h1>Campanha: {campaignData.name}</h1>
      <p>{campaignData.description}</p>
      <p>Status: {campaignData.status}</p>
      <p>Criada em: {campaignData.createdAt}</p>
    </div>
  );
}
