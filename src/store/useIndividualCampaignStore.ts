import { create } from "zustand";

import { Campaign } from "@/types/Campaign";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import pb from "@/lib/pb";

type CampaignState = {
  campaign: Campaign | null;
  campaignParticipations: CampaignParticipation[] | [];
  setCampaign: (data: Campaign) => void;
  setCampaignParticipations: (data: CampaignParticipation[]) => void;
  calculateOpenJobs: () => void;
  addParticipation: (participationData: CampaignParticipation) => void;
  removeParticipation: (participationId: string) => void;
};

const useIndividualCampaignStore = create<CampaignState>((set, get) => ({
  campaign: null,
  campaignParticipations: [],
  setCampaign: (data) => set({ campaign: data }),
  setCampaignParticipations: (data) => set({ campaignParticipations: data }),
  calculateOpenJobs: () => {
    const { campaign, campaignParticipations } = get();

    if (!campaign || !campaignParticipations) return;

    let ocupadas = 0;

    campaignParticipations.forEach((participation) => {
      if (
        participation.status === "approved" ||
        participation.status === "completed"
      ) {
        ocupadas += 1;
      }
    });

    const vagasRestantes = (campaign.open_jobs || 0) - ocupadas;

    set({
      campaign: {
        ...campaign,
        vagasRestantes: vagasRestantes >= 0 ? vagasRestantes : 0,
      },
    });
  },
  addParticipation: async (participationData) => {
    const { campaignParticipations, calculateOpenJobs } = get();

    try {
      // Chamada à API para criar uma nova participação
      const res = await pb
        .collection<CampaignParticipation>("Campaigns_Participations")
        .create(participationData);

      set({
        campaignParticipations: [...campaignParticipations, res],
      });

      calculateOpenJobs();
    } catch (error) {
      console.error("Erro ao adicionar participação:", error);
      throw error;
    }
  },
  removeParticipation: async (participationId) => {
    const { campaignParticipations, calculateOpenJobs } = get();

    try {
      await pb.collection("Campaigns_Participations").delete(participationId);

      set({
        campaignParticipations: campaignParticipations.filter(
          (p) => p.id !== participationId
        ),
      });

      calculateOpenJobs();
    } catch (error) {
      console.error("Erro ao remover participação:", error);
      throw error;
    }
  },
}));

export default useIndividualCampaignStore;
