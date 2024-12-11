import { Brand } from "./Brand";
import { Campaign } from "./Campaign";
import { Influencer } from "./Influencer";

interface FeedbackItem {
  short_term: string;
  question: string;
  rating: number;
}

export interface Rating {
  id: string;
  to_brand?: string; // ID da marca
  to_influencer?: string; // ID do influencer
  to_conectepubli?: boolean;

  expand?: {
    from_brand?: Brand; // expandido
    from_influencer?: Influencer; // expandido
    campaign?: Campaign; // expandido
  };

  feedback?: FeedbackItem[];
  comment?: string;
  created: string;
}
