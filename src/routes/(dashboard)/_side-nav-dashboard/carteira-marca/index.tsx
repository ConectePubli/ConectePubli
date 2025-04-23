import { TransactionHistory } from "./-components/transaction-history";
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

// Tipo para o estado dos saldos
interface SaldosState {
  saldoInvestido: number;
  carregando: boolean;
}

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/carteira-marca/"
)({
  component: Page,
  loader: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login",
      });
    } else if (userType !== "Brands") {
      throw redirect({
        to: "/dashboard-creator",
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
    saldoInvestido: 0,
    carregando: true,
  });

  useEffect(() => {
    localStorage.setItem("showBalance", JSON.stringify(showBalance));
  }, [showBalance]);

  const toggleBalance = (): void => {
    setShowBalance(!showBalance);
  };

  async function calcularSaldos(): Promise<{
    saldoInvestido: number;
    erro?: string;
  }> {
    try {
      const brandId = pb.authStore.model?.id;
      if (!brandId) {
        throw new Error("ID da marca não encontrado");
      }

      // Get all campaign participations that are completed and paid for the brand's campaigns
      const participacoesPagas = await pb
        .collection("Campaigns_Participations")
        .getFullList<Participacao>({
          filter: `campaign.brand="${brandId}" && status="completed" && conecte_paid_status="PAID"`,
          expand: "campaign",
        });

      const totalInvestido = participacoesPagas.reduce((acc, participacao) => {
        return acc + (participacao.expand?.campaign?.price || 0) / 100;
      }, 0);

      return {
        saldoInvestido: totalInvestido,
      };
    } catch (error) {
      console.error("Erro ao calcular os saldos:", error);
      return {
        saldoInvestido: 0,
        erro: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  useEffect(() => {
    async function buscarSaldos(): Promise<void> {
      try {
        setSaldos((prevState) => ({ ...prevState, carregando: true }));
        const resultado = await calcularSaldos();
        setSaldos({
          saldoInvestido: resultado.saldoInvestido,
          carregando: false,
        });
      } catch (error) {
        console.error("Erro ao buscar saldos:", error);
        setSaldos({
          saldoInvestido: 0,
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

        <div className="px-4 md:px-10">
          <div className="flex flex-col md:flex-row border rounded-lg p-4 gap-6 w-full md:w-fit">
            <div
              className="flex items-center justify-center md:pl-4 cursor-pointer"
              onClick={toggleBalance}
            >
              {showBalance ? (
                <Eye className="w-8 h-8 text-gray-500" />
              ) : (
                <EyeOff className="w-8 h-8 text-gray-500" />
              )}
            </div>

            <div className="flex flex-col gap-1 items-center w-full md:w-auto">
              <p className="text-sm text-gray-500">{t("Total Investido")}</p>
              <p className="text-lg font-bold text-green-500">
                {showBalance
                  ? saldos.carregando
                    ? t("Carregando...")
                    : formatarValor(saldos.saldoInvestido)
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
