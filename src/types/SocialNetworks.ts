import InstagramIcon from "@/assets/icons/brands/instagram.svg";
import TiktokIcon from "@/assets/icons/brands/tiktok.svg";
import LinkedinIcon from "@/assets/icons/brands/linkedin.svg";
import FacebookIcon from "@/assets/icons/brands/facebook.svg";
import TwitterIcon from "@/assets/icons/brands/twitter.svg";
import YoutubeIcon from "@/assets/icons/brands/youtube.svg";
import PinterestIcon from "@/assets/icons/brands/pinterest.svg";
import KwaiIcon from "@/assets/icons/brands/kwai.svg";
import TwitchIcon from "@/assets/icons/brands/twitch.svg";
import YourClubIcon from "@/assets/icons/brands/yourclub.svg";
import { Brand } from "./Brand";
import { getSocialLink } from "@/utils/getSocialLink";

export interface SocialNetwork {
  name: string;
  icon: string;
  url: (data: Brand) => string | null;
}

export const SocialNetworks: SocialNetwork[] = [
  {
    name: "Twitch",
    icon: TwitchIcon,
    url: (data: Brand) => getSocialLink("Twitch", data.twitch_url),
  },
  {
    name: "X",
    icon: TwitterIcon,
    url: (data: Brand) => getSocialLink("Twitter", data.twitter_url),
  },
  {
    name: "Facebook",
    icon: FacebookIcon,
    url: (data: Brand) => getSocialLink("Facebook", data.facebook_url),
  },
  {
    name: "YourClub",
    icon: YourClubIcon,
    url: (data: Brand) => getSocialLink("YourClub", data.yourclub_url),
  },
  {
    name: "Kwai",
    icon: KwaiIcon,
    url: (data: Brand) => getSocialLink("Kwai", data.kwai_url),
  },
  {
    name: "Tiktok",
    icon: TiktokIcon,
    url: (data: Brand) => getSocialLink("Tiktok", data.tiktok_url),
  },
  {
    name: "Pinterest",
    icon: PinterestIcon,
    url: (data: Brand) => getSocialLink("Pinterest", data.pinterest_url),
  },
  {
    name: "LinkedIn",
    icon: LinkedinIcon,
    url: (data: Brand) => getSocialLink("LinkedIn", data.linkedin_url),
  },
  {
    name: "YouTube",
    icon: YoutubeIcon,
    url: (data: Brand) => getSocialLink("YouTube", data.youtube_url),
  },
  {
    name: "Instagram",
    icon: InstagramIcon,
    url: (data: Brand) => getSocialLink("Instagram", data.instagram_url),
  },
  // Adicione outras redes sociais conforme necessário
];

export default SocialNetworks;
