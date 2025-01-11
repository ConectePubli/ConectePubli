/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { isDateAfter } from "@/utils/dateUtils";
import { formatDateUTC } from "@/utils/formatDateUTC";
import { parseBrazilianDate } from "@/utils/parseBrDate";
import { create } from "zustand";

const ITEMS_PER_PAGE = 5;
const DEFAULT_ERROR_MESSAGE = "Erro ao buscar campanhas";
const DEFAULT_FILTERS = {
  statusFilter: StatusFilter.All,
  campaignGoalFilter: CampaignGoalFilter.All,
  channelFilter: ChannelFilter.All as ChannelFilterType,
  nicheFilter: NicheFilter[""] as NicheFilterType,
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
      filters.push(`status != "draft"`);
      const currentBrandId = pb.authStore.model?.id;
      if (currentBrandId) {
        filters.push(`brand = "${currentBrandId}" && status != "draft"`);
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
  // Dentro do create<CampaignState>({ ... }), substitua APENAS o bloco fetchAllCampaigns

  // Ainda dentro do create<CampaignState>({ ... })
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
      // Monta o filtro
      const filters: string[] = [];
      filters.push(`status != "draft"`);
      if (campaignGoalFilter)
        filters.push(`objective = "${campaignGoalFilter}"`);
      if (searchTerm) filters.push(`name ~ "${searchTerm}"`);
      if (channelFilter) filters.push(`channels ~ "${channelFilter}"`);
      if (nicheFilter) filters.push(`niche ~ "${nicheFilter}"`);

      // 1. Pegamos *todas* as campanhas que atendem ao filtro
      let allCampaigns = await pb
        .collection("campaigns")
        .getFullList<Campaign>({
          filter: generateFilterString(filters),
          sort: "-created",
          expand: "brand",
        });

      const userAuthString = localStorage.getItem("pocketbase_auth");
      if (userAuthString) {
        const user = JSON.parse(userAuthString) as UserAuth;
        if (user?.model) {
          // Busca participations do influencer
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

          // Mapeia quantas participações aprovadas existem no geral
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

          // Ajusta o array allCampaigns levando em conta participations
          for (const campaign of allCampaigns) {
            const userParticipation = participationMap[campaign.id];
            if (userParticipation) {
              // Remove a campanha se o status não for "waiting" ou "sold_out"
              if (
                userParticipation.status !== "waiting" &&
                userParticipation.status !== "sold_out"
              ) {
                allCampaigns = allCampaigns.filter((c) => c.id !== campaign.id);
                continue;
              }
              campaign.participationStatus =
                userParticipation.status as ParticipationStatusFilter;
            } else {
              campaign.participationStatus = ParticipationStatusFilter.All;
            }
          }
        }
      }

      // 3. Lógica de destaque (spotlight)
      const now = new Date();
      try {
        // 3.1 Buscar todos os spotlights ativos
        const activeSpotlights = await pb
          .collection("purchased_campaigns_spotlights")
          .getFullList({
            filter: `spotlight_end >= "${now.toISOString()}"`,
            sort: "created",
          });

        // 3.2 Map para saber qual campanha está em destaque
        const spotlightMap: Record<string, { created: string }> = {};
        activeSpotlights.forEach((spotlight) => {
          spotlightMap[spotlight.campaign] = { created: spotlight.created };
        });

        // 3.3 Marcar as campanhas que têm spotlight ativo
        allCampaigns = allCampaigns.map((c) => {
          if (spotlightMap[c.id]) {
            return {
              ...c,
              spotlightActive: true,
              spotlightPurchasedAt: spotlightMap[c.id].created,
            };
          }
          return {
            ...c,
            spotlightActive: false,
            spotlightPurchasedAt: null,
          };
        }) as any;

        allCampaigns.sort((a, b) => {
          // Primeiro, quem está em spotlight
          if (a.spotlightActive && !b.spotlightActive) return -1;
          if (!a.spotlightActive && b.spotlightActive) return 1;

          // Se ambos têm spotlight, ordenamos pela data de compra baseado em DESC
          if (a.spotlightActive && b.spotlightActive) {
            const dateA = new Date(a.spotlightPurchasedAt!).getTime();
            const dateB = new Date(b.spotlightPurchasedAt!).getTime();
            return dateB - dateA;
            // Se você realmente quiser o mais antigo primeiro, troque por (dateA - dateB).
          }

          // Se nenhum tem spotlight, mantém a ordem de "-created" (mais recente primeiro)
          return 0;
        });
      } catch (spotlightError) {
        console.error("Erro ao buscar spotlights:", spotlightError);
      }

      // 4. Paginação "em memória"
      const totalItems = allCampaigns.length;
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedCampaigns = allCampaigns.slice(startIndex, endIndex);

      // Seta no estado
      setCampaigns(paginatedCampaigns);
      setTotalPages(totalPages);
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

      filters.push(
        `influencer = "${user.model.id}" && campaign.status != "draft"`
      );
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

      // Obter a data atual
      const currentDate = new Date();

      // Preparar uma lista de IDs de campanhas únicas
      const campaignIds = participationsResult.items.map((p) => p.campaign);
      const uniqueCampaignIds = Array.from(new Set(campaignIds));

      if (uniqueCampaignIds.length === 0) {
        setCampaigns([]);
        setTotalPages(1);
        set({ isLoading: false });
        return;
      }

      // Gerar filtro para campanhas aprovadas sem usar "IN"
      const approvedFilter = uniqueCampaignIds
        .map((id) => `campaign = "${id}"`)
        .join(" || ");

      const approvedParticipations = await pb
        .collection("Campaigns_Participations")
        .getList(1, 1000, {
          // Defina um limite adequado
          filter: `(${approvedFilter}) && status = "approved"`,
          sort: "-created",
        });

      // Mapear contagens de participações aprovadas por campanha
      const approvedCountMap: Record<string, number> = {};
      uniqueCampaignIds.forEach((id) => {
        approvedCountMap[id] = 0;
      });
      approvedParticipations.items.forEach((p) => {
        if (approvedCountMap[p.campaign] !== undefined) {
          approvedCountMap[p.campaign] += 1;
        }
      });

      // Atualizar participationStatus localmente se a campanha estiver bloqueada
      const updatedCampaigns = mergedCampaigns.map((campaign) => {
        const approvedCount = approvedCountMap[campaign.id] || 0;
        const blocked = isCampaignBlocked(campaign, approvedCount, currentDate);
        if (blocked) {
          return {
            ...campaign,
            participationStatus: ParticipationStatusFilter.Analysing,
          };
        }
        return campaign;
      });

      setCampaigns(updatedCampaigns);
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
      nicheFilter: NicheFilter[""] as NicheFilterType,
      searchTerm: "",
      page: 1,
    });
  },
}));

export const isCampaignBlocked = (
  campaign: Campaign,
  approvedParticipationsCount: number,
  currentDate: Date
): boolean => {
  const campaignStartDate = parseBrazilianDate(
    formatDateUTC(campaign.beginning)
  );

  return (
    !campaign.paid &&
    isDateAfter(currentDate, campaignStartDate) && // Usando a função auxiliar
    approvedParticipationsCount >= 1
  );
};
