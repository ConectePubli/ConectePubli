import Client from "pocketbase";
import React from "react";
import axios from "axios";

import { SpotlightCampaignPlan } from "@/types/SpotlightCampaignPlan";
import { Campaign } from "@/types/Campaign";

export const getPlans = async (setPlans: React.ComponentState, pb: Client) => {
  try {
    const plans: SpotlightCampaignPlan[] = await pb
      .collection("campaign_spotlight_products")
      .getFullList();
    setPlans(plans);
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
      `https://conecte-publi.pockethost.io/api/stripe/product_spotlight_checkout`,
      {
        stripe_price_id: selectedPlan.test_stripe_price_id,
        stripe_product_id: selectedPlan.test_stripe_product_id,
        campaign_id: campaign.id,
        spotlight_id: selectedPlan.id,
      },
      {
        headers: {
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      }
    );

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
      `https://conecte-publi.pockethost.io/api/pagseguro/product_spotlight_checkout`,
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