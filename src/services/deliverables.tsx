import pb from "@/lib/pb";
import { Deliverables } from "@/types/Deliverables";
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
      });

    return deliverables as unknown as Deliverables[];
  } catch (e) {
    console.log(`error fetch influencer deliverables: ${e}`);
    return [];
  } finally {
    setLoadingDeliverables(false);
  }
};

export const returnStatus = (status: string, paid: boolean) => {
  switch (status) {
    case "waiting":
      return <p style={{ color: "#FFC107" }}>Aguardando aprovação</p>;
    case "approved":
      return paid ? (
        <p style={{ color: "#2881A7" }}>Trabalho em progresso</p>
      ) : (
        <p style={{ color: "#FFC107" }}>Aguardando confirmação da marca</p>
      );
    case "completed":
      return <p style={{ color: "#28A745" }}>Trabalho concluído</p>;
    case "refused":
      return <p style={{ color: "#DC3545" }}>Proposta recusada</p>;
    default:
      return <p style={{ color: "#000000" }}>Status desconhecido</p>;
  }
};
