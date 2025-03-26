/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

import pb from "@/lib/pb";

import { BrandProduct } from "@/types/BrandProduct";

export const payBrandProductPagseguro = async (
  product: BrandProduct,
  toast: any
) => {
  try {
    const response = await axios.post(
      "https://pocketbase.conectepubli.com/api/pagseguro/brand_product_checkout",
      {
        brand_id: pb.authStore.model?.id,
        brand_product_name: product.stripe_product_name,
        unit_amount: product.pagseguro_price,
        brand_product_id: product.id,
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

export const payBrandProductStripe = async (
  product: BrandProduct,
  toast: any
) => {
  try {
    const response = await axios.post(
      "https://pocketbase.conectepubli.com/api/stripe/brand_product_checkout",
      {
        brand_id: pb.authStore.model?.id,
        brand_product_id: product.id,
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
