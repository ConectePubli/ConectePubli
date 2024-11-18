import { Button } from "@/components/ui/button";
import { useRouter, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import pb from "@/lib/pb";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { getUserData } from "@/utils/getUserData";
import axios from "axios";

import FacebookIcon from "@/assets/icons/brands/facebook.svg";
import InstagramIcon from "@/assets/icons/brands/instagram.svg";
import KwaiIcon from "@/assets/icons/brands/kwai.svg";
import LinkedInIcon from "@/assets/icons/brands/linkedin.svg";
import PinterestIcon from "@/assets/icons/brands/pinterest.svg";
import TiktokIcon from "@/assets/icons/brands/tiktok.svg";
import TwitchIcon from "@/assets/icons/brands/twitch.svg";
import TwitterIcon from "@/assets/icons/brands/twitter.svg";
import YourClubIcon from "@/assets/icons/brands/yourclub.svg";
import YouTubeIcon from "@/assets/icons/brands/youtube.svg";

import {
  objectiveOptions,
  genderOptions,
  channelsOptions,
  localityOptions,
  minFollowersOptions,
  minVideoDurationOptions,
  maxVideoDurationOptions,
} from "@/utils/campaignData/labels";
import { Niche } from "@/types/Niche";
import { Campaign } from "@/types/Campaign";
import ModalInfoCampaign from "./ModalInfoCampaign";

const channelIcons = {
  Instagram: InstagramIcon,
  Tiktok: TiktokIcon,
  YouTube: YouTubeIcon,
  Pinterest: PinterestIcon,
  LinkedIn: LinkedInIcon,
  Facebook: FacebookIcon,
  Twitter: TwitterIcon,
  Twitch: TwitchIcon,
  YourClub: YourClubIcon,
  Kwai: KwaiIcon,
  X: TwitterIcon,
};

const minAgeOptions = Array.from({ length: 65 }, (_, i) => ({
  label: (i + 16).toString(),
  value: (i + 16).toString(),
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
    campaignDetails: string;
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

interface CampaignFormProps {
  campaignId?: string;
  initialCampaignData?: Campaign;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
  campaignId,
  initialCampaignData,
}) => {
  const navigate = useNavigate();

  const isEditMode = Boolean(campaignId);

  const [campaignData, setCampaignData] = useState<CampaignData>({
    basicInfo: {
      campaignName: "",
      format: "UGC",
      productUrl: "",
      coverImage: "",
      campaignDetails: "",
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
      audioFormat: null,
    },
  });

  const [campaignBudget, setCampaignBudget] = useState<CampaignBudget>({
    startDate: "",
    endDate: "",
    influencersCount: 0,
    creatorFee: 0,
  });

  const [responsibleInfo, setResponsibleInfo] = useState<ResponsibleInfo>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
  });

  // Prefill form data in edit mode
  useEffect(() => {
    console.log(initialCampaignData);
    if (isEditMode && initialCampaignData) {
      setCampaignData({
        basicInfo: {
          campaignName: initialCampaignData.name || "",
          format: initialCampaignData.objective || "UGC",
          productUrl: initialCampaignData.product_url || "",
          coverImage: initialCampaignData.cover_img || "",
          campaignDetails: initialCampaignData.description || "",
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
          audioFormat: initialCampaignData.audio_format || null,
        },
      });

      setCampaignBudget({
        startDate: initialCampaignData.beginning || "",
        endDate: initialCampaignData.end || "",
        influencersCount: initialCampaignData.open_jobs || 0,
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

  const router = useRouter();
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
        "opening_date",
        "company_register",
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
        router.navigate({
          to: `/marca/${username}/editar?from=CreateCampaign&error=MissingData`,
        });
      }
    }
  }, [brandLoading, brandInfo, user.model.username, router]);

  const generateUniqueName = (
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

  // Helper function to populate shared fields
  const populateCampaignFormData = (
    formData: FormData,
    campaignData: CampaignData,
    campaignBudget: CampaignBudget,
    responsibleInfo: ResponsibleInfo,
    userId: string | undefined
  ) => {
    if (userId) formData.append("brand", userId);
    formData.append("status", "ready");

    formData.append("name", campaignData.basicInfo.campaignName);
    if (campaignData.basicInfo.coverImage) {
      formData.append("cover_img", campaignData.basicInfo.coverImage);
    }
    formData.append("objective", campaignData.basicInfo.format);
    formData.append("product_url", campaignData.basicInfo.productUrl);
    formData.append("description", campaignData.basicInfo.campaignDetails);

    // Dissemination channels
    if (Array.isArray(campaignData.basicInfo.disseminationChannels)) {
      campaignData.basicInfo.disseminationChannels.forEach((channel) => {
        formData.append("channels", channel);
      });
    } else {
      formData.append("channels", campaignData.basicInfo.disseminationChannels);
    }

    // Audience segmentation
    if (campaignData.audienceSegmentation.niche.length === 0) {
      // Ensure backend knows this field is empty
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
        // Ensure backend knows this field is empty
        formData.append("locality", "");
      } else {
        campaignData.audienceSegmentation.location.forEach((locate) => {
          formData.append("locality", locate);
        });
      }
    } else {
      formData.append("locality", campaignData.audienceSegmentation.location || "");
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
      "audio_format",
      campaignData.audienceSegmentation.audioFormat || ""
    );

    // Campaign budget
    formData.append("beginning", campaignBudget.startDate as string);
    formData.append("end", campaignBudget.endDate as string);
    formData.append("open_jobs", campaignBudget.influencersCount.toString());
    formData.append(
      "price",
      (campaignBudget.influencersCount * campaignBudget.creatorFee).toString()
    );

    // Responsible info
    formData.append("responsible_name", responsibleInfo.name);
    formData.append("responsible_email", responsibleInfo.email);
    formData.append(
      "responsible_phone",
      responsibleInfo.phone.replace(/\D/g, "")
    );
    formData.append("responsible_cpf", responsibleInfo.cpf);
  };

  // Helper function to prepare form data and handle unique name logic
  const prepareCampaignFormData = async (
    formData: FormData,
    user: ReturnType<typeof getUserData>,
    campaignData: CampaignData,
    campaignBudget: CampaignBudget,
    responsibleInfo: ResponsibleInfo,
    isNew: boolean,
    currentUniqueName?: string
  ): Promise<void> => {
    if (!user.model.id) {
      toast.error(
        "Erro ao processar informação, por favor realize o login novamente"
      );
      throw new Error("User ID is missing");
    }

    // Fetch existing unique names only if we're creating or changing the name
    let uniqueName = currentUniqueName;
    if (
      isNew ||
      !currentUniqueName ||
      campaignData.basicInfo.campaignName !==
        currentUniqueName.replace(/_/g, " ")
    ) {
      const existingUniqueNames: string[] = await pb
        .collection("Campaigns")
        .getFullList<Campaign>({ fields: "unique_name" })
        .then((campaigns) => campaigns.map((c) => c.unique_name));

      const baseName = campaignData.basicInfo.campaignName
        .toLowerCase()
        .replace(/\s+/g, "_")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      uniqueName = generateUniqueName(baseName, existingUniqueNames);
    }

    if (uniqueName) {
      formData.append("unique_name", uniqueName);
    }

    // Populate the rest of the form data
    populateCampaignFormData(
      formData,
      campaignData,
      campaignBudget,
      responsibleInfo,
      isNew ? user.model.id : undefined
    );
  };

  // Create campaign function
  const createCampaign = async (): Promise<Campaign> => {
    const formData = new FormData();
    await prepareCampaignFormData(
      formData,
      user,
      campaignData,
      campaignBudget,
      responsibleInfo,
      true
    );

    formData.append("paid", "false");

    const createdCampaign: Campaign = await pb
      .collection("Campaigns")
      .create(formData);
    return createdCampaign;
  };

  // Update campaign function
  const updateCampaign = async (): Promise<Campaign> => {
    if (!campaignId) {
      throw new Error("Campaign ID not found");
    }

    const formData = new FormData();

    // Fetch current campaign data to get the existing unique name
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
      currentUniqueName
    );

    return await pb.collection("Campaigns").update(campaignId, formData);
  };

  const mutate = useMutation<Campaign, Error, void>({
    mutationFn: isEditMode ? updateCampaign : createCampaign,
    onSuccess: async (createdCampaign: Campaign) => {
      if (isEditMode) {
        toast.success("Campanha atualizada com sucesso!");
        navigate({
          to: "/dashboard/campanhas/$campaignId/aprovar",
          params: { campaignId },
        });
      } else {
        toast.success("Campanha criada com sucesso!");

        const response = await axios.post(
          `https://conecte-publi.pockethost.io/api/checkout_campaign`,
          {
            campaign_id: createdCampaign.id,
            campaign_name: createdCampaign.name,
            unit_amount:
              campaignBudget.influencersCount * campaignBudget.creatorFee * 100,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.status === 200) {
          const link = await response.data.link;
          if (link) {
            window.location.href = link;
          } else {
            toast.error("Erro ao iniciar o pagamento. Tente novamente.");
          }
        } else {
          toast.error("Erro ao iniciar o pagamento. Tente novamente.");
        }
      }
    },
    onError: (e) => {
      console.log(e);
      toast.error("Erro ao criar a campanha. Tente novamente.");
    },
  });

  const isValidEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const isValidURL = (url: string) => {
    try {
      const testUrl = url.includes("://") ? url : "http://" + url;
      new URL(testUrl);
      return true;
    } catch (e) {
      console.log(`invalid url ${e}`);
      return false;
    }
  };

  const handleSubmit = () => {
    const missingFields: string[] = [];

    // Basic Info Section Required Fields
    if (!campaignData.basicInfo.campaignName)
      missingFields.push("Nome da Campanha");
    if (!campaignData.basicInfo.format)
      missingFields.push("Formato da Campanha");
    if (!campaignData.basicInfo.coverImage) missingFields.push("Foto de Capa");
    if (!campaignData.basicInfo.productUrl)
      missingFields.push("URL do Produto ou Perfil");
    if (!campaignData.basicInfo.campaignDetails)
      missingFields.push("Detalhes da Campanha");
    if (campaignData.basicInfo.disseminationChannels.length === 0)
      missingFields.push("Canais de Divulgação");

    // Campaign Budget Section Required Fields
    if (!campaignBudget.startDate)
      missingFields.push("Data de Início da Campanha");
    if (!campaignBudget.endDate) missingFields.push("Data de Fim da Campanha");
    if (
      !campaignBudget.influencersCount ||
      campaignBudget.influencersCount <= 0
    )
      missingFields.push("Quantidade de Influenciadores");
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
      return;
    }

    if (campaignBudget.creatorFee < 50) {
      toast.warn("O valor mínimo por criador é R$50,00.");
      return;
    }

    if (!isValidEmail(responsibleInfo.email)) {
      toast.warn("Email do Responsável é inválido");
      return;
    }

    if (!isValidURL(campaignData.basicInfo.productUrl)) {
      toast.warn("URL do Produto ou Perfil é inválida");
      return;
    }

    mutate.mutate();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <BasicInfoSection
        data={campaignData.basicInfo}
        onChange={(data) =>
          setCampaignData((prev) => ({ ...prev, basicInfo: data }))
        }
        initialCampaignData={initialCampaignData as Campaign}
        isEditMode={isEditMode}
      />

      <AudienceSegmentationSection
        data={campaignData.audienceSegmentation}
        onChange={(data) =>
          setCampaignData((prev) => ({
            ...prev,
            audienceSegmentation: data,
          }))
        }
        niches={niches}
        nichesLoading={nichesLoading}
      />

      <CampaignBudgetSection
        startDate={campaignBudget.startDate}
        endDate={campaignBudget.endDate}
        influencersCount={campaignBudget.influencersCount}
        creatorFee={campaignBudget.creatorFee}
        onChange={(data) => setCampaignBudget(data)}
        isEditMode={isEditMode}
      />

      <ResponsibleInfoSection
        data={responsibleInfo}
        onChange={setResponsibleInfo}
      />

      <div className="px-5 w-full">
        <button
          onClick={handleSubmit}
          className="w-[200px] bg-[#10438F] text-white py-2 rounded-md mt-6 mb-8 w-full"
          disabled={mutate.isPending}
        >
          {mutate.isPending
            ? "Carregando..."
            : isEditMode
            ? "Atualizar Campanha"
            : "Concluir e prosseguir para o pagamento"}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

type BasicInfoSectionProps = {
  data: CampaignData["basicInfo"];
  onChange: (data: CampaignData["basicInfo"]) => void;
  initialCampaignData: Campaign;
  isEditMode: boolean;
};

function isBlobOrFile(value: unknown): value is Blob | File {
  return value instanceof Blob || value instanceof File;
}

function BasicInfoSection({
  data,
  onChange,
  initialCampaignData,
  isEditMode,
}: BasicInfoSectionProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (data.coverImage) {
      if (typeof data.coverImage === "string") {
        if (isEditMode && initialCampaignData?.cover_img) {
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
        Informações Básicas da Campanha
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 px-5">
        <div>
          <div className="mb-8">
            <label className="block mb-2 text-gray-700 font-semibold">
              Nome da campanha*
            </label>
            <input
              type="text"
              name="campaignName"
              value={data.campaignName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome da campanha"
            />
            <p className="text-gray-500 mt-2">
              O nome é a primeira informação que os criadores de conteúdo
              visualizam.
            </p>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Formato da campanha*
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
            <p className="text-gray-500 mt-2">
              {data.format === "UGC"
                ? "UGC (Talentos): O criador de conteúdo fornece o vídeo para você postar nas suas redes sociais ou usar em anúncios."
                : "Influencers (Nano, Micro e Macro influenciadores): O criador de conteúdo posta o vídeo nas redes sociais dele ou em colaboração com sua marca."}
            </p>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block mb-2 text-gray-700 font-semibold">
            Foto de capa*
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
              <p className="text-blue-500">Carregue ou arraste e solte</p>
            ) : (
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <p className="text-gray-500 mt-2 text-sm">
            Tamanho recomendado: 1200x628px para garantir melhor qualidade.
          </p>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-gray-700 font-semibold">
            URL do Produto ou Perfil*
          </label>

          <p className="text-gray-500 mb-2">
            Compartilhe o URL do Produto/Perfil da sua marca para que os
            criadores conheçam mais sobre você.
          </p>

          <input
            type="url"
            name="productUrl"
            value={data.productUrl || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <label className="block text-gray-700 font-semibold">
                Detalhes da campanha*
              </label>

              <p className="text-gray-500 mb-2">
                Descreva o que você espera que os criadores façam. Dê instruções
                claras para que eles entendam suas expectativas.
              </p>
            </div>

            <div className="mt-2 md:mt-0">
              <Button variant={"orange"} onClick={openModal}>
                Ver instruções
              </Button>
            </div>
          </div>

          <textarea
            name="campaignDetails"
            value={data.campaignDetails}
            onChange={handleInputChange}
            className="w-full h-[120px] mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Inclua as hashtags obrigatórias, chamadas de ação, e qualquer outro detalhe importante que seja necessário para completar a campanha."
          />
        </div>

        <ModalInfoCampaign isOpen={isModalOpen} onClose={closeModal}>
          <div className="p-4 max-sm:px-2 max-sm:py-4">
            <h1 className="text-xl font-bold mb-4">
              Normas para Campanhas UGC e IGC na Plataforma Conecte Publi
            </h1>
            <div className="max-h-[70vh]">
              <h2 className="text-lg font-semibold mt-4 mb-2">
                1. Instruções para o Conteúdo:
              </h2>
              <p className="mb-2">
                Objetivo da Campanha: Certifique-se de que o propósito da
                campanha esteja claramente indicado – seja para aumentar a
                visibilidade da marca, gerar vendas, promover engajamento,
                lançar um produto, etc. Quando os criadores compreendem o
                objetivo, eles podem ajustar o conteúdo para refletir melhor
                essas metas.
              </p>
              <p className="mb-2">
                Diretrizes de Formato: Especifique o tipo de conteúdo que deseja
                (como vídeo, foto, ou carrossel de imagens), além dos detalhes
                técnicos, incluindo resolução e orientação (por exemplo:
                vertical 9:16 para stories ou reels, horizontal 16:9 para
                YouTube).
              </p>
              <p className="mb-2">
                Estilo e Estética: Descreva o tom e o estilo esperados para o
                conteúdo, seja ele mais leve, humorístico, inspirador ou
                informativo. Exemplos visuais são úteis para ilustrar o estilo
                desejado.
              </p>
              <p className="mb-2">
                Duração do Conteúdo: Defina o tempo ideal dos vídeos,
                especialmente considerando a plataforma de publicação. Exemplo:
                vídeos de até 60 segundos para reels e TikTok, stories de 15
                segundos.
              </p>

              <h2 className="text-lg font-semibold mt-4 mb-2">
                2. Referências Visuais e Estéticas:
              </h2>
              <p className="mb-2">
                Exemplos e Links de Inspiração: Inclua links de vídeos ou
                campanhas anteriores para reduzir possíveis interpretações
                equivocadas.
              </p>
              <p className="mb-2">
                Diretrizes de Branding: Certifique-se de que os criadores tenham
                acesso à identidade visual da marca, incluindo paleta de cores e
                logotipo.
              </p>

              <h2 className="text-lg font-semibold mt-4 mb-2">
                3. Instruções de Narração, Áudio e Ambiente:
              </h2>
              <p className="mb-2">
                Narração ou Música de Fundo: Indique se o vídeo precisa de
                narração, falas diretas ou se pode ter apenas uma trilha de
                fundo.
              </p>
              <p className="mb-2">
                Legendas e Diálogos: Especifique se o vídeo deve incluir
                legendas para melhorar a acessibilidade.
              </p>
              <p className="mb-2">
                Ambiente de Gravação: Informe se a gravação deve ser feita em
                local interno ou externo.
              </p>

              <h2 className="text-lg font-semibold mt-4 mb-2">
                4. Frases e Informações Específicas no Conteúdo:
              </h2>
              <p className="mb-2">
                Orientações sobre Texto: Indique se há frases específicas ou
                informações essenciais que devem ser mencionadas.
              </p>
              <p className="mb-2">
                Hashtags e Marcação de Perfis: Informe as hashtags ou perfis que
                devem ser mencionados ou marcados.
              </p>

              <h2 className="text-lg font-semibold mt-4 mb-2">
                5. Aprovação do Roteiro:
              </h2>
              <p className="mb-2">
                Envio Prévio do Roteiro: Recomende o envio de um roteiro para
                revisão antes da produção.
              </p>
              <p className="mb-2">
                Feedback Estruturado: Ofereça um retorno claro sobre o que
                manter ou ajustar.
              </p>

              <h2 className="text-lg font-semibold mt-4 mb-2">
                6. Processo de Aprovação e Revisões:
              </h2>
              <p className="mb-2">
                Prazos de Aprovação: Estabeleça um prazo para a aprovação dos
                conteúdos enviados.
              </p>
              <p className="mb-2">
                Solicitação de Ajustes: Defina o número de rodadas de ajustes
                permitidas, com prazos específicos.
              </p>

              <h2 className="text-lg font-semibold mt-4 mb-2">
                7. Condições de Pagamento:
              </h2>
              <p className="mb-2">
                Pagamento somente para quem finalizar o escopo pedido, caso
                contrário, a plataforma não fará o repasse e devolverá para a
                marca.
              </p>

              <h2 className="text-lg font-semibold mt-4 mb-2">
                8. Cronograma de Entrega e Publicação:
              </h2>
              <p className="mb-2">
                Prazos de Entrega: Defina datas específicas para envio de
                rascunhos, versões finais e publicação.
              </p>

              <h2 className="text-lg font-semibold mt-4 mb-2">
                9. Direitos de Uso e Propriedade Intelectual:
              </h2>
              <p className="mb-2">
                Licenciamento de Conteúdo: Esclareça os termos de uso e as
                plataformas onde o conteúdo será veiculado.
              </p>

              <h2 className="text-lg font-semibold mt-4 mb-2">
                10. Resolução de Conflitos e Contingências:
              </h2>
              <p className="pb-5">
                Cláusulas de Contingência: Inclua disposições para imprevistos,
                como problemas técnicos ou indisponibilidade.
              </p>
            </div>
          </div>
        </ModalInfoCampaign>

        <div className="col-span-1 md:col-span-2">
          <div className="col-span-2">
            <label className="block mb-2 text-gray-700 font-semibold">
              Canais de divulgação*
            </label>

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
  const [nicheOptions, setNicheOptions] = useState<Niche[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<Niche[]>([]);

  // locate
  const [locationOptions, setLocationOptions] = useState(localityOptions);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const [nicheDropdownOpen, setNicheDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const nicheDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

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
    // Sync selectedLocations with data.location
    if (data.location) {
      setSelectedLocations(data.location);
    }
  }, [data.location]);

  useEffect(() => {
    if (locationOptions && data.location.length > 0) {
      const availableLocations = localityOptions.filter(
        (loc) => !data.location.includes(loc.value)
      );

      setLocationOptions(availableLocations);
    } else {
      setLocationOptions(localityOptions);
    }
  }, [data.location]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        nicheDropdownRef.current &&
        !nicheDropdownRef.current.contains(event.target as Node)
      ) {
        setNicheDropdownOpen(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setLocationDropdownOpen(false);
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

  const handleLocationSelect = (locate: { label: string; value: string }) => {
    setSelectedLocations([...selectedLocations, locate.value]);
    setLocationOptions(
      locationOptions.filter((loc) => loc.value !== locate.value)
    );
    onChange({
      ...data,
      location: [...data.location, locate.value],
    });
  };

  const handleLocationRemove = (locateValue: string) => {
    setSelectedLocations(
      selectedLocations.filter((loc) => loc !== locateValue)
    );
    const removedLocation = localityOptions.find(
      (loc) => loc.value === locateValue
    );
    if (removedLocation) {
      setLocationOptions([...locationOptions, removedLocation]);
    }
    onChange({
      ...data,
      location: data.location.filter((loc) => loc !== locateValue),
    });
  };

  const toggleNicheDropdown = () => {
    setNicheDropdownOpen((prev) => !prev);
    setLocationDropdownOpen(false); // Fecha o outro dropdown se estiver aberto
  };

  const toggleLocationDropdown = () => {
    setLocationDropdownOpen((prev) => !prev);
    setNicheDropdownOpen(false); // Fecha o outro dropdown se estiver aberto
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        Segmentação do Público e Especificações
      </h2>

      {/* Updated grid classes for responsiveness */}
      <div className="grid grid-cols-1 gap-6 px-5 mb-6">
        <div className="mb-4 relative">
          <label className="block mb-2 text-gray-700 font-semibold">
            Nicho (opcional)
          </label>
          <div className="relative" ref={nicheDropdownRef}>
            <button
              type="button"
              onClick={toggleNicheDropdown}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
            >
              {selectedNiches.length > 0
                ? `${selectedNiches.length} nicho(s) selecionado(s)`
                : "Selecionar nichos"}
            </button>
            {nicheDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                {nichesLoading ? (
                  <div className="px-4 py-2">Carregando...</div>
                ) : nicheOptions.length > 0 ? (
                  nicheOptions.map((niche) => (
                    <div
                      key={niche.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleNicheSelect(niche)}
                    >
                      {niche.niche}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    Todos os nichos foram selecionados
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
                {niche.niche}
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
            Escolha quais nichos de criadores de conteúdo fazem mais sentido
            para essa campanha.
          </p>
        </div>

        {/* Adjusted grid for age and gender */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-2 text-gray-700 font-semibold">
              Idade (opcional)
            </label>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <select
                name="minAge"
                value={data.minAge}
                onChange={handleInputChange}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" hidden>
                  Mínimo
                </option>

                {data.minAge && <option value="">Desmarcar</option>}

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
                  Máximo
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
              Qual a idade mínima e máxima que os candidatos devem ter.
            </p>
          </div>

          <div className="col-span-1">
            <label className="block mb-2 text-gray-700 font-semibold">
              Gênero (opcional)
            </label>
            <select
              name="gender"
              value={data.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" hidden>
                Selecionar gênero
              </option>

              {data.gender && <option value="">Desmarcar</option>}

              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-gray-500 mt-2">Gênero dos influenciadores.</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">
            Mínimo de Seguidores (opcional)
          </label>
          <select
            name="minFollowers"
            value={data.minFollowers}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" hidden>
              Selecionar mínimo de seguidores
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
          <label className="block mb-2 text-gray-700 font-semibold">
            Localidade (opcional)
          </label>
          <div className="relative" ref={locationDropdownRef}>
            <button
              type="button"
              onClick={toggleLocationDropdown}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
            >
              {selectedLocations.length > 0
                ? `${selectedLocations.length} localidade(s) selecionada(s)`
                : "Selecionar localidade"}
            </button>
            {locationDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                {locationOptions.length > 0 ? (
                  locationOptions.map((locate) => (
                    <div
                      key={locate.value}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleLocationSelect(locate)}
                    >
                      {locate.label}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    Todas as localidades foram selecionadas
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedLocations.map((locate) => (
              <span
                key={locate}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
              >
                {locate}
                <button
                  type="button"
                  className="ml-2 text-blue-500"
                  onClick={() => handleLocationRemove(locate)}
                >
                  x
                </button>
              </span>
            ))}
          </div>
          <p className="text-gray-500 mt-2">
            Escolha quais localidades os influenciadores devem estar.
          </p>
        </div>

        <div className="col-span-1 md:col-span-2 gap-0 grid grid-cols-1 md:grid-cols-2 md:gap-4">
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Duração do vídeo (opcional)
            </label>
            <select
              name="videoMinDuration"
              value={data.videoMinDuration}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" hidden>
                Mínimo
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
              Duração do vídeo
            </label>
            <select
              name="videoMaxDuration"
              value={data.videoMaxDuration}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!data.videoMinDuration}
            >
              <option value="" hidden>
                Máximo
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
          <label className="block mb-2 text-gray-700 font-semibold">
            Pretende utilizar o material para tráfego pago (anúncios)?*
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
              Não
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
              Sim
            </button>
          </div>
          <p className="text-gray-500 mt-2">
            Escolha uma das opções abaixo. Tráfego pago: Anúncios na Meta Ads,
            Tiktok Ads, Google ou Ecommerce. Tráfego orgânico: Veicular os
            conteúdos em qualquer rede social de sua escolha.
          </p>
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-semibold">
            Formato do áudio (opcional)
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
              Música
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
              Narração
            </button>
          </div>
          <p className="text-gray-500 mt-2">
            Como você gostaria? Escolha se o vídeo deve ser criado com uma
            música de fundo ou se é necessário que o criador de conteúdo narre o
            vídeo.
          </p>
        </div>
      </div>
    </div>
  );
}

type CampaignBudgetSectionProps = {
  startDate: Date | string;
  endDate: Date | string;
  influencersCount: number;
  creatorFee: number;
  onChange: (data: CampaignBudget) => void;
  isEditMode: boolean;
};

function CampaignBudgetSection({
  startDate,
  endDate,
  influencersCount,
  creatorFee,
  onChange,
  isEditMode,
}: CampaignBudgetSectionProps) {
  console.log("startDate", startDate)
  const [today, setToday] = useState("");
  const [creatorFeeError, setCreatorFeeError] = useState("");

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

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "creatorFee") {
      const digits = value.replace(/\D/g, "");
      const numberValue = parseFloat(digits) / 100;

      if (numberValue < 50) {
        setCreatorFeeError("O valor mínimo por criador é R$50,00.");
      } else {
        setCreatorFeeError("");
      }

      onChange({
        ...{ startDate, endDate, influencersCount, creatorFee },
        creatorFee: isNaN(numberValue) ? 0 : numberValue,
      });
    } else if (name === "influencersCount") {
      onChange({
        ...{ startDate, endDate, influencersCount, creatorFee },
        influencersCount: Number(value),
      });
    } else if (name === "startDate") {
      const newStartDate = value; // Use the value directly
      const newEndDate =
        endDate && endDate < newStartDate ? newStartDate : endDate;

      onChange({
        startDate: newStartDate,
        endDate: newEndDate,
        influencersCount,
        creatorFee,
      });
    } else if (name === "endDate") {
      onChange({
        startDate,
        endDate: value, // Use the value directly
        influencersCount,
        creatorFee,
      });
    }
  };


  return (
    <div className="w-full mt-8">
      <h2 className="text-lg font-medium text-white mb-6 bg-[#10438F] py-2 px-5">
        Período da Campanha e Orçamento
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 mb-6">
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">
            Data de Início*
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
          <label className="block mb-2 text-gray-700 font-semibold">
            Fim da Campanha*
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

      <div className="px-5 mb-6">
        <label className="block mb-2 text-gray-700 font-semibold">
          Quantos influenciadores você deseja na campanha?*
        </label>
        <input
          type="number"
          name="influencersCount"
          value={influencersCount || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Exemplo: 6"
          min={0}
          disabled={isEditMode}
        />
      </div>

      <div className="px-5 mb-3">
        <label className="block mb-2 text-gray-700 font-semibold">
          Valor por criador*
        </label>
        <input
          type="text"
          name="creatorFee"
          value={creatorFee ? formatCurrency(creatorFee) : ""}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Exemplo: R$500,00"
          disabled={isEditMode}
        />
        {creatorFeeError && creatorFee !== 0 && (
          <p className="text-red-500 text-sm mt-2">{creatorFeeError}</p>
        )}
      </div>

      <div className="px-5 text-gray-800 font-semibold">
        Orçamento total da campanha:{" "}
        {formatCurrency(influencersCount * creatorFee)}
      </div>

      <p className={`px-5 mt-2 text-gray-500 ${isEditMode ? "hidden" : ""}`}>
        Ao finalizar a criação da campanha, você será direcionado para o
        processo de pagamento referente ao orçamento total calculado acima.
      </p>
    </div>
  );
}

const ResponsibleInfoSection: React.FC<{
  data: ResponsibleInfo;
  onChange: (data: ResponsibleInfo) => void;
}> = ({ data, onChange }) => {
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
        Informações do Responsável pela Campanha
      </h2>
      <div className="px-5 mb-6">
        <p className="text-gray-700 mb-4">
          Essas informações serão apenas para controle interno da equipe da
          ConectePubli.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Nome*
            </label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do responsável"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              E-mail*
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email do responsável"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Telefone*
            </label>
            <input
              type="tel"
              name="phone"
              value={data.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Telefone do responsável"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              CPF*
            </label>
            <input
              type="text"
              name="cpf"
              value={data.cpf}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="CPF do responsável"
              maxLength={14}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
