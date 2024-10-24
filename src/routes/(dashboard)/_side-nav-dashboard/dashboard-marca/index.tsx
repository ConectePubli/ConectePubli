import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, List, Plus, Search } from "lucide-react";
import React from "react";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-marca/"
)({
  component: Page,
});

function Page() {
  const [statusFilter, setStatusFilter] = React.useState("");
  const [campaignGoalFilter, setCampaignGoalFilter] = React.useState("");

  return (
    <div>
      <h1 className="font-bold">Minhas Campanhas</h1>
      <p className="mt-2">Visualize todas as suas campanhas ou crie uma.</p>

      <Button
        className="mt-4"
        variant={"blue"}
        onClick={() => {
          console.log("IR PARA TELA DE CRIAR CAMPANHA");
        }}
      >
        <Plus className="mr-2" /> Criar Campanha
      </Button>

      <div className="pt-4 pb-5 px-6 bg-gray-100 rounded-lg mx-auto border border-gray-400 mt-5">
        <div className="flex items-center space-x-2">
          <List color="#10438F" />
          <h2 className="text-lg font-bold justify-center">Filtro</h2>
        </div>

        <div className="mt-4 space-y-4 lg:space-y-0 lg:flex lg:space-x-4">
          {/* Campo de Pesquisa */}
          <div className="relative w-full lg:flex-[4]">
            <label htmlFor="campaignSearch" className="sr-only">
              Pesquisar pelo nome da campanha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-black" />
              </div>
              <input
                id="campaignSearch"
                type="text"
                placeholder="Pesquisar pelo nome da campanha"
                className="w-full pl-10 p-3 py-3 border border-black rounded-lg"
              />
            </div>
          </div>

          {/* Campo de Objetivo da Campanha */}
          <div className="relative w-full lg:flex-[2]">
            <label htmlFor="campaignGoal" className="sr-only">
              Objetivo da campanha
            </label>
            <select
              id="campaignGoal"
              value={campaignGoalFilter}
              onChange={(e) => setCampaignGoalFilter(e.target.value)}
              className="w-full p-3 py-3 border border-black rounded-lg appearance-none"
            >
              <option value="">Objetivo da campanha</option>
              <option value="awareness">Brand Awareness</option>
              <option value="conversion">Conversão</option>
            </select>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-black" />
            </span>
          </div>

          {/* Campo de Status */}
          <div className="relative w-full lg:flex-[1]">
            <label htmlFor="status" className="sr-only">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-3 py-3 border border-black rounded-lg appearance-none"
            >
              <option value="">Status</option>
              <option value="concluído">Concluído</option>
              <option value="aberto">Aberto</option>
            </select>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-black" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
