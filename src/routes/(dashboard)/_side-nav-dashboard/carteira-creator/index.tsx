import { TransactionHistory } from "@/components/carteira/TransactionHistory";
import { getUserType } from "@/lib/auth";
import pb from "@/lib/pb";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Tipos para as participações
interface Participacao {
  id: string;
  completed_date?: string;
  conecte_paid_status?: "PAID" | "NOT_PAID";
  expand?: {
    campaign?: {
      price: number;
      name: string;
    };
  };
}

// Tipos para o grupo de participações por mês
interface GrupoParticipacoes {
  mes: number;
  ano: number;
  total: number;
  dataLiberacao: Date;
  participacoes: Array<{
    id: string;
    campanha: string;
    dataCompletada: string;
    valor: number;
    statusPagamento: string;
  }>;
}

// Tipos para os detalhes do saldo
interface DetalheSaldo {
  mesAno: string;
  totalMes: number;
  dataLiberacao: string;
  status: string;
  participacoes: GrupoParticipacoes["participacoes"];
}

// Tipo para o estado dos saldos
interface SaldosState {
  saldoLiberado: number;
  saldoReservado: number;
  detalhes: DetalheSaldo[];
  carregando: boolean;
}

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/carteira-creator/"
)({
  component: Page,
  loader: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login",
      });
    } else if (userType !== "Influencers") {
      throw redirect({
        to: "/dashboard-marca",
      });
    }
  },
});

function Page() {
  const { t } = useTranslation();
  const [showBalance, setShowBalance] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("showBalance");
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  const [saldos, setSaldos] = useState<SaldosState>({
    saldoLiberado: 0,
    saldoReservado: 0,
    detalhes: [],
    carregando: true,
  });

  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    localStorage.setItem("showBalance", JSON.stringify(showBalance));
  }, [showBalance]);

  const toggleBalance = (): void => {
    setShowBalance(!showBalance);
  };

  async function calcularSaldos(influencerId: string): Promise<{
    saldoLiberado: number;
    saldoReservado: number;
    detalhes: DetalheSaldo[];
    erro?: string;
  }> {
    try {
      const participacoesConcluidas = await pb
        .collection("Campaigns_Participations")
        .getList<Participacao>(1, 100, {
          filter: `influencer="${influencerId}" && status="completed"`,
          expand: "campaign",
        });

      let saldoLiberado = 0;
      const detalhes: DetalheSaldo[] = [];
      const participacoesPorMes: Record<string, GrupoParticipacoes> = {};

      participacoesConcluidas.items.forEach((participacao) => {
        if (
          !participacao.completed_date ||
          participacao.conecte_paid_status === "PAID"
        )
          return;

        const valorCampanha = (participacao.expand?.campaign?.price || 0) / 100;
        const dataCompletada = new Date(participacao.completed_date);
        const mes = dataCompletada.getMonth();
        const ano = dataCompletada.getFullYear();
        const chave = `${ano}-${mes}`;

        if (!participacoesPorMes[chave]) {
          participacoesPorMes[chave] = {
            mes,
            ano,
            total: 0,
            dataLiberacao: new Date(ano, mes + 1, 15),
            participacoes: [],
          };
        }

        participacoesPorMes[chave].total += valorCampanha;
        participacoesPorMes[chave].participacoes.push({
          id: participacao.id,
          campanha:
            participacao.expand?.campaign?.name || "Campanha desconhecida",
          dataCompletada: participacao.completed_date,
          valor: valorCampanha,
          statusPagamento: participacao.conecte_paid_status || "NOT_PAID",
        });
      });

      Object.values(participacoesPorMes).forEach((grupo) => {
        saldoLiberado += grupo.total;

        detalhes.push({
          mesAno: `${grupo.mes + 1}/${grupo.ano}`,
          totalMes: grupo.total,
          dataLiberacao: grupo.dataLiberacao.toISOString().split("T")[0],
          status: "Liberado",
          participacoes: grupo.participacoes,
        });
      });

      const participacoesAprovadas = await pb
        .collection("Campaigns_Participations")
        .getList<Participacao>(1, 100, {
          filter: `influencer="${influencerId}" && status="approved"`,
          expand: "campaign",
        });

      let saldoReservado = 0;
      if (participacoesAprovadas.items.length) {
        participacoesAprovadas.items.forEach((participacao) => {
          const valorCampanha =
            (participacao.expand?.campaign?.price || 0) / 100;
          saldoReservado += valorCampanha;
        });
      }

      // Calcular total de ganhos
      const participacoesPagas = await pb
        .collection("Campaigns_Participations")
        .getList<Participacao>(1, 100, {
          filter: `influencer="${influencerId}" && conecte_paid_status="PAID" && status="completed"`,
          expand: "campaign",
        });

      const totalGanhos = participacoesPagas.items.reduce(
        (acc, participacao) => {
          return acc + (participacao.expand?.campaign?.price || 0) / 100;
        },
        0
      );

      setTotalEarnings(totalGanhos);

      return {
        saldoLiberado,
        saldoReservado,
        detalhes,
      };
    } catch (error) {
      console.error("Erro ao calcular os saldos:", error);
      return {
        saldoLiberado: 0,
        saldoReservado: 0,
        detalhes: [],
        erro: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  useEffect(() => {
    async function buscarSaldos(): Promise<void> {
      try {
        const influencerId = pb.authStore.model?.id;
        if (!influencerId) {
          throw new Error("ID do influencer não encontrado");
        }
        setSaldos((prevState) => ({ ...prevState, carregando: true }));
        const resultado = await calcularSaldos(influencerId);
        setSaldos({
          saldoLiberado: resultado.saldoLiberado,
          saldoReservado: resultado.saldoReservado,
          detalhes: resultado.detalhes,
          carregando: false,
        });
      } catch (error) {
        console.error("Erro ao buscar saldos:", error);
        setSaldos({
          saldoLiberado: 0,
          saldoReservado: 0,
          detalhes: [],
          carregando: false,
        });
      }
    }

    buscarSaldos();
  }, []);

  const formatarValor = (valor: number): string => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="px-10 pt-10 pb-4">
          <p className="text-lg font-bold">{t("Minha Carteira")}</p>
          <p className="text-sm text-gray-500">
            {t("Acompanhe seus ganhos na Conecte Publi!")}
          </p>
        </div>

        <div className="px-10">
          <div className="flex border rounded-lg p-4 w-fit gap-10">
            <div
              className="flex items-center gap-2 pl-4 cursor-pointer"
              onClick={toggleBalance}
            >
              {showBalance ? (
                <Eye className="w-8 h-8 text-gray-500" />
              ) : (
                <EyeOff className="w-8 h-8 text-gray-500" />
              )}
            </div>

            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm text-gray-500">{t("Saldo Liberado")}</p>
              <p className="text-lg font-bold text-green-500">
                {showBalance
                  ? saldos.carregando
                    ? t("Carregando...")
                    : formatarValor(saldos.saldoLiberado)
                  : "••••••"}
              </p>
            </div>

            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm text-gray-500">{t("Saldo Reservado")}</p>
              <p className="text-lg font-bold">
                {showBalance
                  ? saldos.carregando
                    ? t("Carregando...")
                    : formatarValor(saldos.saldoReservado)
                  : "••••••"}
              </p>
            </div>

            <div className="flex flex-col gap-2 items-center pr-4">
              <p className="text-sm text-gray-500">{t("Total Recebido")}</p>
              <p className="text-lg font-bold text-green-500">
                {showBalance
                  ? saldos.carregando
                    ? t("Carregando...")
                    : formatarValor(totalEarnings * 0.8)
                  : "••••••"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-base font-bold px-10 py-4">
          {t("Histórico de Transações")}
        </p>
        <TransactionHistory />
      </div>
    </div>
  );
}
