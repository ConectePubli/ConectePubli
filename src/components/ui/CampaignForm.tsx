/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { getUserData } from "@/utils/getUserData";
import { Question } from "phosphor-react";

import pb from "@/lib/pb";

import {
  objectiveOptions,
  genderOptions,
  channelsOptions,
  minFollowersOptions,
  minVideoDurationOptions,
  maxVideoDurationOptions,
} from "@/utils/campaignData/labels";
import { channelIcons } from "@/utils/socialMediasIcons";
import {
  createCampaign,
  generateUniqueName,
  handleSubmit,
  safeNavigate,
  updateCampaign,
  validateFields,
} from "@/services/createCampaign";

import { Niche } from "@/types/Niche";
import { Campaign } from "@/types/Campaign";

import { Button } from "./button";
import FloatingHelpButton from "./FloatingHelpButton";
import { ArrowLeft, File, Save } from "lucide-react";
import { formatCentsToCurrency } from "@/utils/formatCentsToCurrency";
import CampaignSpotlight from "./CampaignSpotlight";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const minAgeOptions = Array.from({ length: 65 }, (_, i) => ({
  label: (i + 18).toString(),
  value: (i + 18).toString(),
}));

const maxAgeOptions = Array.from({ length: 65 }, (_, i) => ({
  label: (i + 18).toString(),
  value: (i + 18).toString(),
}));

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
    address: string;
  };
}

interface CampaignBudget {
  startSuscriptionDate: Date | string;
  endSubscriptionDate: Date | string;
  startDate: Date | string;
  endDate: Date | string;
  creatorFee: number;
}

interface ResponsibleInfo {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface CampaignFormProps {
  campaignId?: string;
  initialCampaignData?: Campaign;
  campaignIdDraft?: string;
}

interface SpotlightCampaign {
  state: boolean;
  campaign: Campaign | null;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
  campaignId,
  initialCampaignData,
  campaignIdDraft,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const originalNavigate = navigate;

  const isEditMode = Boolean(campaignId);
  const [isDraft] = useState(initialCampaignData?.status === "draft");
  const [campaignIdDraftState] = useState(campaignIdDraft);

  const [loadingCreate, setLoadingCreate] = useState(false);

  const [spotlightCampaignPlans, setSpotlightCampaignPlans] =
    useState<SpotlightCampaign>({
      state: false,
      campaign: null,
    });

  const [campaignData, setCampaignData] = useState<CampaignData>({
    basicInfo: {
      campaignName: "",
      format: "UGC",
      productUrl: "",
      coverImage: "",
      briefing: "",
      mandatory_deliverables: "",
      sending_products_or_services: "",
      expected_actions: "",
      avoid_actions: "",
      additional_information: "",
      itinerary_suggestion: "",
      disseminationChannels: [],
    },
    audienceSegmentation: {
      niche: [],
      minAge: "",
      maxAge: "",
      gender: "",
      minFollowers: "",
      location: [],
      videoMinDuration: "",
      videoMaxDuration: "",
      paidTraffic: false,
      paidTrafficInfo: "",
      audioFormat: null,
      address: "",
    },
  });

  const [campaignBudget, setCampaignBudget] = useState<CampaignBudget>({
    startSuscriptionDate: "",
    endSubscriptionDate: "",
    startDate: "",
    endDate: "",
    creatorFee: 0,
  });

  const [responsibleInfo, setResponsibleInfo] = useState<ResponsibleInfo>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
  });

  // control navigation
  const [isDirty, setIsDirty] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Logo após preencher os estados com initialCampaignData:
  const [initialCampaignDataState, setInitialCampaignDataState] =
    useState<CampaignData | null>(null);
  const [initialCampaignBudgetState, setInitialCampaignBudgetState] =
    useState<CampaignBudget | null>(null);
  const [initialResponsibleInfoState, setInitialResponsibleInfoState] =
    useState<ResponsibleInfo | null>(null);

  useEffect(() => {
    if (!isEditMode) {
      window.history.pushState({ antiBack: true }, "", window.location.href);
    }
  }, []);

  useEffect(() => {
    if (isDraft && initialCampaignData) {
      console.log(initialCampaignData);
      setCampaignData({
        basicInfo: {
          campaignName: initialCampaignData.name || "",
          format: initialCampaignData.objective || "UGC",
          productUrl: initialCampaignData.product_url || "",
          coverImage: initialCampaignData.cover_img || "",
          briefing: initialCampaignData.briefing || "",
          mandatory_deliverables:
            initialCampaignData.mandatory_deliverables || "",
          sending_products_or_services:
            initialCampaignData.sending_products_or_services || "",
          expected_actions: initialCampaignData.expected_actions || "",
          avoid_actions: initialCampaignData.avoid_actions || "",
          additional_information:
            initialCampaignData.additional_information || "",
          itinerary_suggestion: initialCampaignData.itinerary_suggestion || "",
          disseminationChannels: initialCampaignData.channels || [],
        },
        audienceSegmentation: {
          niche: initialCampaignData.niche || [],
          minAge: initialCampaignData.min_age?.toString() || "",
          maxAge: initialCampaignData.max_age?.toString() || "",
          gender: initialCampaignData.gender || "",
          minFollowers: initialCampaignData.min_followers?.toString() || "",
          location: initialCampaignData.locality || [],
          videoMinDuration: initialCampaignData.min_video_duration || "",
          videoMaxDuration: initialCampaignData.max_video_duration || "",
          paidTraffic: initialCampaignData.paid_traffic || false,
          paidTrafficInfo: initialCampaignData.paid_traffic_info || "",
          audioFormat: initialCampaignData.audio_format || null,
          address: initialCampaignData.address || "",
        },
      });

      setCampaignBudget({
        startSuscriptionDate: initialCampaignData.subscription_start_date || "",
        endSubscriptionDate: initialCampaignData.subscription_end_date || "",
        startDate: initialCampaignData.beginning || "",
        endDate: initialCampaignData.end || "",
        creatorFee: initialCampaignData.price || 0,
      });

      setResponsibleInfo({
        name: initialCampaignData.responsible_name || "",
        email: initialCampaignData.responsible_email || "",
        phone: initialCampaignData.responsible_phone?.toString() || "",
        cpf: initialCampaignData.responsible_cpf || "",
      });

      // Guardar os estados iniciais para comparação de 'isDirty'
      setInitialCampaignDataState(
        initialCampaignData as unknown as CampaignData
      );
      setInitialCampaignBudgetState({
        startSuscriptionDate: initialCampaignData.subscription_start_date || "",
        endSubscriptionDate: initialCampaignData.subscription_end_date || "",
        startDate: initialCampaignData.beginning || "",
        endDate: initialCampaignData.end || "",
        creatorFee: initialCampaignData.price || 0,
      });
      setInitialResponsibleInfoState({
        name: initialCampaignData.responsible_name || "",
        email: initialCampaignData.responsible_email || "",
        phone: initialCampaignData.responsible_phone?.toString() || "",
        cpf: initialCampaignData.responsible_cpf || "",
      });
    }
  }, []);

  useEffect(() => {
    if (isEditMode && initialCampaignData && !initialCampaignDataState) {
      setInitialCampaignDataState(JSON.parse(JSON.stringify(campaignData)));
      setInitialCampaignBudgetState(JSON.parse(JSON.stringify(campaignBudget)));
      setInitialResponsibleInfoState(
        JSON.parse(JSON.stringify(responsibleInfo))
      );
    } else if (!isEditMode && !initialCampaignDataState) {
      // Campanha nova
      setInitialCampaignDataState(JSON.parse(JSON.stringify(campaignData)));
      setInitialCampaignBudgetState(JSON.parse(JSON.stringify(campaignBudget)));
      setInitialResponsibleInfoState(
        JSON.parse(JSON.stringify(responsibleInfo))
      );
    }
  }, [
    isEditMode,
    initialCampaignData,
    campaignData,
    campaignBudget,
    responsibleInfo,
  ]);

  useEffect(() => {
    if (
      initialCampaignDataState &&
      initialCampaignBudgetState &&
      initialResponsibleInfoState
    ) {
      const isSameData =
        JSON.stringify(campaignData) ===
        JSON.stringify(initialCampaignDataState);
      const isSameBudget =
        JSON.stringify(campaignBudget) ===
        JSON.stringify(initialCampaignBudgetState);
      const isSameResponsible =
        JSON.stringify(responsibleInfo) ===
        JSON.stringify(initialResponsibleInfoState);

      setIsDirty(!(isSameData && isSameBudget && isSameResponsible));
    }
  }, [
    campaignData,
    campaignBudget,
    responsibleInfo,
    initialCampaignDataState,
    initialCampaignBudgetState,
    initialResponsibleInfoState,
  ]);

  useEffect(() => {
    if (!isEditMode) {
      const handlePopState = () => {
        if (isDirty) {
          window.history.pushState(
            { antiBack: true },
            "",
            window.location.href
          );
          setShowLeaveModal(true);
          setPendingNavigation({ to: "/dashboard" } as any);
        } else {
          safeNavigate(
            { to: "/dashboard-marca" },
            isDirty,
            setPendingNavigation,
            setShowLeaveModal,
            originalNavigate
          );
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isDirty]);

  useEffect(() => {
    if (!isEditMode) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (isDirty) {
          e.preventDefault();
          e.returnValue =
            "Você tem dados não salvos, se recarregar vai perder tudo. Deseja recarregar?";
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [isDirty]);

  const isFormReadyForAI = useMemo(() => {
    const { basicInfo } = campaignData;
    if (!basicInfo.campaignName) return false;
    if (!basicInfo.expected_actions) return false;
    if (!basicInfo.avoid_actions) return false;
    if (!basicInfo.additional_information) return false;
    return true;
  }, [campaignData]);

  const generateBriefingViaIA = async (): Promise<string> => {
    function mapIdsToLabels(nicheIds: string[], allNiches?: Niche[]) {
      if (!allNiches) return [];

      return allNiches
        .filter((n) => nicheIds.includes(n.id))
        .map((n) => n.niche);
    }

    const nicheLabels = mapIdsToLabels(
      campaignData.audienceSegmentation.niche,
      niches
    );

    const flag = i18n.language;

    const response = await fetch(
      "https://v7consultpro.com/django/api/gerar-briefing",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_campanha: campaignData.basicInfo.campaignName,
          publico_alvo: nicheLabels,
          formato_conteudo: campaignData.audienceSegmentation.audioFormat,
          canal_divulgacao: campaignData.basicInfo.disseminationChannels,
          acoes_esperadas: campaignData.basicInfo.expected_actions,
          additionalInformation: campaignData.basicInfo.additional_information,
          comportamentos_indesejados: campaignData.basicInfo.avoid_actions,
          flag: flag,
        }),
      }
    );

    if (!response.ok) throw new Error("Erro ao gerar briefing");

    const data = await response.json();
    return data.briefing;
  };

  useEffect(() => {
    if (isEditMode && initialCampaignData) {
      setCampaignData({
        basicInfo: {
          campaignName: initialCampaignData.name || "",
          format: initialCampaignData.objective || "UGC",
          productUrl: initialCampaignData.product_url || "",
          coverImage: initialCampaignData.cover_img || "",
          briefing: initialCampaignData.briefing || "",
          mandatory_deliverables:
            initialCampaignData.mandatory_deliverables || "",
          sending_products_or_services:
            initialCampaignData.sending_products_or_services || "",
          expected_actions: initialCampaignData.expected_actions || "",
          avoid_actions: initialCampaignData.avoid_actions || "",
          additional_information:
            initialCampaignData.additional_information || "",
          itinerary_suggestion: initialCampaignData.itinerary_suggestion || "",
          disseminationChannels: initialCampaignData.channels || [],
        },
        audienceSegmentation: {
          niche: initialCampaignData.niche || [],
          minAge: initialCampaignData.min_age?.toString() || "",
          maxAge: initialCampaignData.max_age?.toString() || "",
          gender: initialCampaignData.gender || "",
          minFollowers: initialCampaignData.min_followers?.toString() || "",
          location: initialCampaignData.locality || [],
          videoMinDuration: initialCampaignData.min_video_duration || "",
          videoMaxDuration: initialCampaignData.max_video_duration || "",
          paidTraffic: initialCampaignData.paid_traffic || false,
          paidTrafficInfo: initialCampaignData.paid_traffic_info || "",
          audioFormat: initialCampaignData.audio_format || null,
          address: initialCampaignData.address || "",
        },
      });

      setCampaignBudget({
        startSuscriptionDate: initialCampaignData.subscription_start_date || "",
        endSubscriptionDate: initialCampaignData.subscription_end_date || "",
        startDate: initialCampaignData.beginning || "",
        endDate: initialCampaignData.end || "",
        creatorFee: initialCampaignData.price || 0,
      });

      setResponsibleInfo({
        name: initialCampaignData.responsible_name || "",
        email: initialCampaignData.responsible_email || "",
        phone: initialCampaignData.responsible_phone?.toString() || "",
        cpf: initialCampaignData.responsible_cpf || "",
      });
    }
  }, [isEditMode, initialCampaignData]);

  const { data: niches, isLoading: nichesLoading } = useQuery<Niche[]>({
    queryKey: ["niches"],
    queryFn: async () => {
      const records = await pb.collection("Niches").getFullList<Niche>();
      return records;
    },
  });

  const user = getUserData();

  const { data: brandInfo, isLoading: brandLoading } = useQuery({
    queryKey: ["brandInfo", user.model.id],
    queryFn: async () => {
      return await pb.collection("Brands").getOne(user.model.id);
    },
  });

  useEffect(() => {
    if (!brandLoading && brandInfo) {
      const requiredFields = [
        "name",
        "email",
        "bio",
        "company_register",
        "street",
        "country",
        "cep",
        "city",
        "state",
        "cell_phone",
        "pix_key",
      ];
      const missingFields = requiredFields.filter((field) => !brandInfo[field]);

      const hasSomeNetworkMedias =
        brandInfo.instagram_url !== "" ||
        brandInfo.youtube_url !== "" ||
        brandInfo.tiktok_url !== "" ||
        brandInfo.pinterest_url !== "" ||
        brandInfo.kwai_url !== "" ||
        brandInfo.yourclub_url !== "" ||
        brandInfo.facebook_url !== "" ||
        brandInfo.twitter_url !== "" ||
        brandInfo.twitch_url !== "" ||
        brandInfo.linkedin_url !== "";

      if (
        missingFields.length > 0 ||
        (brandInfo.niche && brandInfo.niche.length <= 0) ||
        !hasSomeNetworkMedias
      ) {
        const username = user.model.username;
        safeNavigate(
          {
            to: `/marca/${username}/editar?from=CreateCampaign&error=MissingData`,
          },
          isDirty,
          setPendingNavigation,
          setShowLeaveModal,
          originalNavigate
        );
      }
    }
  }, [brandLoading, brandInfo, user.model.username]);

  const mutate = useMutation<Campaign, Error, void>({
    mutationFn: isEditMode
      ? () =>
          updateCampaign(
            campaignId as string,
            pb,
            user,
            campaignData,
            campaignBudget,
            responsibleInfo,
            toast
          )
      : () =>
          createCampaign(
            user,
            campaignData,
            campaignBudget,
            responsibleInfo,
            toast,
            pb
          ),
    onSuccess: async (createdCampaign: Campaign) => {
      if (isEditMode) {
        toast.success(t("Campanha atualizada com sucesso!"));
        navigate({
          to: "/dashboard/campanhas/$campaignId/aprovar",
          params: { campaignId },
        });
      } else {
        toast.success(t("Campanha criada com sucesso!"));

        setIsDirty(false);

        console.log(createdCampaign);

        if (createdCampaign) {
          setSpotlightCampaignPlans({
            ...spotlightCampaignPlans,
            state: true,
            campaign: createdCampaign,
          });
        }
      }
    },
    onError: (e) => {
      console.log(e);
      toast.error(t("Erro ao criar a campanha. Tente novamente."));
    },
  });

  const saveDraftMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      const campaignName =
        campaignData.basicInfo.campaignName.trim() !== ""
          ? campaignData.basicInfo.campaignName
          : t("Campanha do(a) {{brand}}", {
              brand: brandInfo?.name || t("Sua Marca"),
            });

      const creatorFee = campaignBudget.creatorFee
        ? campaignBudget.creatorFee
        : 0;

      let uniqueName = campaignData.basicInfo.campaignName;

      const existingUniqueNames: string[] = await pb
        .collection("Campaigns")
        .getFullList<Campaign>({ fields: "unique_name" })
        .then((campaigns: any) =>
          campaigns.map((c: { unique_name: any }) => c.unique_name)
        );

      const sanitizedName = campaignData.basicInfo.campaignName
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .split(/\s+/);

      const limitedWords = sanitizedName.slice(0, 5);

      const baseName = limitedWords.join("_");

      uniqueName = generateUniqueName(baseName, existingUniqueNames);

      const draftData = {
        name: campaignName,
        price: creatorFee,
        brand: brandInfo?.id,
        objective: campaignData.basicInfo.format,
        product_url: campaignData.basicInfo.productUrl,
        cover_img: campaignData.basicInfo.coverImage,
        briefing: campaignData.basicInfo.briefing,
        mandatory_deliverables: campaignData.basicInfo.mandatory_deliverables,
        sending_products_or_services:
          campaignData.basicInfo.sending_products_or_services,
        expected_actions: campaignData.basicInfo.expected_actions,
        avoid_actions: campaignData.basicInfo.avoid_actions,
        additional_information: campaignData.basicInfo.additional_information,
        itinerary_suggestion: campaignData.basicInfo.itinerary_suggestion,
        channels: campaignData.basicInfo.disseminationChannels,
        niche: campaignData.audienceSegmentation.niche,
        min_age: campaignData.audienceSegmentation.minAge,
        max_age: campaignData.audienceSegmentation.maxAge,
        gender: campaignData.audienceSegmentation.gender,
        min_followers: campaignData.audienceSegmentation.minFollowers,
        address: campaignData.audienceSegmentation.address,
        min_video_duration: campaignData.audienceSegmentation.videoMinDuration,
        max_video_duration: campaignData.audienceSegmentation.videoMaxDuration,
        paid_traffic: campaignData.audienceSegmentation.paidTraffic,
        paid_traffic_info: campaignData.audienceSegmentation.paidTrafficInfo,
        audio_format: campaignData.audienceSegmentation.audioFormat,
        subscription_start_date: campaignBudget.startSuscriptionDate,
        subscription_end_date: campaignBudget.endSubscriptionDate,
        beginning: campaignBudget.startDate,
        end: campaignBudget.endDate,
        responsible_name: responsibleInfo.name,
        responsible_email: responsibleInfo.email,
        responsible_phone: responsibleInfo.phone.replace(/\D/g, ""),
        responsible_cpf: responsibleInfo.cpf,
        status: "draft",
        unique_name: uniqueName,
      };

      if (isDraft && campaignIdDraftState) {
        await pb
          .collection("Campaigns")
          .update(campaignIdDraftState, draftData);
      } else {
        await pb.collection("Campaigns").create(draftData);
      }
    },
    onSuccess: () => {
      toast.success(t("Rascunho salvo com sucesso!"));

      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      console.error("Erro ao salvar o rascunho:", error);
      toast.error(t("Erro ao salvar o rascunho. Tente novamente."));
    },
  });

  const handleFinalSubmit = async () => {
    const isValid = validateFields(
      campaignData,
      campaignBudget,
      responsibleInfo,
      toast
    );
    if (!isValid) {
      return;
    }

    setIsDirty(false);

    // atualizar rascunho final da campanha com os ultimos dados
    if (isDraft && campaignIdDraftState) {
      try {
        setLoadingCreate(true);

        let uniqueName = campaignData.basicInfo.campaignName;

        const existingUniqueNames: string[] = await pb
          .collection("Campaigns")
          .getFullList<Campaign>({ fields: "unique_name" })
          .then((campaigns: any) =>
            campaigns.map((c: { unique_name: any }) => c.unique_name)
          );

        const sanitizedName = campaignData.basicInfo.campaignName
          .replace(/[^\p{L}\p{N}\s]/gu, "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim()
          .split(/\s+/);

        const limitedWords = sanitizedName.slice(0, 5);

        const baseName = limitedWords.join("_");

        uniqueName = generateUniqueName(baseName, existingUniqueNames);

        const draftData = {
          name: campaignData.basicInfo.campaignName,
          price: campaignBudget.creatorFee,
          brand: brandInfo?.id,
          objective: campaignData.basicInfo.format,
          product_url: campaignData.basicInfo.productUrl,
          cover_img: campaignData.basicInfo.coverImage,
          briefing: campaignData.basicInfo.briefing,
          mandatory_deliverables: campaignData.basicInfo.mandatory_deliverables,
          sending_products_or_services:
            campaignData.basicInfo.sending_products_or_services,
          expected_actions: campaignData.basicInfo.expected_actions,
          avoid_actions: campaignData.basicInfo.avoid_actions,
          additional_information: campaignData.basicInfo.additional_information,
          itinerary_suggestion: campaignData.basicInfo.itinerary_suggestion,
          channels: campaignData.basicInfo.disseminationChannels,
          niche: campaignData.audienceSegmentation.niche,
          min_age: campaignData.audienceSegmentation.minAge,
          max_age: campaignData.audienceSegmentation.maxAge,
          gender: campaignData.audienceSegmentation.gender,
          min_followers: campaignData.audienceSegmentation.minFollowers,
          address: campaignData.audienceSegmentation.address,
          min_video_duration:
            campaignData.audienceSegmentation.videoMinDuration,
          max_video_duration:
            campaignData.audienceSegmentation.videoMaxDuration,
          paid_traffic: campaignData.audienceSegmentation.paidTraffic,
          paid_traffic_info: campaignData.audienceSegmentation.paidTrafficInfo,
          audio_format: campaignData.audienceSegmentation.audioFormat,
          subscription_start_date: campaignBudget.startSuscriptionDate,
          subscription_end_date: campaignBudget.endSubscriptionDate,
          beginning: campaignBudget.startDate,
          end: campaignBudget.endDate,
          responsible_name: responsibleInfo.name,
          responsible_email: responsibleInfo.email,
          responsible_phone: responsibleInfo.phone.replace(/\D/g, ""),
          responsible_cpf: responsibleInfo.cpf,
          status: "ready",
          unique_name: uniqueName,
        };

        const record: Campaign = await pb
          .collection("Campaigns")
          .update(campaignIdDraftState, draftData);

        setSpotlightCampaignPlans({
          ...spotlightCampaignPlans,
          state: true,
          campaign: record as Campaign,
        });
      } catch (e) {
        toast.error(t("Erro ao salvar campanha: ") + e);
      }
    } else {
      handleSubmit(
        campaignData,
        campaignBudget,
        responsibleInfo,
        toast,
        mutate
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!spotlightCampaignPlans.state && (
        <>
          {showLeaveModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-md w-full max-w-xl mx-4">
                <h2 className="text-lg font-semibold">
                  {t("Você tem dados não salvos, deseja realmente sair?")}
                </h2>
                <p className="mt-4 text-sm text-gray-900">
                  {t(
                    "Sair da tela de criação de campanha sem salvar os dados pode fazer você perder todo o progresso feito até agora."
                  )}
                </p>
                <p className="mt-2 text-sm text-gray-900">
                  {t(
                    "Para garantir que suas informações estejam seguras e você não precise começar do zero, clique em 'Salvar como Rascunho' antes de sair. Assim, você pode continuar de onde parou, sem preocupações! 🚀"
                  )}
                </p>
                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={() => setShowLeaveModal(false)}
                    className="text-sm text-gray-800 flex items-center space-x-1"
                  >
                    <ArrowLeft className="" />
                    <span>{t("Voltar a Campanha")}</span>
                  </button>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setIsDirty(false);
                        setShowLeaveModal(false);
                        if (pendingNavigation) {
                          originalNavigate(pendingNavigation);
                          setPendingNavigation(null);
                        } else {
                          window.location.href = "/";
                        }
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded text-sm"
                    >
                      {t("Sair")}
                    </button>
                    <Button
                      variant={"blue"}
                      onClick={() => {
                        saveDraftMutation.mutate();
                      }}
                      className="px-4 py-2 text-white rounded text-sm"
                    >
                      {saveDraftMutation.isPending
                        ? t("Salvando...")
                        : t("Salvar como Rascunho")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isDirty && !isEditMode && (
            <div className="my-4 w-full flex justify-end px-10">
              <Button
                variant={"orange"}
                onClick={() => {
                  saveDraftMutation.mutate();
                }}
              >
                {saveDraftMutation.isPending ? (
                  t("Salvando...")
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t(" Salvar como rascunho")}
                  </>
                )}
              </Button>
            </div>
          )}

          <BasicInfoSection
            data={campaignData.basicInfo}
            onChange={(data) => {
              setCampaignData((prev) => ({ ...prev, basicInfo: data }));
              setIsDirty(true);
            }}
            initialCampaignData={initialCampaignData as Campaign}
            isEditMode={isEditMode}
            isDraft={isDraft}
          />

          <AudienceSegmentationSection
            data={campaignData.audienceSegmentation}
            onChange={(data) => {
              setCampaignData((prev) => ({
                ...prev,
                audienceSegmentation: data,
              }));
              setIsDirty(true);
            }}
            niches={niches}
            nichesLoading={nichesLoading}
          />

          <CampaignBudgetSection
            startSuscriptionDate={campaignBudget.startSuscriptionDate}
            endSubscriptionDate={campaignBudget.endSubscriptionDate}
            startDate={campaignBudget.startDate}
            endDate={campaignBudget.endDate}
            creatorFee={campaignBudget.creatorFee}
            onChange={(data) => {
              setCampaignBudget(data);
              setIsDirty(true);
            }}
            isEditMode={isEditMode}
          />

          <BriefingSection
            briefing={campaignData.basicInfo.briefing}
            onChange={(newVal) => {
              setCampaignData((prev) => ({
                ...prev,
                basicInfo: {
                  ...prev.basicInfo,
                  briefing: newVal,
                },
              }));
              setIsDirty(true);
            }}
            isFormReadyForAI={isFormReadyForAI}
            generateBriefingViaIA={generateBriefingViaIA}
          />

          <ResponsibleInfoSection
            data={responsibleInfo}
            onChange={(e) => {
              setResponsibleInfo(e);
              setIsDirty(true);
            }}
          />

          <div className="px-5 w-full flex justify-center">
            <Button
              variant={"blue"}
              onClick={() => {
                handleFinalSubmit();
              }}
              className="w-auto min-w-[200px] text-white py-2 px-5 rounded-md mt-6 mb-8"
              disabled={mutate.isPending || loadingCreate}
            >
              {mutate.isPending || loadingCreate
                ? t("Carregando...")
                : isEditMode
                  ? t("Atualizar Campanha")
                  : t("Publicar campanha")}
            </Button>
          </div>

          {!isEditMode && <FloatingHelpButton />}
        </>
      )}

      {spotlightCampaignPlans.state === true &&
        spotlightCampaignPlans.campaign && (
          <CampaignSpotlight
            campaign={spotlightCampaignPlans.campaign as Campaign}
          />
        )}

      <ToastContainer />
    </div>
  );
};

type BasicInfoSectionProps = {
  data: CampaignData["basicInfo"];
  onChange: (data: CampaignData["basicInfo"]) => void;
  initialCampaignData: Campaign;
  isEditMode: boolean;
  isDraft: boolean;
};

function isBlobOrFile(value: unknown): value is Blob | File {
  return value instanceof Blob || value instanceof File;
}

function BasicInfoSection({
  data,
  onChange,
  initialCampaignData,
  isEditMode,
  isDraft,
}: BasicInfoSectionProps) {
  const { t } = useTranslation();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Estados para tooltips
  const [tooltipOpenFormat, setTooltipOpenFormat] = useState(false);
  const [tooltipOpenURL, setTooltipOpenURL] = useState(false);
  const [tooltipOpenChannels, setTooltipOpenChannels] = useState(false);
  const [tooltipOpenDeliverables, setTooltipOpenDeliverables] = useState(false);
  const [tooltipOpenSending, setTooltipOpenSending] = useState(false);
  const [tooltipOpenExpectedActions, setTooltipOpenExpectedActions] =
    useState(false);
  const [tooltipOpenAvoidActions, setTooltipOpenAvoidActions] = useState(false);
  const [tooltipOpenAdditionalInfo, setTooltipOpenAdditionalInfo] =
    useState(false);
  const [tooltipOpenSuggestion, setTooltipOpenSuggestion] = useState(false);

  // Referências para tooltips
  const tooltipRefFormat = useRef<HTMLDivElement>(null);
  const tooltipRefURL = useRef<HTMLDivElement>(null);
  const tooltipRefChannels = useRef<HTMLDivElement>(null);
  const tooltipRefDeliverables = useRef<HTMLDivElement>(null);
  const tooltipRefSending = useRef<HTMLDivElement>(null);
  const tooltipRefExpectedActions = useRef<HTMLDivElement>(null);
  const tooltipRefAvoidActions = useRef<HTMLDivElement>(null);
  const tooltipRefAdditionalInfo = useRef<HTMLDivElement>(null);
  const tooltipRefSuggestion = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRefFormat.current &&
        !tooltipRefFormat.current.contains(event.target as Node)
      ) {
        setTooltipOpenFormat(false);
      }
      if (
        tooltipRefURL.current &&
        !tooltipRefURL.current.contains(event.target as Node)
      ) {
        setTooltipOpenURL(false);
      }
      if (
        tooltipRefChannels.current &&
        !tooltipRefChannels.current.contains(event.target as Node)
      ) {
        setTooltipOpenChannels(false);
      }
      if (
        tooltipRefDeliverables.current &&
        !tooltipRefDeliverables.current.contains(event.target as Node)
      ) {
        setTooltipOpenDeliverables(false);
      }
      if (
        tooltipRefSending.current &&
        !tooltipRefSending.current.contains(event.target as Node)
      ) {
        setTooltipOpenSending(false);
      }
      if (
        tooltipRefExpectedActions.current &&
        !tooltipRefExpectedActions.current.contains(event.target as Node)
      ) {
        setTooltipOpenExpectedActions(false);
      }
      if (
        tooltipRefAvoidActions.current &&
        !tooltipRefAvoidActions.current.contains(event.target as Node)
      ) {
        setTooltipOpenAvoidActions(false);
      }
      if (
        tooltipRefAdditionalInfo.current &&
        !tooltipRefAdditionalInfo.current.contains(event.target as Node)
      ) {
        setTooltipOpenAdditionalInfo(false);
      }
      if (
        tooltipRefSuggestion.current &&
        !tooltipRefSuggestion.current.contains(event.target as Node)
      ) {
        setTooltipOpenSuggestion(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log(data);
    if (data.coverImage) {
      if (typeof data.coverImage === "string") {
        if ((isEditMode || isDraft) && initialCampaignData?.cover_img) {
          const imageUrl = `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${initialCampaignData?.collectionId}/${initialCampaignData?.id}/${initialCampaignData?.cover_img}`;
          setImagePreviewUrl(imageUrl);
        }
      } else if (isBlobOrFile(data.coverImage)) {
        const objectUrl = URL.createObjectURL(data.coverImage);
        setImagePreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setImagePreviewUrl(null);
    }
  }, [data.coverImage, isEditMode, initialCampaignData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value,
    });
  };

  const handleFormatChange = (format: string) => {
    onChange({
      ...data,
      format,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange({
        ...data,
        coverImage: e.target.files[0],
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange({
        ...data,
        coverImage: e.dataTransfer.files[0],
      });
    }
  };

  const toggleChannel = (channelValue: string) => {
    const currentChannels = Array.isArray(data.disseminationChannels)
      ? data.disseminationChannels
      : data.disseminationChannels
        ? [data.disseminationChannels]
        : [];

    const updatedChannels = currentChannels.includes(channelValue)
      ? currentChannels.filter((ch) => ch !== channelValue)
      : [...currentChannels, channelValue];

    onChange({
      ...data,
      disseminationChannels: updatedChannels,
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-medium text-white mb-6 bg-[#10438F] py-2 px-5">
        {t("Informações Básicas da Campanha")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 px-5">
        <div>
          <div className="mb-8">
            <label className="block mb-1 text-gray-700 font-semibold">
              {t("Nome da campanha*")}
            </label>
            <p className="text-gray-500 text-sm mb-2">
              {t(
                "O nome é a primeira informação que os criadores de conteúdo visualizam."
              )}
            </p>
            <input
              type="text"
              name="campaignName"
              value={data.campaignName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("Nome da campanha")}
            />
          </div>

          <div className="mb-8">
            <label className="block mb-1 text-gray-700 font-semibold flex items-center ">
              {t("URL do seu site ou perfil no Instagram*")}
              <div className="relative inline-block">
                <Question
                  size={18}
                  color="#00f"
                  className="ml-2 min-w-[2rem] cursor-pointer"
                  onClick={() => {
                    setTooltipOpenURL(!tooltipOpenURL);
                  }}
                />
                {tooltipOpenURL && (
                  <div
                    ref={tooltipRefURL}
                    className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                    style={{
                      top: "100%",
                      left: "-100%",
                      transform: "translateX(-80%)",
                      width: "300px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <p className="text-gray-700 font-normal">
                      {t(
                        "Insira o Instagram ou site para que os candidatos possam conhecer a sua marca."
                      )}
                    </p>
                  </div>
                )}
              </div>
            </label>
            <p className="text-gray-500 text-sm mb-2">
              {t(
                "Compartilhe a URL do seu site ou perfil do Instagram para que os criadores conheçam mais sobre você"
              )}{" "}
            </p>
            <input
              type="url"
              name="productUrl"
              value={data.productUrl || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("Insira a URL")}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold flex items-center">
              {t("Formato da campanha*")}{" "}
              <div className="relative inline-block">
                <Question
                  size={18}
                  color="#00f"
                  className="ml-2 min-w-[2rem] cursor-pointer"
                  onClick={() => {
                    setTooltipOpenFormat(!tooltipOpenFormat);
                  }}
                />
                {tooltipOpenFormat && (
                  <div
                    ref={tooltipRefFormat}
                    className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                    style={{
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "300px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <p className="text-gray-700 font-normal">
                      <strong>UGC:</strong>
                      {t(
                        " O criador de conteúdo te fornece o vídeo ou fotos para que você poste nas suas redes sociais, depoimentos em site e/ou rode anúncios de tráfego pago."
                      )}
                    </p>
                    <p className="text-gray-700 mt-2 font-normal">
                      <strong>IGC:</strong>
                      {t(
                        " O criador de conteúdo posta o vídeo ou fotos nas redes sociais dele em collab com a marca."
                      )}
                    </p>
                  </div>
                )}
              </div>
            </label>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              {objectiveOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFormatChange(option.value)}
                  className={`flex-1 px-4 py-2 border rounded-md ${
                    data.format === option.value
                      ? "border-2 border-blue-500 text-blue-500"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-2">
              {data.format === "UGC"
                ? t(
                    "UGC (Creators): O criador de conteúdo fornece o vídeo para você postar nas suas redes sociais ou usar em anúncios."
                  )
                : data.format === "IGC"
                  ? t(
                      "IGC (Nano, Micro e Macro influenciadores): O criador de conteúdo posta o vídeo diretamente nas redes sociais dele, promovendo a marca para os seguidores de forma autêntica e engajada."
                    )
                  : t(
                      "UGC + IGC: O criador de conteúdo fornece o vídeo para sua marca usar em campanhas publicitárias e também publica o conteúdo em suas próprias redes sociais, amplificando a visibilidade e alcance da campanha."
                    )}
            </p>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block mb-2 text-gray-700 font-semibold">
            {t("Foto de capa*")}
          </label>
          <div
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-[200px] cursor-pointer overflow-hidden"
            onClick={() => document.getElementById("coverImage")?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleImageUpload}
              className="hidden"
              id="coverImage"
              accept="image/*"
            />
            {!imagePreviewUrl ? (
              <p className="text-blue-500">
                {t("Carregue ou arraste e solte")}
              </p>
            ) : (
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <p className="text-gray-500 mt-2 text-sm">
            {t(
              "Tamanho recomendado: 1200x628px para garantir melhor qualidade."
            )}
          </p>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="col-span-2">
            <label className="block mb-1 text-gray-700 font-semibold flex items-center">
              {t("Canais de divulgação")}
              <div className="relative inline-block">
                <Question
                  size={18}
                  color="#00f"
                  className="ml-2 min-w-[2rem] cursor-pointer"
                  onClick={() => {
                    setTooltipOpenChannels(!tooltipOpenChannels);
                  }}
                />
                {tooltipOpenChannels && (
                  <div
                    ref={tooltipRefChannels}
                    className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                    style={{
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "300px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <p className="text-gray-700 font-normal">
                      {t(
                        "Selecione as redes sociais em que o conteúdo será vinculado."
                      )}
                    </p>
                  </div>
                )}
              </div>
            </label>

            <p className="text-gray-500 text-sm mb-2">
              {t(
                "Selecione os canais de divulgação que o influencer poste obrigatoriamente (somente para IGC)"
              )}
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              {channelsOptions.map((channel) => (
                <button
                  key={channel.value}
                  onClick={() => toggleChannel(channel.value)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-md ${
                    data.disseminationChannels.includes(channel.value)
                      ? "border-2 border-blue-500 text-blue-500"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  <img
                    src={
                      channelIcons[channel.value as keyof typeof channelIcons]
                    }
                    alt={`${channel.label} icon`}
                    className="w-5 h-5"
                  />
                  {channel.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block mb-1 text-gray-700 font-semibold flex items-center">
                {t(
                  "Entregáveis Obrigatórios (Especifique a quantidade e o tipo de conteúdos que o Creator deve produzir)*"
                )}
                <div className="relative inline-block">
                  <Question
                    size={18}
                    color="#00f"
                    className="ml-2 min-w-[2rem] cursor-pointer"
                    onClick={() => {
                      setTooltipOpenDeliverables(!tooltipOpenDeliverables);
                    }}
                  />
                  {tooltipOpenDeliverables && (
                    <div
                      ref={tooltipRefDeliverables}
                      className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                      style={{
                        top: "100%",
                        left: "-100%",
                        transform: "translateX(-80%)",
                        width: "300px",
                        marginTop: "0.5rem",
                      }}
                    >
                      <p className="text-gray-700 font-normal">
                        {
                          "Especifique a quantidade e o tipo de conteúdos que o Creator deve produzir. Inclua Reels, Stories, Posts no feed, vídeos ou fotos entregues via WeTransfer ou Google Drive, detalhando a quantidade e duração para uso em tráfego orgânico e pago. Adicione outros formatos necessários, se houver."
                        }
                      </p>
                    </div>
                  )}
                </div>
              </label>
              <p className="text-gray-500 text-sm mb-2">
                {t(
                  "Informe o tipo de conteúdo necessário (Reels, Stories, Posts), a quantidade e a duração aproximada de cada um."
                )}
              </p>
              <textarea
                name="mandatory_deliverables"
                value={data.mandatory_deliverables || ""}
                onChange={handleInputChange}
                className="w-full h-[120px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t(
                  "(Escopo) - Especifique os tipos de conteúdo, quantidades e duração (ex.: 1 Reels de 30s, 3 Stories)"
                )}
              />
            </div>
          </div>

          <div className="col-span-1 mt-6">
            <label className="block mb-1 text-gray-700 font-semibold flex items-center">
              {t(
                "Envio de Produtos ou Serviços (Detalhe o processo de envio)*"
              )}
              <div className="relative inline-block">
                <Question
                  size={18}
                  color="#00f"
                  className="ml-2 min-w-[2rem] cursor-pointer"
                  onClick={() => {
                    setTooltipOpenSending(!tooltipOpenSending);
                  }}
                />
                {tooltipOpenSending && (
                  <div
                    ref={tooltipRefSending}
                    className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                    style={{
                      top: "100%",
                      left: "-100%",
                      transform: "translateX(-80%)",
                      width: "300px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <p className="text-gray-700 font-normal">
                      {t(
                        "Detalhe o processo de envio, incluindo a descrição dos produtos ou serviços envolvidos e os prazos previstos para envio e recebimento."
                      )}
                    </p>
                  </div>
                )}
              </div>
            </label>
            <p className="text-gray-500 text-sm mb-2">
              {t(
                "Informe quais produtos ou serviços serão fornecidos, com detalhes de envio e prazos."
              )}
            </p>
            <textarea
              name="sending_products_or_services"
              value={data.sending_products_or_services || ""}
              onChange={handleInputChange}
              className="w-full h-[120px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t(
                "Descreva os itens enviados e o prazo para entrega"
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="col-span-1">
              <label className="block mb-1 text-gray-700 font-semibold flex items-center">
                {t("Ações Esperadas do Creator (Do's)*")}
                <div className="relative inline-block">
                  <Question
                    size={18}
                    color="#00f"
                    className="ml-2 cursor-pointer"
                    onClick={() => {
                      setTooltipOpenExpectedActions(
                        !tooltipOpenExpectedActions
                      );
                    }}
                  />
                  {tooltipOpenExpectedActions && (
                    <div
                      ref={tooltipRefExpectedActions}
                      className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                      style={{
                        top: "100%",
                        left: "-100%",
                        transform: "translateX(-80%)",
                        width: "300px",
                        marginTop: "0.5rem",
                      }}
                    >
                      <p className="text-gray-700 font-normal">
                        {t(
                          "Liste as ações e comportamentos que o Creator deve adotar durante a execução da campanha."
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </label>
              <p className="text-gray-500 text-sm mb-2">
                {t(
                  "Descreva comportamentos e práticas desejadas pelo Creator."
                )}
              </p>
              <textarea
                name="expected_actions"
                value={data.expected_actions || ""}
                onChange={handleInputChange}
                className="w-full h-[120px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t(
                  "Exemplo: Publicar conteúdos semanais, interagir com os seguidores, compartilhar insights sobre a campanha, colocar CTA, marcar o @ da marca nas redes sociais, usar hashtags específicos."
                )}
              />
            </div>

            <div className="col-span-1">
              <label className="block mb-1 text-gray-700 font-semibold flex items-center">
                {t("Ações a Serem Evitadas (Don'ts)*")}
                <div className="relative inline-block">
                  <Question
                    size={18}
                    color="#00f"
                    className="ml-2 cursor-pointer"
                    onClick={() => {
                      setTooltipOpenAvoidActions(!tooltipOpenAvoidActions);
                    }}
                  />
                  {tooltipOpenAvoidActions && (
                    <div
                      ref={tooltipRefAvoidActions}
                      className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                      style={{
                        top: "100%",
                        left: "-100%",
                        transform: "translateX(-80%)",
                        width: "300px",
                        marginTop: "0.5rem",
                      }}
                    >
                      <p className="text-gray-700 font-normal">
                        {t(
                          "Especifique ações e comportamentos que o Creator deve evitar para atender às expectativas da marca."
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </label>
              <p className="text-gray-500 text-sm mb-2">
                {t("Detalhe comportamentos indesejados ou proibidos.")}
              </p>
              <textarea
                name="avoid_actions"
                value={data.avoid_actions || ""}
                onChange={handleInputChange}
                className="w-full h-[120px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t(
                  "Exemplo: Evitar linguagem ofensiva, não divulgar informações confidenciais, não promover marcas concorrentes"
                )}
              />
            </div>
          </div>

          <div className="col-span-1 mt-6">
            <label className="block mb-1 text-gray-700 font-semibold flex items-center">
              {t("Informações Adicionais*")}
              <div className="relative inline-block">
                <Question
                  size={18}
                  color="#00f"
                  className="ml-2 min-w-[1rem] cursor-pointer"
                  onClick={() => {
                    setTooltipOpenAdditionalInfo(!tooltipOpenAdditionalInfo);
                  }}
                />
                {tooltipOpenAdditionalInfo && (
                  <div
                    ref={tooltipRefAdditionalInfo}
                    className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                    style={{
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "300px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <p className="text-gray-700 font-normal">
                      {t(
                        "Inclua informações relevantes, como prazos de entrega dos conteúdos, exigências de exclusividade durante a campanha, e quaisquer restrições ou orientações específicas."
                      )}
                    </p>
                  </div>
                )}
              </div>
            </label>
            <p className="text-gray-500 text-sm mb-2">
              {t(
                "Inclua qualquer outra informação que possa ajudar os criadores a entender melhor a campanha."
              )}
            </p>
            <textarea
              name="additional_information"
              value={data.additional_information || ""}
              onChange={handleInputChange}
              className="w-full h-[120px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t(
                "Exemplo: Diretrizes específicas, referências, detalhes adicionais"
              )}
            />
          </div>

          <div className="mt-4">
            <p className="text-gray-700 font-semibold italic">
              {t(
                "Observações: Todos os campos acima são obrigatórios para garantir que o Creator tenha uma compreensão completa das expectativas da marca. Certifique-se de fornecer informações claras e detalhadas em cada campo para evitar ambiguidades."
              )}
            </p>
          </div>

          <div className="col-span-1 mt-6">
            <label className="block mb-1 text-gray-700 font-semibold flex items-center">
              {t("Sugestão de roteiro (opcional)")}
              <div className="relative inline-block">
                <Question
                  size={18}
                  color="#00f"
                  className="ml-2 min-w-[1rem] cursor-pointer"
                  onClick={() => {
                    setTooltipOpenSuggestion(!tooltipOpenSuggestion);
                  }}
                />
                {tooltipOpenSuggestion && (
                  <div
                    ref={tooltipRefSuggestion}
                    className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                    style={{
                      top: "100%",
                      left: "-100%",
                      transform: "translateX(-50%)",
                      width: "300px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <p className="text-gray-700 font-normal">
                      {t(
                        "Este campo é reservado para marcas que desejam sugerir um roteiro para o influencer. Caso prefira dar liberdade criativa ao influencer, deixe este campo em branco."
                      )}
                    </p>
                  </div>
                )}
              </div>
            </label>
            <p className="text-gray-500 text-sm mb-2">
              {t(
                "Utilize este campo para oferecer um guia criativo ao influencer. Caso prefira dar liberdade total, deixe em branco."
              )}
            </p>
            <textarea
              name="itinerary_suggestion"
              value={data.itinerary_suggestion || ""}
              onChange={handleInputChange}
              className="w-full h-[120px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t(
                "Exemplo: Sugestão de uma sequência de ideias, tópicos ou cenas a serem exploradas no vídeo."
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type AudienceSegmentationSectionProps = {
  data: CampaignData["audienceSegmentation"];
  onChange: (data: CampaignData["audienceSegmentation"]) => void;
  niches: Niche[] | undefined;
  nichesLoading: boolean;
};

function AudienceSegmentationSection({
  data,
  onChange,
  niches,
  nichesLoading,
}: AudienceSegmentationSectionProps) {
  const { t } = useTranslation();
  const [nicheOptions, setNicheOptions] = useState<Niche[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<Niche[]>([]);

  const [nicheDropdownOpen, setNicheDropdownOpen] = useState(false);

  const nicheDropdownRef = useRef<HTMLDivElement>(null);

  // Estados para tooltips
  const [tooltipOpenNiche, setTooltipOpenNiche] = useState(false);
  const [tooltipOpenAge, setTooltipOpenAge] = useState(false);
  const [tooltipOpenGender, setTooltipOpenGender] = useState(false);
  const [tooltipOpenMinFollowers, setTooltipOpenMinFollowers] = useState(false);
  const [tooltipOpenLocality, setTooltipOpenLocality] = useState(false);
  const [tooltipOpenVideoDuration, setTooltipOpenVideoDuration] =
    useState(false);
  const [tooltipOpenFormatAudio, setTooltipOpenFormatAudio] = useState(false);

  // Referências para tooltips
  const tooltipRefNiche = useRef<HTMLDivElement>(null);
  const tooltipRefAge = useRef<HTMLDivElement>(null);
  const tooltipRefGender = useRef<HTMLDivElement>(null);
  const tooltipRefMinFollowers = useRef<HTMLDivElement>(null);
  const tooltipRefLocality = useRef<HTMLDivElement>(null);
  const tooltipRefVideoDuration = useRef<HTMLDivElement>(null);
  const tooltipRefFormatAudio = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRefNiche.current &&
        !tooltipRefNiche.current.contains(event.target as Node)
      ) {
        setTooltipOpenNiche(false);
      }

      if (
        tooltipRefAge.current &&
        !tooltipRefAge.current.contains(event.target as Node)
      ) {
        setTooltipOpenAge(false);
      }

      if (
        tooltipRefGender.current &&
        !tooltipRefGender.current.contains(event.target as Node)
      ) {
        setTooltipOpenGender(false);
      }

      if (
        tooltipRefMinFollowers.current &&
        !tooltipRefMinFollowers.current.contains(event.target as Node)
      ) {
        setTooltipOpenMinFollowers(false);
      }

      if (
        tooltipRefLocality.current &&
        !tooltipRefLocality.current.contains(event.target as Node)
      ) {
        setTooltipOpenLocality(false);
      }

      if (
        tooltipRefVideoDuration.current &&
        !tooltipRefVideoDuration.current.contains(event.target as Node)
      ) {
        setTooltipOpenVideoDuration(false);
      }

      if (
        tooltipRefFormatAudio.current &&
        !tooltipRefFormatAudio.current.contains(event.target as Node)
      ) {
        setTooltipOpenFormatAudio(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const convertDurationToSeconds = (duration: string): number => {
    const [value, unit] = duration.split(" ");
    const numericValue = parseInt(value, 10);

    if (unit.startsWith("segundo")) {
      return numericValue; // segundos
    } else if (unit.startsWith("minuto")) {
      return numericValue * 60; // minutos para segundos
    }
    return 0;
  };

  useEffect(() => {
    if (niches && data.niche.length > 0) {
      const preSelectedNiches = niches.filter((niche) =>
        data.niche.includes(niche.id)
      );
      setSelectedNiches(preSelectedNiches);

      const availableNiches = niches.filter(
        (niche) => !data.niche.includes(niche.id)
      );
      setNicheOptions(availableNiches);
    } else if (niches) {
      setNicheOptions(niches);
    }
  }, [niches, data.niche]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        nicheDropdownRef.current &&
        !nicheDropdownRef.current.contains(event.target as Node)
      ) {
        setNicheDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNicheSelect = (niche: Niche) => {
    setSelectedNiches([...selectedNiches, niche]);
    setNicheOptions(nicheOptions.filter((n) => n.id !== niche.id));
    onChange({
      ...data,
      niche: [...data.niche, niche.id],
    });
  };

  const handleNicheRemove = (niche: Niche) => {
    setSelectedNiches(selectedNiches.filter((n) => n.id !== niche.id));
    setNicheOptions([...nicheOptions, niche]);
    onChange({
      ...data,
      niche: data.niche.filter((id: string) => id !== niche.id),
    });
  };

  const toggleNicheDropdown = () => {
    setNicheDropdownOpen((prev) => !prev);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    const updatedData = {
      ...data,
      [name]: value,
    };

    if (name === "minAge" && value === "") {
      updatedData.maxAge = "";
    }

    if (name === "videoMinDuration" && value === "") {
      updatedData.videoMaxDuration = "";
    }

    onChange(updatedData);
  };

  const handleToggleChange = (
    field: "audioFormat" | "paidTraffic",
    value: boolean | string
  ) => {
    const newValue = data[field] === value ? null : value;
    onChange({
      ...data,
      [field]: newValue,
    });
  };

  const [maxVideoDurationOptionsFiltered, setMaxVideoDurationOptionsFiltered] =
    useState(maxVideoDurationOptions);

  useEffect(() => {
    if (data.videoMinDuration) {
      const minDurationSeconds = convertDurationToSeconds(
        data.videoMinDuration
      );

      // Filtrar as opções de duração máxima com base na duração mínima
      const filteredMaxOptions = maxVideoDurationOptions.filter((option) => {
        const optionDuration = convertDurationToSeconds(option.value);
        return optionDuration >= minDurationSeconds;
      });

      setMaxVideoDurationOptionsFiltered(filteredMaxOptions);

      // Verificar se a duração máxima atual é menor que a mínima selecionada
      if (data.videoMaxDuration) {
        const currentMaxDuration = convertDurationToSeconds(
          data.videoMaxDuration
        );
        if (currentMaxDuration < minDurationSeconds) {
          onChange({
            ...data,
            videoMaxDuration: "", // Resetar o valor máximo
          });
        }
      }
    } else {
      setMaxVideoDurationOptionsFiltered(maxVideoDurationOptions);
    }
  }, [data.videoMinDuration, data.videoMaxDuration, onChange, data]);

  return (
    <div className="w-full mt-8">
      <h2 className="text-lg font-medium text-white mb-6 bg-[#10438F] py-2 px-5">
        {t("Segmentação do Público e Especificações")}
      </h2>

      {/* Updated grid classes for responsiveness */}
      <div className="grid grid-cols-1 gap-6 px-5 mb-6">
        <div className="mb-4 relative">
          <label className="block mb-2 text-gray-700 font-semibold flex items-center">
            {t("Nicho (opcional)")}
            <div className="relative inline-block">
              <Question
                size={18}
                color="#00f"
                className="ml-2 min-w-[2rem] cursor-pointer"
                onClick={() => {
                  setTooltipOpenNiche(!tooltipOpenNiche);
                }}
              />

              {tooltipOpenNiche && (
                <div
                  ref={tooltipRefNiche}
                  className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                  style={{
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "300px",
                    marginTop: "0.5rem",
                  }}
                >
                  <p className="text-gray-700 font-normal">
                    {t(
                      "Escolha quais nichos de criadores de conteúdo fazem mais sentido para essa campanha."
                    )}
                  </p>
                </div>
              )}
            </div>
          </label>
          <div className="relative" ref={nicheDropdownRef}>
            <button
              type="button"
              onClick={toggleNicheDropdown}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
            >
              {selectedNiches.length > 0
                ? `${selectedNiches.length} ${t("nicho(s) selecionado(s)")}`
                : t("Selecionar nichos")}
            </button>
            {nicheDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                {nichesLoading ? (
                  <div className="px-4 py-2">{t("Carregando...")}</div>
                ) : nicheOptions.length > 0 ? (
                  nicheOptions.map((niche) => (
                    <div
                      key={niche.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleNicheSelect(niche)}
                    >
                      {t(niche.niche)}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    {t("Todas os nichos foram selecionados")}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedNiches.map((niche) => (
              <span
                key={niche.id}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
              >
                {t(niche.niche)}
                <button
                  type="button"
                  className="ml-2 text-blue-500"
                  onClick={() => handleNicheRemove(niche)}
                >
                  x
                </button>
              </span>
            ))}
          </div>
          <p className="text-gray-500 mt-2">
            {t(
              "Escolha quais nichos de criadores de conteúdo fazem mais sentido para essa campanha."
            )}
          </p>
        </div>

        {/* Adjusted grid for age and gender */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-2 text-gray-700 font-semibold flex items-center">
              {t("Idade (opcional)")}
              <div className="relative inline-block">
                <Question
                  size={18}
                  color="#00f"
                  className="ml-2 min-w-[2rem] cursor-pointer"
                  onClick={() => {
                    setTooltipOpenAge(!tooltipOpenAge);
                  }}
                />

                {tooltipOpenAge && (
                  <div
                    ref={tooltipRefAge}
                    className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                    style={{
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "300px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <p className="text-gray-700 font-normal">
                      {t(
                        "Qual a idade mínima e máxima que os candidatos devem ter."
                      )}
                    </p>
                  </div>
                )}
              </div>
            </label>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <select
                name="minAge"
                value={data.minAge}
                onChange={handleInputChange}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" hidden>
                  {t("Mínimo")}
                </option>

                {data.minAge && <option value="">{t("Desmarcar")}</option>}

                {minAgeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                name="maxAge"
                value={data.maxAge}
                onChange={handleInputChange}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!data.minAge}
              >
                <option value="" hidden>
                  {t("Máximo")}
                </option>
                {maxAgeOptions.map((option) => {
                  if (
                    Number(option.label) >= Number(data.minAge) ||
                    !data.minAge
                  ) {
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
            <p className="text-gray-500 mt-2">
              {t("Qual a idade mínima e máxima que os candidatos devem ter.")}
            </p>
          </div>

          <div className="col-span-1">
            <label className="block mb-2 text-gray-700 font-semibold flex items-center">
              {t("Gênero (opcional)")}
              <div className="relative inline-block">
                <Question
                  size={18}
                  color="#00f"
                  className="ml-2 min-w-[2rem] cursor-pointer"
                  onClick={() => {
                    setTooltipOpenGender(!tooltipOpenGender);
                  }}
                />

                {tooltipOpenGender && (
                  <div
                    ref={tooltipRefGender}
                    className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                    style={{
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "300px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <p className="text-gray-700 font-normal">
                      {t(
                        "Selecione o gênero que melhor representa o público-alvo da sua campanha."
                      )}
                    </p>
                  </div>
                )}
              </div>
            </label>
            <select
              name="gender"
              value={data.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" hidden>
                {t("Selecionar gênero")}
              </option>

              {data.gender && <option value="">{t("Desmarcar")}</option>}

              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
            <p className="text-gray-500 mt-2">{t("Gênero dos creators.")}</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-gray-700 font-semibold flex items-center">
            {t("Mínimo de Seguidores (opcional)")}
            <div className="relative inline-block">
              <Question
                size={18}
                color="#00f"
                className="ml-2 min-w-[2rem] cursor-pointer"
                onClick={() => {
                  setTooltipOpenMinFollowers(!tooltipOpenMinFollowers);
                }}
              />

              {tooltipOpenMinFollowers && (
                <div
                  ref={tooltipRefMinFollowers}
                  className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                  style={{
                    top: "100%",
                    left: "-50%",
                    transform: "translateX(-80%)",
                    width: "300px",
                    marginTop: "0.5rem",
                  }}
                >
                  <p className="text-gray-700 font-normal">
                    {t(
                      "Defina o número mínimo de seguidores em todas as redes sociais que os influencers devem ter para participar da campanha."
                    )}
                  </p>
                </div>
              )}
            </div>
          </label>
          <select
            name="minFollowers"
            value={data.minFollowers}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" hidden>
              {t("Selecionar mínimo de seguidores")}
            </option>

            {data.minFollowers && <option value="">Desmarcar</option>}

            {minFollowersOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 relative">
          <label className="block mb-2 text-gray-700 font-semibold flex items-center">
            {t("Localidade (opcional)")}
            <div className="relative inline-block">
              <Question
                size={18}
                color="#00f"
                className="ml-2 min-w-[2rem] cursor-pointer"
                onClick={() => {
                  setTooltipOpenLocality(!tooltipOpenLocality);
                }}
              />

              {tooltipOpenLocality && (
                <div
                  ref={tooltipRefLocality}
                  className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                  style={{
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "300px",
                    marginTop: "0.5rem",
                  }}
                >
                  <p className="text-gray-700 font-normal">
                    {t(
                      "Defina de quais estados você gostaria de receber candidatos."
                    )}
                  </p>
                </div>
              )}
            </div>
          </label>

          <input
            type="text"
            name="address"
            value={data.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("Estado, cidade, bairro")}
          />

          <p className="text-gray-500 text-sm mt-2">
            {t(
              "Insira o estado, cidade e bairro que o creator deve se candidatar"
            )}
          </p>
        </div>

        <div className="col-span-1 md:col-span-2 gap-0 grid grid-cols-1 md:grid-cols-2 md:gap-4">
          <div>
            <label className="block mb-2 text-gray-700 font-semibold flex items-center">
              {t("Duração do vídeo (opcional)")}
              <div className="relative inline-block">
                <Question
                  size={18}
                  color="#00f"
                  className="ml-2 min-w-[2rem] cursor-pointer"
                  onClick={() => {
                    setTooltipOpenVideoDuration(!tooltipOpenVideoDuration);
                  }}
                />

                {tooltipOpenVideoDuration && (
                  <div
                    ref={tooltipRefVideoDuration}
                    className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                    style={{
                      top: "100%",
                      left: "-50%",
                      transform: "translateX(-50%)",
                      width: "300px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <p className="text-gray-700 font-normal">
                      {t("Informe qual o tempo mínimo que o vídeo deve durar.")}
                    </p>
                  </div>
                )}
              </div>
            </label>
            <select
              name="videoMinDuration"
              value={data.videoMinDuration}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" hidden>
                {t("Mínimo")}
              </option>

              {data.videoMinDuration && <option value="">Desmarcar</option>}

              {minVideoDurationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold invisible">
              {t("Duração do vídeo")}
            </label>
            <select
              name="videoMaxDuration"
              value={data.videoMaxDuration}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!data.videoMinDuration}
            >
              <option value="" hidden>
                {t("Máximo")}
              </option>
              {maxVideoDurationOptionsFiltered.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              {t("Pretende utilizar o material para tráfego pago (anúncios)?*")}
            </label>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <button
                type="button"
                onClick={() => handleToggleChange("paidTraffic", false)}
                className={`flex-1 px-4 py-2 border rounded-md ${
                  data.paidTraffic === false
                    ? "border-2 border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                {t("Não")}
              </button>
              <button
                type="button"
                onClick={() => handleToggleChange("paidTraffic", true)}
                className={`flex-1 px-4 py-2 border rounded-md ${
                  data.paidTraffic === true
                    ? "border-2 border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                {t("Sim")}
              </button>
            </div>
            <p className="text-gray-500 mt-2">
              {t(
                "Tráfego pago: Anúncios na Meta Ads, Tiktok Ads, Google ou Ecommerce. Tráfego orgânico: Veicular os conteúdos em qualquer rede social de sua escolha."
              )}
            </p>
          </div>

          {data.paidTraffic && (
            <div>
              <label className="block mb-2 text-gray-700 font-semibold mt-4">
                {t("Quais locais será veiculado? Por quantos tempo?*")}
              </label>

              <textarea
                name="paidTrafficInfo"
                value={data.paidTrafficInfo || ""}
                onChange={handleInputChange}
                className="w-full h-[120px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("Ex: 3 meses, 4 meses")}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-semibold flex items-center">
            {t("Formato do áudio (opcional)")}
            <div className="relative inline-block">
              <Question
                size={18}
                color="#00f"
                className="ml-2 min-w-[2rem] cursor-pointer"
                onClick={() => {
                  setTooltipOpenFormatAudio(!tooltipOpenFormatAudio);
                }}
              />

              {tooltipOpenFormatAudio && (
                <div
                  ref={tooltipRefFormatAudio}
                  className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                  style={{
                    top: "100%",
                    left: "-50%",
                    transform: "translateX(-50%)",
                    width: "300px",
                    marginTop: "0.5rem",
                  }}
                >
                  <p className="text-gray-700 font-normal">
                    {t(
                      "Escolha se o vídeo deve ser criado com uma música de fundo ou se o é necessário que o criador de conteúdo narre o vídeo."
                    )}
                  </p>
                </div>
              )}
            </div>
          </label>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <button
              type="button"
              onClick={() => handleToggleChange("audioFormat", "Música")}
              className={`flex-1 px-4 py-2 border rounded-md ${
                data.audioFormat === "Música"
                  ? "border-2 border-blue-500 text-blue-500"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              {t("Música")}
            </button>
            <button
              type="button"
              onClick={() => handleToggleChange("audioFormat", "Narração")}
              className={`flex-1 px-4 py-2 border rounded-md ${
                data.audioFormat === "Narração"
                  ? "border-2 border-blue-500 text-blue-500"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              {t("Narração")}
            </button>
          </div>
          <p className="text-gray-500 mt-2">
            {t(
              "Como você gostaria? Escolha se o vídeo deve ser criado com uma música de fundo ou se é necessário que o criador de conteúdo narre o vídeo."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

type CampaignBudgetSectionProps = {
  startSuscriptionDate: Date | string;
  endSubscriptionDate: Date | string;
  startDate: Date | string;
  endDate: Date | string;
  creatorFee: number;
  onChange: (data: CampaignBudget) => void;
  isEditMode: boolean;
};

function CampaignBudgetSection({
  startSuscriptionDate,
  endSubscriptionDate,
  startDate,
  endDate,
  creatorFee,
  onChange,
  isEditMode,
}: CampaignBudgetSectionProps) {
  const { t } = useTranslation();
  const [today, setToday] = useState("");
  const [creatorFeeError, setCreatorFeeError] = useState("");

  // Estados para tooltips
  const [tooltipOpenStartDate, setTooltipOpenStartDate] = useState(false);
  const [tooltipOpenFinalDate, setTooltipOpenFinalDate] = useState(false);
  const [tooltipOpenPrice, setTooltipOpenPrice] = useState(false);

  // Referências para tooltips
  const tooltipRefStartDate = useRef<HTMLDivElement>(null);
  const tooltipRefFinalDate = useRef<HTMLDivElement>(null);
  const tooltipRefPrice = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRefStartDate.current &&
        !tooltipRefStartDate.current.contains(event.target as Node)
      ) {
        setTooltipOpenStartDate(false);
      }

      if (
        tooltipRefFinalDate.current &&
        !tooltipRefFinalDate.current.contains(event.target as Node)
      ) {
        setTooltipOpenFinalDate(false);
      }

      if (
        tooltipRefPrice.current &&
        !tooltipRefPrice.current.contains(event.target as Node)
      ) {
        setTooltipOpenPrice(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    setToday(`${year}-${month}-${day}`);
  }, []);

  // Helper function to format the date as "yyyy-MM-dd"
  const formatDate = (dateValue: string | number | Date) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    // Use UTC methods to extract the year, month, and day
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "creatorFee") {
      const digits = value.replace(/\D/g, "");
      const numberValue = parseFloat(digits);

      if (numberValue / 100 < 50) {
        setCreatorFeeError(t("O valor mínimo por criador é R$50,00."));
      } else {
        setCreatorFeeError("");
      }

      onChange({
        ...{
          startSuscriptionDate,
          endSubscriptionDate,
          startDate,
          endDate,
          creatorFee,
        },
        creatorFee: isNaN(numberValue) ? 0 : numberValue,
      });
    } else if (name === "influencersCount") {
      onChange({
        ...{
          startSuscriptionDate,
          endSubscriptionDate,
          startDate,
          endDate,
          creatorFee,
        },
      });
    } else if (name === "startSuscriptionDate") {
      const newStartDate = value;
      const newEndDate =
        endDate && endDate < newStartDate ? newStartDate : endDate;

      onChange({
        startSuscriptionDate: newStartDate,
        endSubscriptionDate: newEndDate,
        startDate: startDate,
        endDate: endDate,
        creatorFee,
      });
    } else if (name === "endSubscriptionDate") {
      onChange({
        startSuscriptionDate,
        endSubscriptionDate: value,
        startDate: startDate,
        endDate: endDate,
        creatorFee,
      });
    } else if (name === "startDate") {
      const newStartDate = value;
      const newEndDate =
        endDate && endDate < newStartDate ? newStartDate : endDate;

      onChange({
        startSuscriptionDate: startSuscriptionDate,
        endSubscriptionDate: endSubscriptionDate,
        startDate: newStartDate,
        endDate: newEndDate,
        creatorFee,
      });
    } else if (name === "endDate") {
      onChange({
        startSuscriptionDate: startSuscriptionDate,
        endSubscriptionDate: endSubscriptionDate,
        startDate,
        endDate: value,
        creatorFee,
      });
    }
  };

  return (
    <div className="w-full mt-8">
      <h2 className="text-lg font-medium text-white mb-6 bg-[#10438F] py-2 px-5">
        {t("Período da Campanha e Orçamento")}
      </h2>

      <div className="flex flex-col px-5">
        <p className="font-semibold text-gray-700 mb-1">
          {t("Prazo das inscrições")}*
        </p>
        <p className="text-gray-500 text-sm mb-3">
          {t(
            "Este é o prazo para os Creators se candidatarem à campanha. Após a data final, as inscrições serão automaticamente encerradas"
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 mb-6">
        <div>
          <label className="block mb-2 text-gray-700 font-semibold flex items-center">
            {t("Data de Início*")}
          </label>
          <input
            type="date"
            name="startSuscriptionDate"
            value={
              startSuscriptionDate
                ? formatDate(startSuscriptionDate as string)
                : ""
            }
            onChange={handleInputChange}
            min={today}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-semibold flex items-center">
            {t("Fim das Inscrições")}*
          </label>
          <input
            type="date"
            name="endSubscriptionDate"
            value={
              endSubscriptionDate
                ? formatDate(endSubscriptionDate as string)
                : ""
            }
            onChange={handleInputChange}
            min={(startSuscriptionDate as string) || today}
            disabled={!startSuscriptionDate}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col px-5">
        <p className="font-semibold text-gray-700 mb-1">
          {t("Prazo da campanha")}*
        </p>
        <p className="text-gray-500 text-sm mb-3">
          {t(
            "Este é o período que o creator tem para produzir e entregar o material para a Marca. A data final é o prazo limite de entrega"
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 mb-6">
        <div>
          <label className="block mb-2 text-gray-700 font-semibold flex items-center">
            {t("Data de Início*")}
            <div className="relative inline-block">
              <Question
                size={18}
                color="#00f"
                className="ml-2 min-w-[2rem] cursor-pointer"
                onClick={() => {
                  setTooltipOpenStartDate(!tooltipOpenStartDate);
                }}
              />

              {tooltipOpenStartDate && (
                <div
                  ref={tooltipRefStartDate}
                  className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                  style={{
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "300px",
                    marginTop: "0.5rem",
                  }}
                >
                  <p className="text-gray-700 font-normal">
                    {t(
                      "Informe a data em que você deseja que a campanha seja iniciada."
                    )}
                  </p>
                </div>
              )}
            </div>
          </label>
          <input
            type="date"
            name="startDate"
            value={startDate ? formatDate(startDate as string) : ""}
            onChange={handleInputChange}
            min={today}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-semibold flex items-center">
            {t("Fim da Campanha*")}
            <div className="relative inline-block">
              <Question
                size={18}
                color="#00f"
                className="ml-2 min-w-[2rem] cursor-pointer"
                onClick={() => {
                  setTooltipOpenFinalDate(!tooltipOpenFinalDate);
                }}
              />

              {tooltipOpenFinalDate && (
                <div
                  ref={tooltipRefFinalDate}
                  className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                  style={{
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "300px",
                    marginTop: "0.5rem",
                  }}
                >
                  <p className="text-gray-700 font-normal">
                    {t(
                      "Informe a data em que você deseja que a campanha seja encerrada."
                    )}
                  </p>
                </div>
              )}
            </div>
          </label>
          <input
            type="date"
            name="endDate"
            value={endDate ? formatDate(endDate as string) : ""}
            onChange={handleInputChange}
            min={(startDate as string) || today}
            disabled={!startDate}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="px-5 mb-3">
        <label className="block mb-1 text-gray-700 font-semibold flex items-center">
          {t("Valor por criador*")}
          <div className="relative inline-block">
            <Question
              size={18}
              color="#00f"
              className="ml-2 min-w-[2rem] cursor-pointer"
              onClick={() => {
                setTooltipOpenPrice(!tooltipOpenPrice);
              }}
            />

            {tooltipOpenPrice && (
              <div
                ref={tooltipRefPrice}
                className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                style={{
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "300px",
                  marginTop: "0.5rem",
                }}
              >
                <p className="text-gray-700 font-normal">
                  {t(
                    "Informe o valor que cada criador de conteúdo receberá pela realização das atividades previstas na campanha. O valor mínimo por criador é de R$ 50,00. (Lembre-se de colocar um valor de acordo com os entregáveis que a marca está pedindo)."
                  )}
                </p>
              </div>
            )}
          </div>
        </label>
        <p className="text-gray-500 text-sm mb-2">
          {t(
            "Insira o valor que cada criador de conteúdo receberá pela realização das atividades previstas na campanha, independente do número de entregas ou portagens. Valor mínimo: R$50,00 por criador. Esse valor representa o total que cada criador receberá ao concluir sua participação completa na campanha"
          )}
        </p>
        <input
          type="text"
          name="creatorFee"
          value={creatorFee ? formatCentsToCurrency(creatorFee) : ""}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Exemplo: R$500,00"
        />
        {creatorFeeError && creatorFee !== 0 && (
          <p className="text-red-500 text-sm mt-2">{creatorFeeError}</p>
        )}
      </div>

      {!isEditMode && (
        <p className="px-5 mt-2 text-gray-700 italic">
          {t(
            "O pagamento da campanha deverá ser realizado somente após a marca selecionar e aprovar todos os creators que deseja incluir na campanha. O valor será calculado com base na multiplicação do valor definido por creator, informado no campo acima, pelo número de creators aprovados. Após a confirmação do pagamento, a campanha será iniciada conforme o planejamento aprovado. Nota: Caso algum influenciador não cumpra os requisitos ou ocorra algum problema comprovado, você poderá receber 100% do reembolso correspondente ao valor pago por esse influenciador."
          )}
        </p>
      )}
    </div>
  );
}

interface BriefingSectionProps {
  briefing: string;
  onChange: (newBriefing: string) => void;
  isFormReadyForAI: boolean;
  generateBriefingViaIA: () => Promise<string>;
}

export const BriefingSection: React.FC<BriefingSectionProps> = ({
  briefing,
  onChange,
  isFormReadyForAI,
  generateBriefingViaIA,
}) => {
  const [tooltipOpenBriefing, setTooltipOpenBriefing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const tooltipRefBriefing = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRefBriefing.current &&
        !tooltipRefBriefing.current.contains(event.target as Node)
      ) {
        setTooltipOpenBriefing(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBriefingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleGenerateWithAI = async () => {
    if (briefing.length > 0) {
      const userConfirmed = window.confirm(
        "O campo de texto será limpo. Deseja continuar?"
      );

      if (!userConfirmed) {
        return;
      }
    }

    try {
      onChange("");

      setIsGenerating(true);

      const newBriefing = await generateBriefingViaIA();
      onChange(newBriefing);

      toast.success("Briefing gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar briefing com IA");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full mt-8">
      <h2 className="text-lg font-medium text-white mb-6 bg-[#10438F] py-2 px-5">
        {/* Título da Seção */}
        Briefing da Campanha
      </h2>

      <div className="px-5 mb-6 grid grid-cols-1">
        {/* Campo Briefing + Tooltip */}
        <div className="col-span-1">
          <label className="block mb-1 text-gray-700 font-semibold flex items-center">
            {
              "Briefing da Campanha (Forneça detalhes essenciais que o Creator deve saber)*"
            }
            <div className="relative inline-block">
              <Question
                size={18}
                color="#00f"
                className="ml-2 min-w-[2rem] cursor-pointer"
                onClick={() => setTooltipOpenBriefing(!tooltipOpenBriefing)}
              />
              {tooltipOpenBriefing && (
                <div
                  ref={tooltipRefBriefing}
                  className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10 rounded-xl"
                  style={{
                    top: "100%",
                    left: "-100%",
                    transform: "translateX(-80%)",
                    width: "300px",
                    marginTop: "0.5rem",
                  }}
                >
                  <p className="text-gray-700 font-normal">
                    {
                      "Forneça detalhes essenciais que o Creator deve saber, incluindo objetivo, mensagens principais, tom e diretrizes visuais."
                    }
                  </p>
                </div>
              )}
            </div>
          </label>

          <p className="text-gray-500 text-sm mb-2">
            {
              "Descreva o propósito da campanha, público-alvo, mensagens principais, tom de voz e diretrizes visuais."
            }
          </p>

          <textarea
            name="briefing"
            value={briefing}
            onChange={handleBriefingChange}
            className="w-full h-[120px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              "Inclua informações sobre objetivo, mensagens principais, tom, linguagem, diretrizes visuais etc."
            }
          />
        </div>

        {/* Botão Gerar com IA */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGenerateWithAI}
            disabled={isGenerating || !isFormReadyForAI}
            className={`px-4 py-2 rounded-md text-white transition font-semibold ${
              !isFormReadyForAI || isGenerating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isGenerating ? "Gerando briefing..." : "Gerar com IA"}
          </button>

          {!isFormReadyForAI && (
            <p className="text-red-500 text-sm mt-1">
              Você precisa preencher todos os campos obrigatórios antes de gerar
              com IA. Os campos opcionais são recomendados para melhorar a
              qualidade do briefing.
            </p>
          )}

          {isGenerating && (
            <p className="text-gray-500 text-sm mt-1">
              O texto do briefing foi limpo enquanto geramos um novo...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
const ResponsibleInfoSection: React.FC<{
  data: ResponsibleInfo;
  onChange: (data: ResponsibleInfo) => void;
}> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const formatPhoneNumber = (value: string) => {
    let digits = value.replace(/\D/g, "");
    digits = digits.slice(0, 11);

    if (digits.length > 10) {
      digits = digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (digits.length > 6) {
      digits = digits.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (digits.length > 2) {
      digits = digits.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
    } else if (digits.length > 0) {
      digits = digits.replace(/^(\d{0,2})/, "($1");
    }

    return digits;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "cpf") {
      newValue = formatCPF(value);
    } else if (name === "phone") {
      newValue = formatPhoneNumber(value);
    }

    onChange({
      ...data,
      [name]: newValue,
    });
  };

  return (
    <div className="w-full mt-8">
      <h2 className="text-lg font-medium text-white mb-6 bg-[#10438F] py-2 px-5">
        {t("Informações do Responsável pela Campanha")}
      </h2>
      <div className="px-5 mb-6">
        <p className="text-gray-700 mb-4">
          {t(
            "Essas informações serão apenas para controle interno da equipe da ConectePubli."
          )}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              {t("Nome*")}
            </label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("Nome do responsável")}
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              {t("E-mail*")}
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("E-mail do responsável")}
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              {t("Telefone*")}
            </label>
            <input
              type="tel"
              name="phone"
              value={data.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("Telefone do responsável")}
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              {t("CPF*")}
            </label>
            <input
              type="text"
              name="cpf"
              value={data.cpf}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("CPF do responsável")}
              maxLength={14}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
