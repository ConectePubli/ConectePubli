import pb from "@/lib/pb";
import { Campaign } from "@/types/Campaign";
import { CampaignGoalFilter, StatusFilter } from "@/types/Filters";
import { create } from "zustand";

interface CampaignState {
  campaigns: Campaign[];
  statusFilter: StatusFilter;
  campaignGoalFilter: CampaignGoalFilter;
  searchTerm: string;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  setCampaigns: (campaigns: Campaign[]) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setCampaignGoalFilter: (goal: CampaignGoalFilter) => void;
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
  fetchCampaigns: () => Promise<void>;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  statusFilter: StatusFilter.All,
  campaignGoalFilter: CampaignGoalFilter.All,
  searchTerm: "",
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  setCampaigns: (campaigns) => set({ campaigns }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setCampaignGoalFilter: (campaignGoalFilter) => set({ campaignGoalFilter }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setPage: (page) => set({ page }),
  setTotalPages: (totalPages) => set({ totalPages }),

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
      const perPage = 5;
      const filters: string[] = [];

      const currentBrandId = pb.authStore.model?.id;
      if (currentBrandId) {
        filters.push(`brand = "${currentBrandId}"`);
      } else {
        throw new Error("Brand ID não encontrado na autenticação.");
      }

      // Construa os filtros com base nos filtros selecionados
      if (statusFilter) {
        filters.push(`status = "${statusFilter}"`);
      }

      if (campaignGoalFilter) {
        filters.push(`objective = "${campaignGoalFilter}"`);
      }

      if (searchTerm) {
        filters.push(`name ~ "${searchTerm}"`);
      }

      const filterString = filters.join(" && ");

      const result = await pb
        .collection("campaigns")
        .getList<Campaign>(page, perPage, {
          filter: filterString,
          expand: "campaigns_participations_via_Campaign",
          sort: "-created",
        });

      setCampaigns(result.items);
      setTotalPages(result.totalPages);
      set({ isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao buscar campanhas",
        isLoading: false,
      });
    }
  },
}));
