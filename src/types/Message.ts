export interface Message {
  id: string;
  chat: string;
  text: string;
  read: boolean;
  brand_sender: string;
  influencer_sender: string;
  created: Date;
  updated: Date;
}
