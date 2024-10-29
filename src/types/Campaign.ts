import { CampaignParticipation } from "./Campaign_Participations";

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
  created: Date;
  updated: Date;
  collectionId: string;
  collectionName: string;

  expand?: {
    campaigns_participations_via_Campaign?: CampaignParticipation[];
  };
}
