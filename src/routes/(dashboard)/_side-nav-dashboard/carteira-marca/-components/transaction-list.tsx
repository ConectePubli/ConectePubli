import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { TransactionStatus } from "./transaction-history";
import { useEffect, useState } from "react";
import pb from "@/lib/pb";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

interface TransactionListProps {
  status: TransactionStatus;
}

interface CampaignParticipation {
  id: string;
  status: string;
  completed_date?: string;
  approved_date?: string;
  conecte_paid_status?: "PAID" | "NOT_PAID";
  conecte_paid_date?: string;
  expand?: {
    campaign?: {
      name: string;
      price: number;
      unique_name: string;
    };
    influencer?: {
      name: string;
    };
    brand?: {
      name: string;
    };
  };
}

export function TransactionList({ status }: TransactionListProps) {
  const [transactions, setTransactions] = useState<CampaignParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const brandId = pb.authStore.model?.id;
        if (!brandId) return;

        let filter = "";
        if (status === "Concluido") {
          filter = `campaign.brand="${brandId}" && status="completed"`;
        } else if (status === "Devolvido") {
          filter = `campaign.brand="${brandId}" && status="canceled"`;
        } else if (status === "Pago") {
          filter = `campaign.brand="${brandId}" && status="approved"`;
        }

        const result = await pb
          .collection("Campaigns_Participations")
          .getFullList<CampaignParticipation>({
            filter,
            expand: "campaign,brand,influencer",
            sort: "-created",
          });

        setTransactions(result);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoading(false);
      }
    }

    if (["Concluido", "Devolvido", "Pago"].includes(status)) {
      fetchTransactions();
    }
  }, [status]);

  const calculatePaymentDate = (completedDate: string) => {
    const date = new Date(completedDate);
    date.setMonth(date.getMonth() + 1);
    date.setDate(15);
    return date.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleCardClick = (uniqueName: string) => {
    navigate({ to: `/dashboard/campanhas/${uniqueName}` });
  };

  const statusMessages = {
    Reservado: t(
      "A marca aceitou o trabalho, aguardando liberação de pagamento."
    ),
    Liberado: t("Conteúdo entregue e aprovado pela marca."),
    Pago: t("Creator aprovado na campanha."),
    Cancelado: t("Conteúdo não entregue no prazo, pagamento cancelado."),
  };

  const mensagemStatus =
    statusMessages[status as keyof typeof statusMessages] || "";

  if (loading && ["Concluido", "Devolvido", "Pago"].includes(status)) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        {t("Carregando transações...")}
      </div>
    );
  }

  if (["Concluido", "Devolvido", "Pago"].includes(status)) {
    if (transactions.length === 0) {
      return (
        <div className="flex justify-center items-center p-8 text-gray-500">
          {t("Nenhuma transação encontrada")}
        </div>
      );
    }

    return (
      <div className="space-y-4 py-4 px-4 md:px-10">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4 ${
              status === "Devolvido" ? "cursor-pointer hover:bg-gray-50" : ""
            }`}
            onClick={() => {
              if (
                status === "Devolvido" &&
                transaction.expand?.campaign?.unique_name
              ) {
                handleCardClick(transaction.expand.campaign.unique_name);
              }
            }}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">
                {status === "Devolvido" ? (
                  <ArrowDownIcon className="w-6 h-6 text-red-600" />
                ) : (
                  <ArrowUpIcon className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {transaction.expand?.campaign?.name || "Campanha sem nome"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {transaction.expand?.influencer?.name ||
                    "Influencer sem nome"}
                </p>
                <p className="text-sm text-gray-500">{mensagemStatus}</p>
                {status === "Concluido" &&
                transaction.conecte_paid_status === "PAID" &&
                transaction.status === "completed" ? (
                  <p className="text-sm text-blue-700 mt-1">
                    {t("Pagamento realizado pela Conecte")}
                  </p>
                ) : transaction.status === "approved" ? null : (
                  <p className="text-sm text-orange-500 mt-1">
                    {t("Pagamento pendente")}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 md:ml-auto">
              <p
                className={`font-medium whitespace-nowrap ${
                  status === "Devolvido" ? "text-red-500" : "text-green-500"
                }`}
              >
                {status === "Devolvido" ? "-" : "+"}{" "}
                {formatCurrency(
                  (transaction.expand?.campaign?.price || 0) / 100
                )}
              </p>
              {status === "Pago" && transaction.approved_date && (
                <p className="text-sm text-gray-500 whitespace-nowrap">
                  {t("Pagamento para a Conecte em")}{" "}
                  {calculatePaymentDate(transaction.approved_date)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
