import SocialNetworks from "@/types/SocialNetworks";

export enum StatusFilter {
  All = "",
  Completed = "ended",
  In_Progress = "in_progress",
  Ready = "ready",
  Pending = "pending",
}

export enum ParticipationStatusFilter {
  All = "",
  Completed = "completed",
  Approved = "approved",
  Sold_out = "sold_out",
  Waiting = "waiting",
  Analysing = "analysing",
  Canceled = "canceled",
  Shop_bag = "shop_bag",
}

export enum CampaignGoalFilter {
  All = "",
  UGC = "UGC",
  IGC = "IGC",
  Both = "UGC + IGC",
}

// Create a ChannelFilter object instead of an enum
export const ChannelFilter = {
  All: "",
  ...Object.fromEntries(
    SocialNetworks.map((network) => [network.name, network.name])
  ),
} as const;

// Type for ChannelFilter to use for type-checking
export type ChannelFilterType = keyof typeof ChannelFilter;

export const NicheFilter = {
  "": "",
  wbjwvgn35jl2iu9: "Alimentação Saudável e Nutrição",
  a0ncq9dg4v7cmz9: "Arte e Cultura",
  lpm6yrf4urto14w: "Automóveis e Carros",
  "9q6bw2i19giyiia": "Beleza e Maquiagem",
  hdsi00boer6d5mg: "Casamento e Eventos",
  ivmu1hp099n1h9u: "Culinária e Receitas",
  izdgizoz6er5pxw: "Decoração e Design de Interiores",
  ijuid0vqlv5qxp4: "DIY e Faça Você Mesmo",
  hg741zthi1gqi81: "Educação e Aprendizagem",
  g6hyiz45wc2qlug: "Empreendedorismo e Negócios",
  awhq9yfj4xz05rn: "Esportes e Atletismo",
  g9srav9129qfgfy: "Filmes e Séries",
  g7kz8f7rbr7zts2: "Finanças e Investimentos",
  "2zoquwxqy7hujmz": "Fitness e Bem-Estar",
  y8gr468eaznraf8: "Fotografia e Edição de Imagens",
  "48057ll34wtwq9c": "Gaming e Jogos Eletrônicos",
  "5lhtvf2pc0hd7lb": "Gastronomia",
  "4vjhn1xc0p2tcw8": "Hobbies e Passatempos",
  c4nat015oqec63e: "LGBTQ+ e Diversidade",
  f7jk3s1zd5aguh9: "Livros e Literatura",
  "4js8of340uvwypw": "Marcas Sustentáveis e Éticas",
  ytiegnssolpy33l: "Maternidade e Paternidade",
  nyapordvvgyy0wz: "Moda e Estilo",
  o81rnpf652vh1d5: "Moda Feminina",
  gh5eezcgkees7sx: "Moda Masculina",
  "1s6wx04ogodlxru": "Música e Entretenimento",
  llwiy0i4s0mex1o: "Pet Lovers (Amantes de animais de estimação)",
  od62mqfr5b0t60u: "Saúde Mental e Bem-Estar emocional",
  i43dbddebc57fit: "Sustentabilidade e Meio Ambiente",
  "57bppfj91zexo6n": "Tecnologia e Eletrônicos",
  jhpjpepuyull7x2: "Viagens e Turismo",
};

// Type for NicheFilter to use for type-checking
export type NicheFilterType = keyof typeof NicheFilter;
