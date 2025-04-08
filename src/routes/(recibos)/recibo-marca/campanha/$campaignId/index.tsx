import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import pb from "@/lib/pb";
import { Campaign } from "@/types/Campaign";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { generateReceiptCompletedCampaign } from "@/utils/receipts/generateReceiptCompletedCampaign";
import { Influencer } from "@/types/Influencer";

type ParticipationWithExpand = CampaignParticipation & {
  completed_date: string;
  expand?: {
    influencer: Influencer;
  };
};

export const Route = createFileRoute(
  "/(recibos)/recibo-marca/campanha/$campaignId/"
)({
  loader: async ({ params: { campaignId } }) => {
    try {
      // Fetch campaign data
      const campaign = await pb
        .collection("Campaigns")
        .getOne<Campaign>(campaignId);

      // Fetch all completed creators for this campaign
      const completedCreators = await pb
        .collection<ParticipationWithExpand>("Campaigns_Participations")
        .getList(1, 50, {
          filter: `campaign="${campaignId}" && status="completed"`,
          expand: "influencer",
          sort: "completed_date",
        });

      if (completedCreators.items.length === 0) {
        throw new Error("Nenhum creator concluiu esta campanha ainda");
      }

      return { campaign, completedCreators };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  component: Page,
});

function Page() {
  const { campaign, completedCreators } = useLoaderData({ from: Route.id });
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const creatorsData = completedCreators.items.map(
      (participation: ParticipationWithExpand) => ({
        name: participation.expand?.influencer.name || "Creator",
        date: new Date(participation.completed_date).toLocaleDateString(
          "pt-BR"
        ),
        value: campaign.price / 100,
      })
    );

    const totalAmount = (campaign.price * completedCreators.items.length) / 100;

    const doc = generateReceiptCompletedCampaign({
      campaignName: campaign.name,
      creators: creatorsData,
      totalAmount: totalAmount,
      campaignDate: campaign.end,
    });

    doc.save(`recibo-campanha-${campaign.name}.pdf`);
    setPdfDownloaded(true);
    setLoading(false);
  }, [campaign, completedCreators]);

  const totalAmount = (campaign.price * completedCreators.items.length) / 100;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-6 h-[calc(100vh-66px)]">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">
          Recibo da Campanha
        </h1>

        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-blue-700">Campanha:</span>{" "}
            {campaign.name}
          </p>
          <p>
            <span className="font-semibold text-blue-700">
              Total de Creators:
            </span>{" "}
            {completedCreators.items.length}
          </p>
          <p>
            <span className="font-semibold text-blue-700">
              Valor Total da Campanha:
            </span>{" "}
            R${totalAmount.toFixed(2)}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">
            Creators Participantes:
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
            {completedCreators.items.map(
              (participation: ParticipationWithExpand) => (
                <div
                  key={participation.id}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                >
                  <span className="font-medium">
                    {participation.expand?.influencer.name}
                  </span>
                  <div className="text-sm text-gray-600">
                    <span className="mr-4">
                      Concluído em:{" "}
                      {new Date(
                        participation.completed_date
                      ).toLocaleDateString("pt-BR")}
                    </span>
                    <span>R${(campaign.price / 100).toFixed(2)}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {!pdfDownloaded && !loading && (
          <div className="mt-6">
            <button
              onClick={() => {
                const creatorsData = completedCreators.items.map(
                  (participation: ParticipationWithExpand) => ({
                    name: participation.expand?.influencer.name || "Creator",
                    date: new Date(
                      participation.completed_date
                    ).toLocaleDateString("pt-BR"),
                    value: campaign.price / 100,
                  })
                );

                const doc = generateReceiptCompletedCampaign({
                  campaignName: campaign.name,
                  creators: creatorsData,
                  totalAmount: totalAmount,
                  campaignDate: campaign.end,
                });
                doc.save(`recibo-campanha-${campaign.name}.pdf`);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded mt-4"
            >
              Baixar PDF novamente
            </button>
          </div>
        )}

        {loading && (
          <p className="text-gray-500 mt-6 text-sm italic">Gerando o PDF...</p>
        )}

        {pdfDownloaded && (
          <p className="text-green-600 mt-6 text-sm font-medium">
            ✅ PDF baixado automaticamente.
          </p>
        )}
      </div>
    </div>
  );
}
