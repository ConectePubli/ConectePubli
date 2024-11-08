import pb from "@/lib/pb";
import { Campaign } from "@/types/Campaign";
import {
  CampaignGoalFilter,
  StatusFilter,
  ChannelFilter,
  NicheFilter,
  ParticipationStatusFilter,
} from "@/types/Filters";
import { create } from "zustand";

const ITEMS_PER_PAGE = 5;
const DEFAULT_ERROR_MESSAGE = "Erro ao buscar campanhas";
const DEFAULT_FILTERS = {
  statusFilter: StatusFilter.All,
  campaignGoalFilter: CampaignGoalFilter.All,
  channelFilter: ChannelFilter.All,
  nicheFilter: NicheFilter.All,
  searchTerm: "",
  page: 1,
  totalPages: 1,
};

interface CampaignState {
  campaigns: Campaign[];
  statusFilter: StatusFilter;  
  participationStatusFilter: ParticipationStatusFilter;
  campaignGoalFilter: CampaignGoalFilter;
  channelFilter: ChannelFilter;
  nicheFilter: NicheFilter;
  searchTerm: string;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  setCampaigns: (campaigns: Campaign[]) => void;
  setStatusFilter: (status: StatusFilter) => void;  
  setParticipationStatusFilter: (status: ParticipationStatusFilter) => void;
  setCampaignGoalFilter: (goal: CampaignGoalFilter) => void;
  setChannelFilter: (channel: ChannelFilter) => void;
  setNicheFilter: (channel: NicheFilter) => void;
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
  fetchCampaigns: () => Promise<void>;
  fetchAllCampaigns: () => Promise<void>;
  fetchParticipatingCampaigns: () => Promise<void>;
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
  setParticipationStatusFilter: (participationStatusFilter) => set({ participationStatusFilter }),
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
      const currentBrandId = pb.authStore.model?.id;
      if (currentBrandId) {
        filters.push(`brand = "${currentBrandId}"`);
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
      const currentInfluencerId = pb.authStore.model?.id;

      if (currentInfluencerId) {
        filters.push(`influencer = "${currentInfluencerId}"`);
      } else {
        throw new Error("Influencer ID not found in authentication.");
      }

      if (campaignGoalFilter)
        filters.push(`campaign.objective ~ "${campaignGoalFilter}"`);      
      if (participationStatusFilter)
        filters.push(`status ~ "${participationStatusFilter}"`);
      if (searchTerm) filters.push(`campaign.name ~ "${searchTerm}"`);

      const participationsResult = await pb
        .collection("Campaigns_Participations")
        .getList(page, ITEMS_PER_PAGE, {
          filter: generateFilterString(filters),
          expand: "campaign",
          sort: "-created",
        });

      const mergedCampaigns = participationsResult.items.map((item) => ({
        ...item.expand.campaign,
        participantStatus: item.status,
      }));

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
}));
