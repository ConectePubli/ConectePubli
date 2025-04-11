import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import pb from "@/lib/pb";
import { Campaign } from "@/types/Campaign";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { Influencer } from "@/types/Influencer";
import { generateReceiptBrand } from "@/utils/receipts/generateReceiptBrandToCreator";

type ParticipationWithExpand = CampaignParticipation & {
  completed_date: string;
  expand?: {
    influencer: Influencer;
  };
};

export const Route = createFileRoute(
  "/(recibos)/recibo-creator/campanha/$campaignId/"
)({
  loader: async ({ params: { campaignId } }) => {
    const campaign = await pb
      .collection("Campaigns")
      .getOne<Campaign>(campaignId, {
        expand: "brand",
      });

    const completedCreators = await pb
      .collection<ParticipationWithExpand>("Campaigns_Participations")
      .getList(1, 50, {
        filter: `campaign="${campaignId}" && status='completed'`,
        expand: "influencer",
        sort: "completed_date",
      });

    if (completedCreators.items.length === 0) {
      throw new Error("Nenhum creator concluiu esta campanha ainda");
    }

    return { campaign, completedCreators };
  },
  component: Page,
});

function Page() {
  const { campaign, completedCreators } = useLoaderData({ from: Route.id });
  console.log(campaign);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [loading, setLoading] = useState(true);
  function getNext15th(date = new Date()): string {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1); // próximo mês
    d.setDate(15); // dia 15
    return d.toLocaleDateString("pt-BR");
  }

  useEffect(() => {
    const netValue = (campaign.price / 100) * (1 - 20 / 100);
    const doc = generateReceiptBrand({
      campaignName: campaign.name,
      brandName: (campaign.expand?.brand.name || "").slice(0, 25), // maximo de 30 caracteres
      jobValue: campaign.price / 100,
      conecteFee: 20,
      netValue,
      paymentDate: getNext15th(
        new Date(completedCreators.items[0].completed_date)
      ),
      completedDate: completedCreators.items[0].completed_date,
    });

    doc.save(`recibo-creator-${campaign.name}.pdf`);
    setPdfDownloaded(true);
    setLoading(false);
  }, [campaign, completedCreators]);

  const netValue = (campaign.price / 100) * (1 - 20 / 100);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-6 h-[calc(100vh-66px)]">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">
          Recibo do Creator
        </h1>

        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-blue-700">Campanha:</span>{" "}
            {campaign.name}
          </p>
          <p>
            <span className="font-semibold text-blue-700">
              Valor Total do Job:
            </span>{" "}
            R${(campaign.price / 100).toFixed(2)}
          </p>
          <p>
            <span className="font-semibold text-blue-700">
              Taxa da Conecte:
            </span>{" "}
            {20}%
          </p>
          <p>
            <span className="font-semibold text-blue-700">
              Valor Líquido Recebido:
            </span>{" "}
            R${netValue.toFixed(2)}
          </p>
        </div>

        {!pdfDownloaded && !loading && (
          <div className="mt-6">
            <button
              onClick={() => {
                const doc = generateReceiptBrand({
                  campaignName: campaign.name,
                  brandName: campaign.expand?.brand.name,
                  jobValue: campaign.price / 100,
                  conecteFee: 20,
                  netValue,
                  paymentDate: getNext15th(
                    new Date(completedCreators.items[0].completed_date)
                  ),
                  completedDate: completedCreators.items[0].completed_date,
                });
                doc.save(`recibo-creator-${campaign.name}.pdf`);
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
