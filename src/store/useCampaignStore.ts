import pb from "@/lib/pb";
import { Campaign } from "@/types/Campaign";
import {
  CampaignGoalFilter,
  StatusFilter,
  ChannelFilter,
  NicheFilter,
  ParticipationStatusFilter,
  ChannelFilterType,
  NicheFilterType,
} from "@/types/Filters";
import { UserAuth } from "@/types/UserAuth";
import { create } from "zustand";

const ITEMS_PER_PAGE = 5;
const DEFAULT_ERROR_MESSAGE = "Erro ao buscar campanhas";
const DEFAULT_FILTERS = {
  statusFilter: StatusFilter.All,
  campaignGoalFilter: CampaignGoalFilter.All,
  channelFilter: ChannelFilter.All as ChannelFilterType,
  nicheFilter: NicheFilter.All as NicheFilterType,
  participationStatusFilter: ParticipationStatusFilter.All,
  searchTerm: "",
  page: 1,
  totalPages: 1,
};

interface CampaignState {
  campaigns: Campaign[];
  statusFilter: StatusFilter;
  participationStatusFilter: ParticipationStatusFilter;
  campaignGoalFilter: CampaignGoalFilter;
  channelFilter: ChannelFilterType;
  nicheFilter: NicheFilterType;
  searchTerm: string;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  setCampaigns: (campaigns: Campaign[]) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setParticipationStatusFilter: (status: ParticipationStatusFilter) => void;
  setCampaignGoalFilter: (goal: CampaignGoalFilter) => void;
  setChannelFilter: (channel: ChannelFilterType) => void;
  setNicheFilter: (niche: NicheFilterType) => void;
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
  fetchCampaigns: () => Promise<void>;
  fetchAllCampaigns: () => Promise<void>;
  fetchParticipatingCampaigns: () => Promise<void>;
  resetFilters: () => void;
}

const generateFilterString = (filters: string[]): string =>
  filters.join(" && ");

export const useCampaignStore = create<CampaignState>((set, get) => ({
  ...DEFAULT_FILTERS,
  campaigns: [],
  isLoading: false,
  error: null,

  setCampaigns: (campaigns) => set({ campaigns }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setParticipationStatusFilter: (participationStatusFilter) =>
    set({ participationStatusFilter }),
  setCampaignGoalFilter: (campaignGoalFilter) => set({ campaignGoalFilter }),
  setChannelFilter: (channelFilter) => set({ channelFilter }),
  setNicheFilter: (nicheFilter) => set({ nicheFilter }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setPage: (page) => set({ page }),
  setTotalPages: (totalPages) => set({ totalPages }),

  // Fetch campaigns for a specific brand
  fetchCampaigns: async () => {
    const {
      statusFilter,
      campaignGoalFilter,
      searchTerm,
      page,
      setCampaigns,
      setTotalPages,
    } = get();

    set({ isLoading: true, error: null });

    try {
      const filters: string[] = [];
      filters.push(`paid=true`);
      const currentBrandId = pb.authStore.model?.id;
      if (currentBrandId) {
        filters.push(`brand = "${currentBrandId}" && paid=true`);
      } else {
        throw new Error("Brand ID not found in authentication.");
      }

      if (statusFilter) filters.push(`status = "${statusFilter}"`);
      if (campaignGoalFilter)
        filters.push(`objective = "${campaignGoalFilter}"`);
      if (searchTerm) filters.push(`name ~ "${searchTerm}"`);

      const result = await pb
        .collection("campaigns")
        .getList<Campaign>(page, ITEMS_PER_PAGE, {
          filter: generateFilterString(filters),
          expand: "Campaigns_Participations_via_campaign",
          sort: "-created",
        });

      setCampaigns(result.items);
      setTotalPages(result.totalPages);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE,
        isLoading: false,
      });
    }
  },

  // Fetch all campaigns without filtering by brand
  fetchAllCampaigns: async () => {
    const {
      campaignGoalFilter,
      searchTerm,
      channelFilter,
      nicheFilter,
      page,
      setCampaigns,
      setTotalPages,
    } = get();

    set({ isLoading: true, error: null });

    try {
      const filters: string[] = [];
      filters.push(`paid=true`);
      if (campaignGoalFilter)
        filters.push(`objective = "${campaignGoalFilter}"`);
      if (searchTerm) filters.push(`name ~ "${searchTerm}"`);
      if (channelFilter) filters.push(`channels ~ "${channelFilter}"`);
      if (nicheFilter) filters.push(`niche ~ "${nicheFilter}"`);

      const result = await pb
        .collection("campaigns")
        .getList<Campaign>(page, ITEMS_PER_PAGE, {
          filter: generateFilterString(filters),
          sort: "-created",
        });

      let filteredCampaigns = result.items;
      const userAuthString = localStorage.getItem("pocketbase_auth");

      if (userAuthString) {
        const user = JSON.parse(userAuthString) as UserAuth;

        if (user && user.model) {
          const participations = await pb
            .collection("Campaigns_Participations")
            .getFullList({
              filter: `influencer="${user.model.id}"`,
            });

          const participationMap: Record<
            string,
            { status: string; id: string }
          > = {};
          participations.forEach((p) => {
            participationMap[p.campaign] = { status: p.status, id: p.id };
          });

          const allParticipations = await pb
            .collection("Campaigns_Participations")
            .getFullList();
          const approvedCountMap: Record<string, number> = {};

          allParticipations.forEach((part) => {
            if (part.status === "approved" || part.status === "completed") {
              approvedCountMap[part.campaign] =
                (approvedCountMap[part.campaign] || 0) + 1;
            }
          });

          for (const campaign of filteredCampaigns) {
            const userParticipation = participationMap[campaign.id];
            const approvedCount = approvedCountMap[campaign.id] || 0;
            const isSoldOut = (campaign.open_jobs || 0) <= approvedCount;

            // Se o participante já está approved/completed (não waiting ou sold_out), remover a campanha
            if (
              userParticipation &&
              userParticipation.status !== "waiting" &&
              userParticipation.status !== "sold_out"
            ) {
              filteredCampaigns = filteredCampaigns.filter(
                (c) => c.id !== campaign.id
              );
              continue;
            }

            // Se a campanha está sold_out
            if (isSoldOut) {
              // Se o participante está waiting, atualizar para sold_out
              if (userParticipation && userParticipation.status === "waiting") {
                await pb
                  .collection("Campaigns_Participations")
                  .update(userParticipation.id, {
                    status: "sold_out",
                  });
                userParticipation.status = "sold_out";
                campaign.participationStatus =
                  ParticipationStatusFilter.Sold_out;
              } else if (!userParticipation) {
                campaign.participationStatus =
                  ParticipationStatusFilter.Sold_out;
              } else {
                campaign.participationStatus =
                  userParticipation.status as ParticipationStatusFilter;
              }
            } else if (userParticipation) {
              campaign.participationStatus =
                userParticipation.status as ParticipationStatusFilter;
            }
          }
        }
      }

      setCampaigns(filteredCampaigns);
      setTotalPages(result.totalPages);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE,
        isLoading: false,
      });
    }
  },

  // Fetch campaigns the influencer is participating in
  fetchParticipatingCampaigns: async () => {
    const {
      campaignGoalFilter,
      searchTerm,
      participationStatusFilter,
      page,
      setCampaigns,
      setTotalPages,
    } = get();

    set({ isLoading: true, error: null });

    try {
      const filters: string[] = [];
      const userAuthString = localStorage.getItem("pocketbase_auth");
      if (!userAuthString) {
        throw new Error("User not authenticated");
      }

      const user = JSON.parse(userAuthString) as UserAuth;
      if (!user || !user.model) {
        throw new Error("Influencer ID not found");
      }

      filters.push(`influencer = "${user.model.id}" && campaign.paid=true`);
      if (campaignGoalFilter)
        filters.push(`campaign.objective ~ "${campaignGoalFilter}"`);
      if (participationStatusFilter)
        filters.push(`status = "${participationStatusFilter}"`);
      if (searchTerm) filters.push(`campaign.name ~ "${searchTerm}"`);

      const participationsResult = await pb
        .collection("Campaigns_Participations")
        .getList(page, ITEMS_PER_PAGE, {
          filter: generateFilterString(filters),
          expand: "campaign",
          sort: "-created",
        });

      const mergedCampaigns: (Campaign & { participationStatus: string })[] =
        participationsResult.items.map((item) => ({
          ...(item.expand?.campaign as Campaign),
          participationStatus: item.status,
        }));

      // Contar quantos aprovados/completos há por campanha para checar sold_out
      const allParticipations = await pb
        .collection("Campaigns_Participations")
        .getFullList();
      const approvedCountMap: Record<string, number> = {};

      allParticipations.forEach((part) => {
        if (part.status === "approved" || part.status === "completed") {
          approvedCountMap[part.campaign] =
            (approvedCountMap[part.campaign] || 0) + 1;
        }
      });

      // Atualizar status de waiting para sold_out se a campanha estiver esgotada
      for (const camp of mergedCampaigns) {
        const approvedCount = approvedCountMap[camp.id] || 0;
        const isSoldOut = (camp.open_jobs || 0) <= approvedCount;

        if (isSoldOut && camp.participationStatus === "waiting") {
          // Encontrar a participação para atualizar
          const p = participationsResult.items.find(
            (i) => i.campaign === camp.id
          );
          if (p) {
            await pb.collection("Campaigns_Participations").update(p.id, {
              status: "sold_out",
            });
            camp.participationStatus = ParticipationStatusFilter.Sold_out;
          }
        }
      }

      setCampaigns(mergedCampaigns);
      setTotalPages(participationsResult.totalPages);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE,
        isLoading: false,
      });
    }
  },

  // Reset filters to default values
  resetFilters: () => {
    set({
      statusFilter: StatusFilter.All,
      participationStatusFilter: ParticipationStatusFilter.All,
      campaignGoalFilter: CampaignGoalFilter.All,
      channelFilter: ChannelFilter.All as ChannelFilterType,
      nicheFilter: NicheFilter.All as NicheFilterType,
      searchTerm: "",
      page: 1,
    });
  },
}));
