import { useCampaignStore } from "@/store/useCampaignStore";
import { format } from "date-fns";
import { useNavigate } from "@tanstack/react-router";
import { formatDateUTC } from "@/utils/formatDateUTC";

const CampaignsTable: React.FC = () => {
  const { campaigns, isLoading, error } = useCampaignStore();

  const navigate = useNavigate();

  return (
    <div>
      <table className="w-full bg-white rounded-t-lg border-collapse">
        <thead className="bg-[#10438F] text-white rounded-t-lg">
          <tr>
            <th className="py-3 px-4 text-left whitespace-nowrap rounded-tl-lg">
              Nome
            </th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Objetivo</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Inscritos</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Aprovados</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">
              Início/Fim
            </th>
            <th className="py-3 px-4 text-left whitespace-nowrap rounded-tr-lg">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="border border-gray-200 border-t-0">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                Carregando campanhas...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={7} className="py-4 px-4 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : campaigns.length > 0 ? (
            campaigns.map((campaign) => {
              const participations =
                campaign.expand?.Campaigns_Participations_via_campaign || [];

              const inscritos = participations.length; // Quantidade de inscritos

              const aprovados = participations.filter(
                (p) => p.status === "approved" || p.status === "completed"
              ).length; // Quantidade de aprovados

              return (
                <tr
                  key={campaign.id}
                  className="border-t border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    navigate({
                      to: "/dashboard/campanhas/$campaignId/aprovar",
                      params: { campaignId: campaign.id },
                    })
                  }
                >
                  <td className="py-2 px-4 font-semibold">
                    {campaign.name}
                    <br />
                    <span className="text-xs text-gray-500">
                      {format(
                        new Date(campaign.created),
                        "dd/MM/yyyy HH:mm:ss"
                      )}
                    </span>
                  </td>

                  <td className="py-2 px-4 font-semibold">
                    {campaign.objective}
                  </td>

                  <td className="py-2 px-4 font-semibold">{inscritos}</td>

                  <td className="py-2 px-4 font-semibold">{aprovados}</td>

                  <td className="py-2 px-4 font-semibold">
                    {campaign.beginning
                      ? formatDateUTC(campaign.beginning)
                      : "N/A"}{" "}
                    <span className="hidden lg:inline"> - </span>
                    <br /> {campaign.end ? formatDateUTC(campaign.end) : "N/A"}
                  </td>

                  <td
                    className={`py-2 px-4 font-semibold ${
                      campaign.status === "in_progress"
                        ? "text-[#28A745]"
                        : campaign.status === "ended"
                          ? "text-gray-700"
                          : ""
                    }`}
                  >
                    Status:{" "}
                    {campaign.status === "in_progress"
                      ? "Em andamento"
                      : campaign.status === "ended"
                        ? "Encerrado"
                        : campaign.status === "ready"
                          ? "Pronto para iniciar"
                          : ""}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                Nenhuma campanha disponível.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsTable;
