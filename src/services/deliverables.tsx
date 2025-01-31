/* eslint-disable @typescript-eslint/no-explicit-any */
import pb from "@/lib/pb";
import { Deliverables } from "@/types/Deliverables";
import axios from "axios";
import { t } from "i18next";
import React from "react";

export const getCreatorDeliverables = async (
  setLoadingDeliverables: React.ComponentState
) => {
  setLoadingDeliverables(true);

  try {
    const deliverables = await pb
      .collection("deliverable_proposals")
      .getFullList({
        filter: `influencer="${pb.authStore.model?.id}"`,
        expand: "brand, influencer",
        sort: "-created",
      });

    return deliverables as unknown as Deliverables[];
  } catch (e) {
    console.log(`error fetch influencer deliverables: ${e}`);
    return [];
  } finally {
    setLoadingDeliverables(false);
  }
};

export const getBrandDeliverables = async (
  setLoadingDeliverables: React.ComponentState
) => {
  setLoadingDeliverables(true);

  try {
    const deliverables = await pb
      .collection("deliverable_proposals")
      .getFullList({
        filter: `brand="${pb.authStore.model?.id}"`,
        expand: "brand, influencer",
        sort: "-created",
      });

    return deliverables as unknown as Deliverables[];
  } catch (e) {
    console.log(`error fetch influencer deliverables: ${e}`);
    return [];
  } finally {
    setLoadingDeliverables(false);
  }
};

export const payDeliverablePagseguro = async (
  deliverable: Deliverables,
  toast: any
) => {
  try {
    console.log("pag seguro");
    const response = await axios.post(
      "https://conecte-publi.pockethost.io/api/pagseguro/deliverable_proposal",
      {
        deliverable_proposal_id: deliverable.id,
        unit_amount: deliverable.total_price,
      },
      {
        headers: {
          "Content-Type": "application/json",
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

export const payDeliverableStripe = async (
  deliverable: Deliverables,
  toast: any
) => {
  try {
    const response = await axios.post(
      "https://conecte-publi.pockethost.io/api/stripe/deliverable_proposal",
      {
        deliverable_proposal_id: deliverable.id,
        unit_amount: deliverable.total_price,
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

export const returnStatus = (
  status: string,
  paid: boolean,
  isBrand?: boolean
) => {
  switch (status) {
    case "waiting":
      return <p style={{ color: "#FFC107" }}>{t("Aguardando aprovação")}</p>;
    case "approved":
      return paid ? (
        <p style={{ color: "#2881A7" }}>{t("Trabalho em progresso")}</p>
      ) : (
        <p style={{ color: "#FFC107" }}>
          {isBrand
            ? t("Realize o pagamento para continuar")
            : t("Aguardando confirmação da marca")}
        </p>
      );
    case "completed":
      return <p style={{ color: "#28A745" }}>{t("Trabalho concluído")}</p>;
    case "refused":
      return <p style={{ color: "#DC3545" }}>{t("Proposta recusada")}</p>;
    default:
      return <p style={{ color: "#000000" }}>{t("Status desconhecido")}</p>;
  }
};
