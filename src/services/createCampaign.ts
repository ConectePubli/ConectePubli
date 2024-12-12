/* eslint-disable @typescript-eslint/no-explicit-any */
import Client from "pocketbase";
import { Campaign } from "@/types/Campaign";
import { UserAuth } from "@/types/UserAuth";
import { getUserData } from "@/utils/getUserData";
import { isValidEmail } from "@/utils/isValidEmail";
import { isValidURL } from "@/utils/isValidUrl";
import { Brand } from "@/types/Brand";
import React from "react";

interface CampaignData {
  basicInfo: {
    campaignName: string;
    format: string;
    coverImage: string | File | Blob;
    productUrl: string;
    briefing: string;
    mandatory_deliverables: string;
    sending_products_or_services: string;
    expected_actions: string;
    avoid_actions: string;
    additional_information: string;
    itinerary_suggestion: string;
    disseminationChannels: string | string[];
  };
  audienceSegmentation: {
    niche: string[];
    minAge: string;
    maxAge: string;
    gender: string;
    minFollowers: string;
    location: string[];
    videoMinDuration: string;
    videoMaxDuration: string;
    paidTraffic: boolean;
    paidTrafficInfo: string;
    audioFormat: "Música" | "Narração" | null;
  };
}

interface CampaignBudget {
  startDate: Date | string;
  endDate: Date | string;
  influencersCount: number;
  creatorFee: number;
}

interface ResponsibleInfo {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export const safeNavigate = (
  to: any,
  isDirty: boolean,
  setPendingNavigation: React.ComponentState,
  setShowLeaveModal: React.ComponentState,
  originalNavigate: any
) => {
  if (isDirty) {
    setPendingNavigation(to);
    setShowLeaveModal(true);
  } else {
    originalNavigate(to);
  }
};

export const populateCampaignFormData = (
  formData: FormData,
  campaignData: CampaignData,
  campaignBudget: CampaignBudget,
  responsibleInfo: ResponsibleInfo,
  userId: string | undefined,
  isEditMode: boolean
) => {
  if (userId) formData.append("brand", userId);
  formData.append("status", "draft");

  formData.append("name", campaignData.basicInfo.campaignName);
  if (campaignData.basicInfo.coverImage) {
    formData.append("cover_img", campaignData.basicInfo.coverImage);
  }
  formData.append("objective", campaignData.basicInfo.format);
  formData.append("product_url", campaignData.basicInfo.productUrl);
  formData.append("briefing", campaignData.basicInfo.briefing);
  formData.append(
    "mandatory_deliverables",
    campaignData.basicInfo.mandatory_deliverables
  );
  formData.append(
    "sending_products_or_services",
    campaignData.basicInfo.sending_products_or_services
  );
  formData.append("expected_actions", campaignData.basicInfo.expected_actions);
  formData.append("avoid_actions", campaignData.basicInfo.avoid_actions);
  formData.append(
    "additional_information",
    campaignData.basicInfo.additional_information
  );
  formData.append(
    "itinerary_suggestion",
    campaignData.basicInfo.itinerary_suggestion
  );

  if (Array.isArray(campaignData.basicInfo.disseminationChannels)) {
    campaignData.basicInfo.disseminationChannels.forEach((channel) => {
      formData.append("channels", channel);
    });
  } else {
    formData.append("channels", campaignData.basicInfo.disseminationChannels);
  }

  if (campaignData.audienceSegmentation.niche.length === 0) {
    formData.append("niche", "");
  } else {
    campaignData.audienceSegmentation.niche.forEach((nicheId) => {
      formData.append("niche", nicheId);
    });
  }
  formData.append("min_age", campaignData.audienceSegmentation.minAge);
  formData.append("max_age", campaignData.audienceSegmentation.maxAge);
  formData.append("gender", campaignData.audienceSegmentation.gender);
  formData.append(
    "min_followers",
    campaignData.audienceSegmentation.minFollowers
  );
  if (Array.isArray(campaignData.audienceSegmentation.location)) {
    if (campaignData.audienceSegmentation.location.length === 0) {
      formData.append("locality", "");
    } else {
      campaignData.audienceSegmentation.location.forEach((locate) => {
        formData.append("locality", locate);
      });
    }
  } else {
    formData.append(
      "locality",
      campaignData.audienceSegmentation.location || ""
    );
  }

  formData.append(
    "min_video_duration",
    campaignData.audienceSegmentation.videoMinDuration
  );
  formData.append(
    "max_video_duration",
    campaignData.audienceSegmentation.videoMaxDuration
  );
  formData.append(
    "paid_traffic",
    campaignData.audienceSegmentation.paidTraffic ? "true" : "false"
  );
  formData.append(
    "paid_traffic_info",
    campaignData.audienceSegmentation.paidTrafficInfo || ""
  );
  formData.append(
    "audio_format",
    campaignData.audienceSegmentation.audioFormat || ""
  );

  // Campaign budget
  formData.append("beginning", campaignBudget.startDate as string);
  formData.append("end", campaignBudget.endDate as string);
  formData.append("open_jobs", campaignBudget.influencersCount.toString());
  if (!isEditMode) {
    formData.append("price", (campaignBudget.creatorFee * 100).toString());
  }

  formData.append("responsible_name", responsibleInfo.name);
  formData.append("responsible_email", responsibleInfo.email);
  formData.append(
    "responsible_phone",
    responsibleInfo.phone.replace(/\D/g, "")
  );
  formData.append("responsible_cpf", responsibleInfo.cpf);
};

export const validateFields = (
  campaignData: CampaignData,
  campaignBudget: CampaignBudget,
  responsibleInfo: ResponsibleInfo,
  toast: any
) => {
  const missingFields: string[] = [];

  // Basic Info Section Required Fields
  if (!campaignData.basicInfo.campaignName)
    missingFields.push("Nome da Campanha");
  if (!campaignData.basicInfo.format) missingFields.push("Formato da Campanha");
  if (!campaignData.basicInfo.coverImage) missingFields.push("Foto de Capa");
  if (!campaignData.basicInfo.productUrl)
    missingFields.push("URL do Produto ou Perfil");
  if (!campaignData.basicInfo.briefing)
    missingFields.push("Briefing da Campanha");
  if (!campaignData.basicInfo.mandatory_deliverables)
    missingFields.push("Entregáveis obrigatórios");
  if (!campaignData.basicInfo.sending_products_or_services)
    missingFields.push("Envio de produtos ou serviços");
  if (!campaignData.basicInfo.expected_actions)
    missingFields.push("Ações esperadas do creator");
  if (!campaignData.basicInfo.avoid_actions)
    missingFields.push("Ações a serem evitadas do creator");
  if (!campaignData.basicInfo.additional_information)
    missingFields.push("Informações adicionais da campanha");

  // Campaign Budget Section Required Fields
  if (!campaignBudget.startDate)
    missingFields.push("Data de Início da Campanha");
  if (!campaignBudget.endDate) missingFields.push("Data de Fim da Campanha");
  if (!campaignBudget.influencersCount || campaignBudget.influencersCount <= 0)
    missingFields.push("Quantidade de Creators");
  if (!campaignBudget.creatorFee || campaignBudget.creatorFee <= 0)
    missingFields.push("Valor por Criador");

  // Responsible Info Section Required Fields
  if (!responsibleInfo.name) missingFields.push("Nome do Responsável");
  if (!responsibleInfo.email) missingFields.push("Email do Responsável");
  if (!responsibleInfo.phone) missingFields.push("Telefone do Responsável");
  if (!responsibleInfo.cpf) missingFields.push("CPF do Responsável");

  if (campaignData.audienceSegmentation.paidTraffic === null) {
    missingFields.push("Tráfego Pago");
  }

  if (
    campaignData.audienceSegmentation.paidTraffic === true &&
    !campaignData.audienceSegmentation.paidTrafficInfo
  ) {
    missingFields.push("Quais locais será veiculado? Por quantos tempo?");
  }

  if (
    campaignData.audienceSegmentation.videoMinDuration &&
    !campaignData.audienceSegmentation.videoMaxDuration
  ) {
    missingFields.push("Duração máxima do vídeo");
  }

  if (
    campaignData.audienceSegmentation.minAge &&
    !campaignData.audienceSegmentation.maxAge
  ) {
    missingFields.push("Idade máxima");
  }

  // Validate Missing Fields
  if (missingFields.length > 0) {
    const message =
      missingFields.length > 3
        ? `Campos obrigatórios não preenchidos: ${missingFields
            .slice(0, 3)
            .join(", ")}, etc.`
        : `Campos obrigatórios não preenchidos: ${missingFields.join(", ")}`;

    toast.warn(message);
    return false;
  }

  if (campaignBudget.creatorFee < 50) {
    toast.warn("O valor mínimo por criador é R$50,00.");
    return false;
  }

  if (!isValidEmail(responsibleInfo.email)) {
    toast.warn("Email do Responsável é inválido");
    return false;
  }

  if (!isValidURL(campaignData.basicInfo.productUrl)) {
    toast.warn("URL do Produto ou Perfil é inválida");
    return false;
  }

  return true;
};

export const handleSubmit = (
  campaignData: CampaignData,
  campaignBudget: CampaignBudget,
  responsibleInfo: ResponsibleInfo,
  isEditMode: boolean,
  toast: any,
  initialCampaignData: Campaign,
  setCampaignBudget: React.ComponentState,
  mutate: any
) => {
  const validation = validateFields(
    campaignData,
    campaignBudget,
    responsibleInfo,
    toast
  );

  if (!validation) {
    return;
  }

  // Ensure creatorFee consistency in edit mode
  if (isEditMode) {
    const correctCreatorFee = initialCampaignData?.price || 0;

    if (campaignBudget.creatorFee !== correctCreatorFee) {
      setCampaignBudget((prev: CampaignBudget) => ({
        ...prev,
        creatorFee: correctCreatorFee,
      }));
    }
  }

  mutate.mutate();
};

export const generateUniqueName = (
  baseName: string,
  existingNames: string[]
): string => {
  let uniqueName = "";
  let isUnique = false;

  while (!isUnique) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Número aleatório de 6 dígitos
    uniqueName = `${baseName}${randomNumber}`;
    if (!existingNames.includes(uniqueName)) {
      isUnique = true;
    }
  }

  return uniqueName;
};

export const prepareCampaignFormData = async (
  formData: FormData,
  user: ReturnType<typeof getUserData>,
  campaignData: CampaignData,
  campaignBudget: CampaignBudget,
  responsibleInfo: ResponsibleInfo,
  isNew: boolean,
  toast: any,
  pb: Client,
  isEditMode: boolean,
  currentUniqueName?: string
): Promise<void> => {
  if (!user.model.id) {
    toast.error(
      "Erro ao processar informação, por favor realize o login novamente"
    );
    throw new Error("User ID is missing");
  }

  let uniqueName = currentUniqueName;
  if (
    isNew ||
    !currentUniqueName ||
    campaignData.basicInfo.campaignName !== currentUniqueName.replace(/_/g, " ")
  ) {
    const existingUniqueNames: string[] = await pb
      .collection("Campaigns")
      .getFullList<Campaign>({ fields: "unique_name" })
      .then((campaigns: any) =>
        campaigns.map((c: { unique_name: any }) => c.unique_name)
      );

    const sanitizedName = campaignData.basicInfo.campaignName
      .replace(/[^\p{L}\p{N}\s]/gu, "") // Remove pontuações
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentuações
      .trim()
      .split(/\s+/); // Separa em palavras

    // Mantém apenas as primeiras 5 palavras
    const limitedWords = sanitizedName.slice(0, 5);

    // Junta as palavras com underscore
    const baseName = limitedWords.join("_");

    uniqueName = generateUniqueName(baseName, existingUniqueNames);
  }

  if (uniqueName) {
    formData.append("unique_name", uniqueName);
  }

  populateCampaignFormData(
    formData,
    campaignData,
    campaignBudget,
    responsibleInfo,
    isNew ? user.model.id : undefined,
    isEditMode
  );
};

export const createCampaign = async (
  user: UserAuth,
  campaignData: CampaignData,
  campaignBudget: CampaignBudget,
  responsibleInfo: ResponsibleInfo,
  toast: any,
  pb: Client,
  isEditMode: boolean
): Promise<Campaign> => {
  const formData = new FormData();
  await prepareCampaignFormData(
    formData,
    user,
    campaignData,
    campaignBudget,
    responsibleInfo,
    true,
    toast,
    pb,
    isEditMode
  );

  formData.append("paid", "false");

  const createdCampaign: Campaign = await pb
    .collection("Campaigns")
    .create(formData);
  return createdCampaign;
};

export const updateCampaign = async (
  campaignId: string,
  pb: Client,
  user: UserAuth,
  campaignData: CampaignData,
  campaignBudget: CampaignBudget,
  responsibleInfo: ResponsibleInfo,
  toast: any,
  isEditMode: boolean
): Promise<Campaign> => {
  if (!campaignId) {
    throw new Error("Campaign ID not found");
  }

  const formData = new FormData();

  const currentCampaign = await pb
    .collection("Campaigns")
    .getOne<Campaign>(campaignId);
  const currentUniqueName = currentCampaign.unique_name;

  await prepareCampaignFormData(
    formData,
    user,
    campaignData,
    campaignBudget,
    responsibleInfo,
    false,
    toast,
    pb,
    isEditMode,
    currentUniqueName
  );

  return await pb.collection("Campaigns").update(campaignId, formData);
};

export const handleSaveDraft = async (
  user: UserAuth,
  brandInfo: Brand,
  pb: Client,
  toast: any,
  setIsDirty: React.ComponentState,
  isDirty: boolean,
  setPendingNavigation: React.ComponentState,
  setShowLeaveModal: React.ComponentState,
  originalNavigate: any
) => {
  const formData = new FormData();
  formData.append("brand", user.model.id);
  formData.append("status", "draft");
  formData.append("price", "0");
  formData.append("name", `Campanha da marca ${brandInfo?.name || ""}`);

  // Caso precise de um unique_name também:
  // formData.append("unique_name", gerarUniqueName()) // implementar se necessário

  await pb.collection("Campaigns").create(formData);
  toast.success("Campanha salva como rascunho!");
  setIsDirty(false);
  safeNavigate(
    { to: "/dashboard-marca" },
    isDirty,
    setPendingNavigation,
    setShowLeaveModal,
    originalNavigate
  );
  // Redirecionar ou manter na mesma página, conforme a necessidade
};
