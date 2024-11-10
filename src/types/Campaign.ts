import { CampaignParticipation } from "./Campaign_Participations";
import { ParticipationStatusFilter } from "@/types/Filters";

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  price: number;
  paid?: boolean;
  brand: string;
  beginning: Date;
  end: Date;
  open_jobs?: number;
  objective?: "UGC" | "Influencer";
  status: "ready" | "in_progress" | "ended";
  cover_img?: string;
  niche: string[];
  channels: string[];
  created: Date;
  updated: Date;
  collectionId: string;
  collectionName: string;
  vagasRestantes?: number;
  participationStatus?: ParticipationStatusFilter;
  expand?: {
    campaigns_participations_via_Campaign?: CampaignParticipation[];
  };
}
