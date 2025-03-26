import Client from "pocketbase";
import React from "react";
import axios from "axios";

import { SpotlightCampaignPlan } from "@/types/SpotlightCampaignPlan";
import { Campaign } from "@/types/Campaign";
import { isBrandPremium } from "./brandPremium";

export const getPlans = async (
  setPlans: React.ComponentState,
  pb: Client,
  setIsPremium: React.ComponentState
) => {
  try {
    const plans: SpotlightCampaignPlan[] = await pb
      .collection("campaign_spotlight_products")
      .getFullList();

    const premium = await isBrandPremium();

    setPlans(plans);
    setIsPremium(premium);
  } catch (e) {
    console.log(`error get plans: ${e}`);
  }
};

export const buyPlanByStripe = async (
  selectedPlan: SpotlightCampaignPlan,
  pb: Client,
  campaign: Campaign
) => {
  try {
    const response = await axios.post(
      `https://pocketbase.conectepubli.com/api/stripe/product_spotlight_checkout`,
      {
        stripe_price_id: selectedPlan.stripe_price_id,
        stripe_product_id: selectedPlan.stripe_product_id,
        campaign_id: campaign.id,
        spotlight_id: selectedPlan.id,
      },
      {
        headers: {
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      }
    );

    console.log(response);
    if (response) {
      const link = response?.data?.url;

      if (link) {
        window.location.href = link;
      }
    }
  } catch (e) {
    console.log(`error buy spotlight plan stripe: ${e}`);
  }
};

export const buyPlanByPagSeguro = async (
  selectedPlan: SpotlightCampaignPlan,
  pb: Client,
  campaign: Campaign
) => {
  try {
    const response = await axios.post(
      `https://pocketbase.conectepubli.com/api/pagseguro/product_spotlight_checkout`,
      {
        campaign_id: campaign.id,
        spotlight_id: selectedPlan.id,
        unit_amount: selectedPlan.pagseguro_price,
        spotlight_name: selectedPlan.stripe_product_name,
      },
      {
        headers: {
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      }
    );

    if (response) {
      const link = response?.data?.link;

      if (link) {
        window.location.href = link;
      }
    }
  } catch (e) {
    console.log(`error buy spotlight plan pagseguro: ${e}`);
  }
};
