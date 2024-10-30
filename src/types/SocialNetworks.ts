import InstagramIcon from "@/assets/icons/instagram.svg";
import TiktokIcon from "@/assets/icons/tiktok.svg";
import FacebookIcon from "@/assets/icons/facebook.svg";
import { Brand } from "./Brand";

export interface SocialNetwork {
  name: string;
  icon: string;
  url: (data: Brand) => string | undefined;
}

export const SocialNetworks: SocialNetwork[] = [
  {
    name: "Instagram",
    icon: InstagramIcon,
    url: (data: Brand) => data.instagram_url,
  },
  {
    name: "TikTok",
    icon: TiktokIcon,
    url: (data: Brand) => data.tiktok_url,
  },
  {
    name: "Facebook",
    icon: FacebookIcon,
    url: (data: Brand) => data.facebook_url,
  },
  // adicionar mais redes sociais
];

export default SocialNetworks;
