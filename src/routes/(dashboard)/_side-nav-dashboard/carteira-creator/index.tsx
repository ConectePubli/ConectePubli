import { TransactionHistory } from "@/components/carteira/TransactionHistory";
import { getUserType } from "@/lib/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [showBalance, setShowBalance] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("showBalance");
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("showBalance", JSON.stringify(showBalance));
  }, [showBalance]);

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="px-10 pt-10 pb-4">
          <p className="text-lg font-bold">Minha Carteira</p>
          <p className="text-sm text-gray-500">
            Acompanhe seus ganhos na Conecte Publi!
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
              <p className="text-sm text-gray-500">Saldo Liberado</p>
              <p className="text-lg font-bold text-green-500">
                {showBalance ? "R$ 100,00" : "••••••"}
              </p>
            </div>

            <div className="flex flex-col gap-2 items-center pr-4">
              <p className="text-sm text-gray-500">Saldo Reservado</p>
              <p className="text-lg font-bold">
                {showBalance ? "R$ 260,00" : "••••••"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-base font-bold px-10 py-4">
          Histórico de Transações
        </p>
        <TransactionHistory />
      </div>
    </div>
  );
}
