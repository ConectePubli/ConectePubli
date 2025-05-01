"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TransactionList } from "./TransactionList";
import { useTranslation } from "react-i18next";
export type TransactionStatus =
  | "Reservado"
  | "Liberado"
  | "Pago"
  | "Cancelado"
  | "Extrato";

export interface Transaction {
  id: string;
  creatorName: string;
  creatorImage?: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  type: "credit" | "debit";
}

export function TransactionHistory() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex flex-col gap-4">
        <Tabs defaultValue="Extrato" className="w-full">
          <div className="overflow-x-auto  no-scrollbar">
            <TabsList className="flex w-full justify-start h-auto p-0 bg-transparent px-4 md:px-10 border-b rounded-none min-w-full gap-6">
              {["Extrato", "Reservado", "Liberado", "Pago", "Cancelado"].map(
                (status) => (
                  <TabsTrigger
                    key={status}
                    value={status}
                    className="data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none h-auto pb-2 px-2 md:px-4 text-sm whitespace-nowrap flex-shrink-0 min-w-max"
                  >
                    {t(status)}
                  </TabsTrigger>
                )
              )}
            </TabsList>
          </div>

          <TabsContent value="Extrato">
            <TransactionList status="Extrato" />
          </TabsContent>
          <TabsContent value="Reservado">
            <TransactionList status="Reservado" />
          </TabsContent>
          <TabsContent value="Liberado">
            <TransactionList status="Liberado" />
          </TabsContent>
          <TabsContent value="Pago">
            <TransactionList status="Pago" />
          </TabsContent>
          <TabsContent value="Cancelado">
            <TransactionList status="Cancelado" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
