import { CampaignParticipation } from "./Campaign_Participations";
import { ParticipationStatusFilter } from "@/types/Filters";
import { Niche } from "./Niche";
import { Brand } from "./Brand";

export interface Campaign {
  id: string;
  name: string;
  unique_name: string;
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
  gender?: string;
  min_age?: number;
  max_age?: number;
  video_type?: string;
  min_video_duration?: string;
  max_video_duration?: string;
  min_followers?: number;
  created: Date;
  updated: Date;
  collectionId: string;
  collectionName: string;
  vagasRestantes?: number;
  participationStatus?: ParticipationStatusFilter;
  expand?: {
    campaigns_participations_via_Campaign?: CampaignParticipation[];
    niche?: Niche[];
    brand?: Brand;
  };
}
