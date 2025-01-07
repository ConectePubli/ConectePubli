/* eslint-disable @typescript-eslint/no-explicit-any */
import pb from "@/lib/pb";
import { BrandPremiumPlan } from "@/types/BrandPremiumPlan";
import axios from "axios";

export const subscribeClubPremium = async (
  plan: BrandPremiumPlan,
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
      `https://conecte-publi.pockethost.io/api/stripe/brand_premium_checkout`,
      {
        stripe_price_id: plan.stripe_price_id,
        stripe_product_id: plan.stripe_product_id,
        plan_id: plan.id,
        brand_id: pb?.authStore?.model?.id || "",
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

export const isBrandPremium = async () => {
  try {
    const purchasedPlan = await pb
      .collection("purchased_brand_plans")
      .getFullList({
        filter: `brand="${pb.authStore?.model?.id}"`,
      });

    if (purchasedPlan && purchasedPlan.length >= 1) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(`error fetch club premium plan: ${e}`);

    return false;
  }
};
