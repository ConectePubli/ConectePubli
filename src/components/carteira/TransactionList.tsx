import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Transaction, TransactionStatus } from "./TransactionHistory";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  status: TransactionStatus;
}

// This would come from your API
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

export function TransactionList({ status }: TransactionListProps) {
  // Filter transactions based on status
  const filteredTransactions =
    status === "Extrato"
      ? mockTransactions
      : mockTransactions.filter((t) => t.status === status);

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
