/* eslint-disable @typescript-eslint/no-explicit-any */
import pb from "@/lib/pb";
import { InfluencerPremiumPlan } from "@/types/InfluencerPremiumPlan";
import axios from "axios";

export const subscribeInfluencerPremium = async (
  plan: InfluencerPremiumPlan,
  toast: any,
  loadingPayment: React.ComponentState,
  setLoadingPayment: React.ComponentState,
  type: 0 | 1
) => {
  try {
    if (type === 0) {
      setLoadingPayment({ ...loadingPayment, monthly: true });
    } else {
      setLoadingPayment({ ...loadingPayment, year: true });
    }

    const response = await axios.post(
      `https://conecte-publi.pockethost.io/api/stripe/influencer_premium_checkout`,
      {
        stripe_price_id: plan.stripe_price_id,
        stripe_product_id: plan.stripe_product_id,
        plan_id: plan.id,
        influencer_id: pb?.authStore?.model?.id || "",
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
    console.log(`error generate link payment pay club premium: ${e}`);

    toast.error("Erro ao iniciar pagamento, tente novamente mais tarde");
  } finally {
    setLoadingPayment(false);
  }
};

export const unsubscribeInfluencerPremium = async (
  setLoadingCancel: React.ComponentState,
  subscription_id: string,
  toast: any
) => {
  setLoadingCancel(true);

  try {
    await axios.post(
      `https://conecte-publi.pockethost.io/api/stripe/subscription_cancel_end_period_influencer`,
      {
        subscription_id: subscription_id,
      },
      {
        headers: {
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      }
    );

    toast("Cancelamento realizado com sucesso", {
      autoClose: 2500,
    });

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (e) {
    console.log(`error unsubscribe premium`);
    console.log(e);
    toast.error("Erro ao cancelar plano, tente novamente mais tarde");
  } finally {
    setLoadingCancel(false);
  }
};

export const isInfluencerPremium = async (influencerId?: string) => {
  try {
    const purchasedPlan = await pb
      .collection("purchased_influencers_plans")
      .getFullList({
        filter: `influencer="${influencerId || pb.authStore?.model?.id}" && active=true`,
      });

    if (purchasedPlan && purchasedPlan.length >= 1) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(`error fetch influencer premium plan: ${e}`);

    return false;
  }
};
