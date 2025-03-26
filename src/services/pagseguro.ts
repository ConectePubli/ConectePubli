/* eslint-disable @typescript-eslint/no-explicit-any */
import pb from "@/lib/pb";
import axios from "axios";
import React from "react";

export const campaignPaymentByPagSeguro = async (
  campaign_id: string,
  campaign_name: string,
  unit_amount: number,
  toast: any,
  setLoadingPayment: React.ComponentState
) => {
  try {
    setLoadingPayment(true);

    const response = await axios.post(
      `https://pocketbase.conectepubli.com/api/checkout_campaign`,
      {
        campaign_id: campaign_id,
        campaign_name: campaign_name,
        unit_amount: unit_amount,
      },
      {
        headers: {
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      const link = await response.data.link;

      if (link) {
        window.location.href = link;
      } else {
        toast.error("Erro ao iniciar pagamento, tente novamente mais tarde");
      }
    }
  } catch (e) {
    console.log(`error generate link payment pay campaign pag seguro: ${e}`);

    toast.error("Erro ao iniciar pagamento, tente novamente mais tarde");
  } finally {
    setLoadingPayment(false);
  }
};

export const campaignPaymentByStripe = async (
  campaign_id: string,
  campaign_name: string,
  unit_amount: number,
  toast: any,
  setLoadingPayment: React.ComponentState
) => {
  try {
    setLoadingPayment(true);

    const response = await axios.post(
      `https://pocketbase.conectepubli.com/api/stripe/checkout_campaign`,
      {
        campaign_id: campaign_id,
        campaign_name: campaign_name,
        unit_amount: unit_amount,
      },
      {
        headers: {
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      }
    );

    console.log(response);

    if (response.status === 200 || response.status === 201) {
      const link = await response.data.url;

      if (link) {
        window.location.href = link;
      } else {
        toast.error("Erro ao iniciar pagamento, tente novamente mais tarde");
      }
    }
  } catch (e) {
    console.log(`error generate link payment pay campaign stripe: ${e}`);

    toast.error("Erro ao iniciar pagamento, tente novamente mais tarde");
  } finally {
    setLoadingPayment(false);
  }
};
