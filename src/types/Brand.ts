import { Niche } from "./Niche";

export interface Brand {
  address_num: number;
  cover_img?: string;
  bio?: string;
  cell_phone: number;
  cep: number;
  city: string;
  collectionId: string;
  collectionName: string;
  company_name: string;
  company_register: string;
  complement: string;
  country: string;
  created: Date;
  email: string;
  emailVisibility: boolean;
  facebook_url?: string;
  id: string;
  instagram_url?: string;
  kwai_url?: string;
  linkedin_url?: string;
  name: string;
  neighborhood: string;
  niche: string[];
  opening_date: Date;
  pinterest_url?: string;
  pix_key: string;
  profile_img?: string;
  state: string;
  street: string;
  tiktok_url?: string;
  twitch_url?: string;
  twitter_url?: string;
  updated: Date;
  username: string;
  verified: boolean;
  web_site?: string;
  yourclub_url?: string;
  youtube_url?: string;

  expand?: {
    niche?: Niche[];
  };
}