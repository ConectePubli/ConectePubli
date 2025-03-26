/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

import pb from "@/lib/pb";

import { CreatorProduct } from "@/types/CreatorProduct";

export const payCreatorProductPagseguro = async (
  product: CreatorProduct,
  toast: any
) => {
  try {
    const response = await axios.post(
      "https://pocketbase.conectepubli.com/api/pagseguro/creator_product_checkout",
      {
        creator_id: pb.authStore.model?.id,
        creator_product_name: product.stripe_product_name,
        unit_amount: product.pagseguro_price,
        creator_product_id: product.id,
      },
      {
        headers: {
          "Content-Type": "application/json ",
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      }
    );

    if (response.data.link) {
      window.location.href = response.data.link;
    } else {
      throw new Error("Link de pagamento não encontrado");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erro ao criar checkout com Pagseguro:",
        error.response?.data || error.message
      );
    } else {
      console.error("Erro ao criar checkout com Pagseguro:", error);
    }
    toast.error("Falha ao iniciar pagamento.");
  }
};

export const payCreatorProductStripe = async (
  product: CreatorProduct,
  toast: any
) => {
  try {
    const response = await axios.post(
      "https://pocketbase.conectepubli.com/api/stripe/creator_product_checkout",
      {
        creator_id: pb.authStore.model?.id,
        creator_product_id: product.id,
        stripe_price_id: product.stripe_price_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      }
    );

    if (response.data.url) {
      window.location.href = response.data.url;
    } else {
      throw new Error("Link de pagamento não encontrado");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erro ao criar checkout com Stripe:",
        error.response?.data || error.message
      );
    } else {
      console.error("Erro ao criar checkout com Stripe:", error);
    }
    toast.error("Falha ao iniciar pagamento.");
  }
};
