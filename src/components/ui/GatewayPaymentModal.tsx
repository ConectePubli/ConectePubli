/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  campaignPaymentByPagSeguro,
  campaignPaymentByStripe,
} from "@/services/pagseguro";

interface Props {
  plans?: SpotlightCampaignPlan[];
  selectedOption?: string;
  campaign?: Campaign;
  campaignData?: Campaign;
  approvedParticipationsCount?: number;
  toast?: any;
  setLoadingPayment?: React.ComponentState;
  type: "create_campaign" | "buy_spotlight";
}

const GatewayPaymentModal: React.FC<Props> = ({
  plans,
  selectedOption,
  campaign,
  type,
  campaignData,
  approvedParticipationsCount,
  toast,
  setLoadingPayment,
}) => {
  const [language, setLanguage] = useState<"pt" | "en">("pt");

  // COMPRAR DESTAQUE
  const pagSeguroMutateSpotlight = useMutation({
    mutationFn: async () => {
      const selectedPlan = plans?.find((plan) => plan.id === selectedOption);
      if (!selectedPlan) throw new Error("Plano não encontrado");

      await buyPlanByPagSeguro(selectedPlan, pb, campaign as Campaign);
    },
  });

  const stripeMutateSpotlight = useMutation({
    mutationFn: async () => {
      const selectedPlan = plans?.find((plan) => plan.id === selectedOption);
      if (!selectedPlan) throw new Error("Plano não encontrado");

      await buyPlanByStripe(selectedPlan, pb, campaign as Campaign);
    },
  });

  // PAGAR CLUBE
  const pagSeguroMutateCampaign = useMutation({
    mutationFn: async () => {
      if (campaignData) {
        await campaignPaymentByPagSeguro(
          campaignData.id,
          campaignData.name,
          Math.round(
            (Number(campaignData?.price) / 100) *
              Number(approvedParticipationsCount) *
              100
          ),
          toast,
          setLoadingPayment
        );
      }
    },
  });

  const stripeMutateCampaign = useMutation({
    mutationFn: async () => {
      if (campaignData) {
        await campaignPaymentByStripe(
          campaignData.id,
          campaignData.name,
          Math.round(
            (Number(campaignData?.price) / 100) *
              Number(approvedParticipationsCount) *
              100
          ),
          toast,
          setLoadingPayment
        );
      }
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
            onClick={() => {
              if (type === "buy_spotlight") {
                pagSeguroMutateSpotlight.mutate();
              } else if (type === "create_campaign") {
                pagSeguroMutateCampaign.mutate();
              }
            }}
            disabled={
              pagSeguroMutateSpotlight.isPending ||
              pagSeguroMutateCampaign.isPending
            }
            className={`px-4 py-2 rounded-lg text-white ${
              pagSeguroMutateSpotlight.isPending ||
              pagSeguroMutateCampaign.isPending
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {pagSeguroMutateSpotlight.isPending ||
            pagSeguroMutateCampaign.isPending
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
            onClick={() => {
              if (type === "buy_spotlight") {
                stripeMutateSpotlight.mutate();
              } else if (type === "create_campaign") {
                stripeMutateCampaign.mutate();
              }
            }}
            disabled={
              stripeMutateSpotlight.isPending || stripeMutateCampaign.isPending
            }
            className={`px-4 py-2 rounded-lg text-white ${
              stripeMutateSpotlight.isPending || stripeMutateCampaign.isPending
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {stripeMutateSpotlight.isPending || stripeMutateCampaign.isPending
              ? `${language === "pt" ? "Processando..." : "Processing..."}`
              : "Stripe"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GatewayPaymentModal;
