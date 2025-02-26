/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import br_flag from "@/assets/icons/br-flag.png";
import us_flag from "@/assets/icons/us-flag.png";

import pb from "@/lib/pb";
import {
  buyPlanByPagSeguro,
  buyPlanByStripe,
} from "@/services/spotightCampaign";

import { Campaign } from "@/types/Campaign";
import { CreatorProduct } from "@/types/CreatorProduct";
import { Deliverables } from "@/types/Deliverables";
import { SpotlightCampaignPlan } from "@/types/SpotlightCampaignPlan";

import {
  campaignPaymentByPagSeguro,
  campaignPaymentByStripe,
} from "@/services/pagseguro";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import {
  paymentCreatorsByPagseguro,
  paymentCreatorsByStripe,
} from "@/services/approveCreators";
import {
  payDeliverablePagseguro,
  payDeliverableStripe,
} from "@/services/deliverables";
import i18n from "@/i18n";
import {
  payCreatorProductPagseguro,
  payCreatorProductStripe,
} from "@/services/creatorProduct";
interface Props {
  plans?: SpotlightCampaignPlan[];
  selectedOption?: string;
  campaign?: Campaign;
  campaignData?: Campaign;
  approvedParticipationsCount?: number;
  toast?: any;
  setLoadingPayment?: React.ComponentState;
  type:
    | "create_campaign"
    | "buy_spotlight"
    | "buy_creators"
    | "deliverable"
    | "creator_product";
  participations?: CampaignParticipation[];
  unit_amount?: number;
  deliverable?: Deliverables;
  product?: CreatorProduct;
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
  participations,
  unit_amount,
  deliverable,
  product,
}) => {
  const [language, setLanguage] = useState<"pt" | "en">("pt");

  useEffect(() => {
    const i18nLanguage = i18n.language;
    if (i18nLanguage === "en-US") {
      setLanguage("en");
    } else {
      setLanguage("pt");
    }
  }, []);

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

  // PAGAR CAMPANHA
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

  // APROVAR CREATORS
  const pagSeguroMutateApproveCreators = useMutation({
    mutationFn: async () => {
      if (participations && participations.length >= 1) {
        await paymentCreatorsByPagseguro(
          campaign?.id || "",
          campaign?.name || "",
          unit_amount || 0,
          participations as [],
          toast
        );
      }
    },
  });

  const stripeMutateApproveCreators = useMutation({
    mutationFn: async () => {
      if (participations && participations.length >= 1) {
        await paymentCreatorsByStripe(
          campaign?.id || "",
          campaign?.name || "",
          unit_amount || 0,
          participations as [],
          toast
        );
      }
    },
  });

  // PAGAR ENTREGAVEIS
  const pagSeguroMutatePayDeliverable = useMutation({
    mutationFn: async () => {
      await payDeliverablePagseguro(deliverable as Deliverables, toast);
    },
  });

  const stripeMutatePayDeliverable = useMutation({
    mutationFn: async () => {
      await payDeliverableStripe(deliverable as Deliverables, toast);
    },
  });

  // COMPRAR PRODUTOS CREATOR
  const pagSeguroMutatePayCreatorProduct = useMutation({
    mutationFn: async () => {
      console.log(product);
      await payCreatorProductPagseguro(product as CreatorProduct, toast);
    },
  });

  const stripeMutatePayCreatorProduct = useMutation({
    mutationFn: async () => {
      await payCreatorProductStripe(product as CreatorProduct, toast);
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
              } else if (type === "buy_creators") {
                pagSeguroMutateApproveCreators.mutate();
              } else if (type === "deliverable") {
                pagSeguroMutatePayDeliverable.mutate();
              } else if (type === "creator_product") {
                pagSeguroMutatePayCreatorProduct.mutate();
              }
            }}
            disabled={
              pagSeguroMutateSpotlight.isPending ||
              pagSeguroMutateCampaign.isPending ||
              pagSeguroMutateApproveCreators.isPending ||
              pagSeguroMutatePayDeliverable.isPending ||
              pagSeguroMutatePayCreatorProduct.isPending
            }
            className={`px-4 py-2 rounded-lg text-white ${
              pagSeguroMutateSpotlight.isPending ||
              pagSeguroMutateCampaign.isPending ||
              pagSeguroMutateApproveCreators.isPending ||
              pagSeguroMutatePayDeliverable.isPending ||
              pagSeguroMutatePayCreatorProduct.isPending
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {pagSeguroMutateSpotlight.isPending ||
            pagSeguroMutateCampaign.isPending ||
            pagSeguroMutateApproveCreators.isPending ||
            pagSeguroMutatePayDeliverable.isPending ||
            pagSeguroMutatePayCreatorProduct.isPending
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
              } else if (type === "buy_creators") {
                stripeMutateApproveCreators.mutate();
              } else if (type === "deliverable") {
                stripeMutatePayDeliverable.mutate();
              } else if (type === "creator_product") {
                stripeMutatePayCreatorProduct.mutate();
              }
            }}
            disabled={
              stripeMutateSpotlight.isPending ||
              stripeMutateCampaign.isPending ||
              stripeMutateApproveCreators.isPending ||
              stripeMutatePayDeliverable.isPending ||
              stripeMutatePayCreatorProduct.isPending
            }
            className={`px-4 py-2 rounded-lg text-white ${
              stripeMutateSpotlight.isPending ||
              stripeMutateCampaign.isPending ||
              stripeMutateApproveCreators.isPending ||
              stripeMutatePayDeliverable.isPending ||
              stripeMutatePayCreatorProduct.isPending
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {stripeMutateSpotlight.isPending ||
            stripeMutateCampaign.isPending ||
            stripeMutateApproveCreators.isPending ||
            stripeMutatePayDeliverable.isPending ||
            stripeMutatePayCreatorProduct.isPending
              ? `${language === "pt" ? "Processando..." : "Processing..."}`
              : "Stripe"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GatewayPaymentModal;
