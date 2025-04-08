import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import pb from "@/lib/pb";
import { Campaign } from "@/types/Campaign";
import { Influencer } from "@/types/Influencer";
import { generateReceiptCompletedCreator } from "@/utils/receipts/generateReceiptCompletedCreator";
import { CampaignParticipation } from "@/types/Campaign_Participations";

export const Route = createFileRoute(
  "/(recibos)/recibo-marca/creator/$creatorId/$campaignId/"
)({
  loader: async ({ params: { creatorId, campaignId } }) => {
    try {
      const creatorStatus = await pb
        .collection<CampaignParticipation>("Campaigns_Participations")
        .getList(1, 1, {
          filter: `campaign="${campaignId}" && influencer="${creatorId}"`,
        });

      if (creatorStatus.items[0].status !== "completed") {
        throw new Error("Creator não concluiu a campanha");
      }

      // Fetch campaign data
      const campaign = await pb
        .collection("Campaigns")
        .getOne<Campaign>(campaignId);

      // Fetch creator data
      const creator = await pb
        .collection("Influencers")
        .getOne<Influencer>(creatorId);

      return { campaign, creator, creatorStatus };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  component: Page,
});

function Page() {
  const { campaign, creator, creatorStatus } = useLoaderData({
    from: Route.id,
  });
  console.log(creatorStatus);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doc = generateReceiptCompletedCreator({
      campaignName: campaign.name,
      creatorName: creator.name,
      totalAmount: campaign.price / 100,
      completionDate: new Date(
        creatorStatus.items[0].completed_date
      ).toLocaleDateString("pt-BR"),
    });

    doc.save(`recibo-${campaign.name}-${creator.name}.pdf`);
    setPdfDownloaded(true);
    setLoading(false);
  }, [campaign, creator, creatorStatus]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-6 h-[calc(100vh-66px)]">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6 border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Recibo Gerado</h1>

        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-blue-700">Campanha:</span>{" "}
            {campaign.name}
          </p>
          <p>
            <span className="font-semibold text-blue-700">Criador(a):</span>{" "}
            {creator.name}
          </p>
          <p>
            <span className="font-semibold text-blue-700">
              Data de Conclusão:
            </span>{" "}
            {new Date(creatorStatus.items[0].completed_date).toLocaleDateString(
              "pt-BR"
            )}
          </p>
          <p>
            <span className="font-semibold text-blue-700">Valor Total:</span> R$
            {(campaign.price / 100).toFixed(2)}
          </p>
        </div>

        {!pdfDownloaded && !loading && (
          <div className="mt-6">
            <button
              onClick={() => {
                const doc = generateReceiptCompletedCreator({
                  campaignName: campaign.name,
                  creatorName: creator.name,
                  totalAmount: campaign.price / 100,
                  completionDate: new Date(
                    creatorStatus.items[0].completed_date
                  ).toLocaleDateString("pt-BR"),
                });
                doc.save(`recibo-${campaign.name}-${creator.name}.pdf`);
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
