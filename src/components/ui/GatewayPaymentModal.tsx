import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import br_flag from "@/assets/icons/br-flag.png";
import us_flag from "@/assets/icons/us-flag.png";

import pb from "@/lib/pb";
import {
  buyPlanByPagSeguro,
  buyPlanByStripe,
} from "@/services/spotightCampaign";

import { SpotlightCampaignPlan } from "@/types/SpotlightCampaignPlan";
import { Campaign } from "@/types/Campaign";

interface Props {
  plans: SpotlightCampaignPlan[];
  selectedOption: string;
  campaign: Campaign;
}

const GatewayPaymentModal: React.FC<Props> = ({
  plans,
  selectedOption,
  campaign,
}) => {
  const [language, setLanguage] = useState<"pt" | "en">("pt");

  const pagSeguroMutate = useMutation({
    mutationFn: async () => {
      const selectedPlan = plans.find((plan) => plan.id === selectedOption);
      if (!selectedPlan) throw new Error("Plano não encontrado");

      await buyPlanByPagSeguro(selectedPlan, pb, campaign);
    },
  });

  const stripeMutate = useMutation({
    mutationFn: async () => {
      const selectedPlan = plans.find((plan) => plan.id === selectedOption);
      if (!selectedPlan) throw new Error("Plano não encontrado");

      await buyPlanByStripe(selectedPlan, pb, campaign);
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center border-b pb-4 pt-2">
        <h2 className="text-xl font-semibold">
          {language === "pt"
            ? "Selecione o método de pagamento"
            : "Select Payment Method"}
        </h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <button
              onClick={() => setLanguage("pt")}
              className={`w-8 h-5 rounded-sm flex items-center justify-center ${
                language === "pt" ? "ring-1 ring-blue-500" : ""
              }`}
            >
              <img src={br_flag} alt="Brazil" className="w-5 h-5" />
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`w-8 h-5 rounded-sm flex items-center justify-center ml-2 ${
                language === "en" ? "ring-1 ring-blue-500" : ""
              }`}
            >
              <img src={us_flag} alt="USA" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex flex-col flex-1">
            <span className="font-medium">
              {language === "pt" ? "Compras Nacionais" : "National Purchases"}
            </span>
            <span className="text-sm text-gray-500">
              {language === "pt"
                ? "Pague com PagSeguro, ideal para compras dentro do Brasil."
                : "Pay with PagSeguro, ideal for purchases within Brazil."}
            </span>
          </div>
          <button
            onClick={() => pagSeguroMutate.mutate()}
            disabled={pagSeguroMutate.isPending}
            className={`px-4 py-2 rounded-lg text-white ${
              pagSeguroMutate.isPending
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {pagSeguroMutate.isPending
              ? `${language === "pt" ? "Processando..." : "Processing..."}`
              : "PagSeguro"}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex flex-col flex-1">
            <span className="font-medium">
              {language === "pt"
                ? "Compras Internacionais"
                : "International Purchases"}
            </span>
            <span className="text-sm text-gray-500">
              {language === "pt"
                ? "Pague com Stripe, ideal para compras fora do Brasil."
                : "Pay with Stripe, ideal for purchases outside of Brazil."}
            </span>
          </div>
          <button
            onClick={() => stripeMutate.mutate()}
            disabled={stripeMutate.isPending}
            className={`px-4 py-2 rounded-lg text-white ${
              stripeMutate.isPending
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {stripeMutate.isPending
              ? `${language === "pt" ? "Processando..." : "Processing..."}`
              : "Stripe"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GatewayPaymentModal;
