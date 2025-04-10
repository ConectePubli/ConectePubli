"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TransactionList } from "./TransactionList";

export type TransactionStatus =
  | "Extrato"
  | "Reservado"
  | "Liberado"
  | "Pago"
  | "Cancelado";

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
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <Tabs defaultValue="Extrato" className="w-full">
          <TabsList className="border-b rounded-none w-full justify-start h-auto p-0 bg-transparent px-10">
            <TabsTrigger
              value="Extrato"
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none h-auto pb-2"
            >
              Extrato
            </TabsTrigger>
            <TabsTrigger
              value="Reservado"
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none h-auto pb-2"
            >
              Reservado
            </TabsTrigger>
            <TabsTrigger
              value="Liberado"
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none h-auto pb-2"
            >
              Liberado
            </TabsTrigger>
            <TabsTrigger
              value="Pago"
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none h-auto pb-2"
            >
              Pago
            </TabsTrigger>
            <TabsTrigger
              value="Cancelado"
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none h-auto pb-2"
            >
              Cancelado
            </TabsTrigger>
          </TabsList>

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
