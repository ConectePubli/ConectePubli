import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Transaction, TransactionStatus } from "./TransactionHistory";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import pb from "@/lib/pb";
import { useNavigate } from "@tanstack/react-router";
import money from "@/assets/wallet/money.png";
import down from "@/assets/wallet/down.png";
import wallet from "@/assets/wallet/wallet.png";

interface TransactionListProps {
  status: TransactionStatus;
}

interface CampaignParticipation {
  id: string;
  status: string;
  completed_date?: string;
  conecte_paid_status?: "PAID" | "NOT_PAID";
  expand?: {
    campaign?: {
      name: string;
      price: number;
      unique_name: string;
    };
    brand?: {
      name: string;
    };
  };
}

interface MonthOption {
  value: string;
  label: string;
}

export function TransactionList({ status }: TransactionListProps) {
  const [transactions, setTransactions] = useState<CampaignParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const navigate = useNavigate();

  // Gerar lista de meses para o dropdown (Janeiro a Dezembro)
  const monthOptions = useMemo(() => {
    const options: MonthOption[] = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Gerar opções para todos os meses de Janeiro a Dezembro
    for (let month = 0; month < 12; month++) {
      // Se o mês for depois do mês atual, use o ano anterior
      const year = month > currentMonth ? currentYear - 1 : currentYear;
      const date = new Date(year, month, 1);

      const value = `${date.getFullYear()}-${String(month + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      options.push({
        value,
        label: label.charAt(0).toUpperCase() + label.slice(1),
      });
    }

    return options;
  }, []);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const influencerId = pb.authStore.model?.id;
        if (!influencerId) return;

        let filter = "";
        if (status === "Reservado") {
          filter = `influencer="${influencerId}" && status="approved"`;
        } else if (status === "Liberado") {
          filter = `influencer="${influencerId}" && status="completed" && conecte_paid_status!="PAID"`;
        } else if (status === "Pago") {
          filter = `influencer="${influencerId}" && conecte_paid_status="PAID"`;
        } else if (status === "Cancelado") {
          filter = `influencer="${influencerId}" && status="canceled"`;
        } else if (status === "Extrato") {
          const [year, month] = selectedMonth.split("-");
          const startDate = new Date(
            Number(year),
            Number(month) - 1,
            1
          ).toISOString();
          const endDate = new Date(
            Number(year),
            Number(month),
            0
          ).toISOString();

          filter = `influencer="${influencerId}" && conecte_paid_status="PAID" && completed_date >= "${startDate}" && completed_date <= "${endDate}"`;
        }

        const result = await pb
          .collection("Campaigns_Participations")
          .getList<CampaignParticipation>(1, 50, {
            filter,
            expand: "campaign,brand",
            sort: "-created",
          });

        setTransactions(result.items);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoading(false);
      }
    }

    if (
      ["Reservado", "Liberado", "Pago", "Cancelado", "Extrato"].includes(status)
    ) {
      fetchTransactions();
    }
  }, [status, selectedMonth]);

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

  if (status === "Extrato") {
    return (
      <div className="space-y-6 p-10">
        <div className="flex items-center gap-4">
          <label
            htmlFor="month-select"
            className="text-sm font-medium text-gray-700"
          >
            Filtrar por mês:
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8 text-gray-500">
            Carregando transações...
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex justify-center items-center p-8 text-gray-500">
            Nenhuma transação encontrada para este mês
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transactions.map((transaction) => {
              const valorBruto =
                (transaction.expand?.campaign?.price || 0) / 100;
              const taxaConecte = valorBruto * 0.2;
              const valorLiquido = valorBruto - taxaConecte;

              return (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {transaction.expand?.campaign?.name ||
                        "Campanha sem nome"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.completed_date
                        ? new Date(
                            transaction.completed_date
                          ).toLocaleDateString("pt-BR")
                        : ""}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={money}
                          alt="Valor Total"
                          className="w-6 h-6"
                        />
                        <span className="text-sm text-gray-500">
                          Valor Total
                        </span>
                      </div>
                      <p className="font-medium text-gray-900">
                        + {formatCurrency(valorBruto)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={down}
                          alt="Taxa Conecte"
                          className="w-6 h-6"
                        />
                        <span className="text-sm text-gray-500">
                          Taxa Conecte (20%)
                        </span>
                      </div>
                      <p className="font-medium text-red-500">
                        - {formatCurrency(taxaConecte)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={wallet}
                          alt="Valor Recebido"
                          className="w-6 h-6"
                        />
                        <span className="text-sm text-gray-500">
                          Valor Recebido
                        </span>
                      </div>
                      <p className="font-medium text-green-500">
                        = {formatCurrency(valorLiquido)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (
    loading &&
    ["Reservado", "Liberado", "Pago", "Cancelado", "Extrato"].includes(status)
  ) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        Carregando transações...
      </div>
    );
  }

  if (status === "Extrato") {
    if (transactions.length === 0) {
      return (
        <div className="flex justify-center items-center p-8 text-gray-500">
          Nenhuma transação encontrada
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-10">
        {transactions.map((transaction) => {
          const valorBruto = (transaction.expand?.campaign?.price || 0) / 100;
          const taxaConecte = valorBruto * 0.2;
          const valorLiquido = valorBruto - taxaConecte;

          return (
            <div
              key={transaction.id}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {transaction.expand?.campaign?.name || "Campanha sem nome"}
                </p>
                <p className="text-sm text-gray-500">
                  {transaction.completed_date
                    ? new Date(transaction.completed_date).toLocaleDateString(
                        "pt-BR"
                      )
                    : ""}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/wallet/money-bag.png"
                      alt="Valor Total"
                      className="w-6 h-6"
                    />
                    <span className="text-sm text-gray-500">Valor Total</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    + {formatCurrency(valorBruto)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/wallet/arrow-down-red.png"
                      alt="Taxa Conecte"
                      className="w-6 h-6"
                    />
                    <span className="text-sm text-gray-500">
                      Taxa Conecte (20%)
                    </span>
                  </div>
                  <p className="font-medium text-red-500">
                    - {formatCurrency(taxaConecte)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/wallet/check-circle.png"
                      alt="Valor Recebido"
                      className="w-6 h-6"
                    />
                    <span className="text-sm text-gray-500">
                      Valor Recebido
                    </span>
                  </div>
                  <p className="font-medium text-green-500">
                    = {formatCurrency(valorLiquido)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (["Reservado", "Liberado", "Pago", "Cancelado"].includes(status)) {
    if (transactions.length === 0) {
      return (
        <div className="flex justify-center items-center p-8 text-gray-500">
          Nenhuma transação encontrada
        </div>
      );
    }

    return (
      <div className="space-y-4 py-4 px-10">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`flex items-center justify-between p-4 border rounded-lg ${
              status === "Cancelado" ? "cursor-pointer hover:bg-gray-50" : ""
            }`}
            onClick={() => {
              if (
                status === "Cancelado" &&
                transaction.expand?.campaign?.unique_name
              ) {
                handleCardClick(transaction.expand.campaign.unique_name);
              }
            }}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-full">
                {status === "Cancelado" ? (
                  <ArrowDownIcon className="w-6 h-6 text-red-600" />
                ) : (
                  <ArrowUpIcon className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {transaction.expand?.campaign?.name || "Campanha sem nome"}
                </p>
                <p className="text-sm text-gray-500">
                  {status === "Reservado"
                    ? "O trabalho foi aceito pela marca, mas ainda não foi liberado para pagamento"
                    : status === "Liberado"
                      ? 'O Creator entregou o conteúdo e a Marca marcou o trabalho como "Trabalho Concluído"'
                      : status === "Pago"
                        ? "O valor já foi transferido para a conta cadastrada pelo Creator"
                        : "Caso o Creator não entregue o conteúdo da campanha dentro do prazo e o pagamento retorne para a marca"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p
                className={`font-medium whitespace-nowrap ${
                  status === "Cancelado" ? "text-red-500" : "text-green-500"
                }`}
              >
                {status === "Cancelado" ? "-" : "+"}{" "}
                {formatCurrency(
                  (transaction.expand?.campaign?.price || 0) / 100
                )}
              </p>
              {status === "Liberado" && transaction.completed_date && (
                <p className="text-sm text-gray-500 whitespace-nowrap">
                  Pagamento em{" "}
                  {calculatePaymentDate(transaction.completed_date)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Manter o comportamento existente para outros status
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      creatorName: "Foco Digital - Ganhe, Lucre e Brilhe",
      amount: 200,
      date: "17 de março de 2025",
      status: "Reservado",
      type: "credit",
    },
    {
      id: "2",
      creatorName: "Conecte Publi LTDA",
      amount: -40,
      date: "15 de abril de 2025",
      status: "Reservado",
      type: "debit",
    },
    {
      id: "3",
      creatorName: "Valor Pago ao Creator",
      amount: 160,
      date: "15 de abril de 2025",
      status: "Pago",
      type: "credit",
    },
  ];

  const filteredTransactions = mockTransactions.filter(
    (t) => t.status === status
  );

  if (filteredTransactions.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        Nenhuma transação encontrada
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      {filteredTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded-full">
              {transaction.type === "credit" ? (
                <ArrowUpIcon className="w-6 h-6 text-green-600" />
              ) : (
                <ArrowDownIcon className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <p className="font-medium">{transaction.creatorName}</p>
              <p className="text-sm text-gray-500">{transaction.date}</p>
            </div>
          </div>
          <p
            className={cn(
              "font-medium",
              transaction.type === "credit" ? "text-green-500" : "text-red-500"
            )}
          >
            {transaction.type === "credit" ? "+" : "-"} R$
            {Math.abs(transaction.amount).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}
