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

export interface SocialNetwork {
  name: string;
  icon: string;
  url: (data: Brand) => string | undefined;
}

export const SocialNetworks: SocialNetwork[] = [
  {
    name: "Twitch",
    icon: TwitchIcon,
    url: (data: Brand) => data.twitch_url,
  },
  {
    name: "X",
    icon: TwitterIcon,
    url: (data: Brand) => data.twitter_url,
  },
  {
    name: "Facebook",
    icon: FacebookIcon,
    url: (data: Brand) => data.facebook_url,
  },
  {
    name: "YourClub",
    icon: YourClubIcon,
    url: (data: Brand) => data.yourclub_url,
  },
  {
    name: "Kwai",
    icon: KwaiIcon,
    url: (data: Brand) => data.kwai_url,
  },
  {
    name: "Tiktok",
    icon: TiktokIcon,
    url: (data: Brand) => data.tiktok_url,
  },
  {
    name: "Pinterest",
    icon: PinterestIcon,
    url: (data: Brand) => data.pinterest_url,
  },
  {
    name: "LinkedIn",
    icon: LinkedinIcon,
    url: (data: Brand) => data.linkedin_url,
  },
  {
    name: "YouTube",
    icon: YoutubeIcon,
    url: (data: Brand) => data.youtube_url,
  },
  {
    name: "Instagram",
    icon: InstagramIcon,
    url: (data: Brand) => data.instagram_url,
  },
  // Additional networks can be added here
];

export default SocialNetworks;
