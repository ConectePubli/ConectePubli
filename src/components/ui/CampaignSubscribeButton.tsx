import pb from "@/lib/pb";
import { useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { Influencer } from "@/types/Influencer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AuthModel, ClientResponseError } from "pocketbase";
import { toast } from "sonner";
import { ParticipationStatusFilter } from "@/types/Filters";
import useIndividualCampaignStore from "@/store/useIndividualCampaignStore";
import ModalSendLinkCampaign from "./ModalSendLinkCampaign";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { isEnableSubscription } from "@/utils/campaignSubscription";
import { Campaign } from "@/types/Campaign";

const Spinner: React.FC = () => (
  <svg
    className="animate-spin h-5 w-5 mr-2 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    ></path>
  </svg>
);

const isProfileComplete = (user: AuthModel): boolean => {
  if (!user) return false;

  const requiredFieldsFilled =
    Boolean(user.name) &&
    Boolean(user.username) &&
    Boolean(user.email) &&
    Boolean(user.bio) &&
    Boolean(user.background_img) &&
    Boolean(user.birth_date) &&
    Boolean(user.cell_phone) &&
    Boolean(user.account_type) &&
    Boolean(user.gender) &&
    Boolean(user.country) &&
    Boolean(user.state) &&
    Boolean(user.city) &&
    Boolean(user.neighborhood) &&
    Boolean(user.street) &&
    Boolean(user.address_num) &&
    Boolean(user.cep) &&
    Boolean(user.pix_key);

  const socialFieldsFilled =
    Boolean(user.instagram_url) ||
    Boolean(user.facebook_url) ||
    Boolean(user.linkedin_url) ||
    Boolean(user.youtube_url) ||
    Boolean(user.tiktok_url) ||
    Boolean(user.twitter_url) ||
    Boolean(user.twitch_url) ||
    Boolean(user.yourclub_url) ||
    Boolean(user.kwai_url) ||
    Boolean(user.pinterest_url);

  return requiredFieldsFilled && socialFieldsFilled;
};

const getIncompleteProfileFields = (user: Influencer): string[] => {
  const missingFields: string[] = [];

  if (!user.name) missingFields.push(t("Nome"));
  if (!user.username) missingFields.push(t("Nome de usuário"));
  if (!user.email) missingFields.push(t("Email"));
  if (!user.bio) missingFields.push(t("Biografia"));
  if (!user.background_img) missingFields.push(t("Imagem de fundo"));
  if (!user.birth_date) missingFields.push(t("Data de nascimento"));
  if (!user.cell_phone) missingFields.push(t("Celular"));
  if (!user.account_type) missingFields.push(t("Tipo de conta"));
  if (!user.gender) missingFields.push(t("Gênero"));
  if (!user.country) missingFields.push(t("País"));
  if (!user.state) missingFields.push(t("Estado"));
  if (!user.city) missingFields.push(t("Cidade"));
  if (!user.neighborhood) missingFields.push(t("Bairro"));
  if (!user.street) missingFields.push(t("Rua"));
  if (!user.address_num) missingFields.push(t("Número"));
  if (!user.cep) missingFields.push(t("CEP"));
  if (!user.pix_key) missingFields.push(t("Chave PIX"));

  const socialFields = [
    "instagram_url",
    "facebook_url",
    "linkedin_url",
    "youtube_url",
    "tiktok_url",
    "twitter_url",
    "twitch_url",
    "yourclub_url",
    "kwai_url",
    "pinterest_url",
  ];

  const hasSocialFieldFilled = socialFields.some((field) =>
    Boolean(user[field as keyof Influencer])
  );
  if (!hasSocialFieldFilled) {
    missingFields.push(t("Pelo menos uma rede social"));
  }

  return missingFields;
};

const CampaignSubscribeButton: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<Influencer | null>(
    pb.authStore.model as Influencer | null
  );
  const {
    campaign,
    campaignParticipations,
    addParticipation,
    removeParticipation,
  } = useIndividualCampaignStore();

  const isBrand = user?.collectionName === "Brands";
  const isOwner = campaign?.id === user?.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentIdea, setContentIdea] = useState("");
  const [isContractAccepted, setIsContractAccepted] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model as Influencer | null);
    });
    return () => unsubscribe();
  }, []);

  const userParticipation = user
    ? campaignParticipations.find((p) => p.influencer === user.id)
    : null;

  const isUserRegistered = Boolean(userParticipation);
  const participationStatus = userParticipation?.status;

  // verificar se o peridodo de inscrição é valido
  const subscriptionDate = isEnableSubscription(campaign as Campaign);

  // Função para navegar até a edição do perfil
  const navigateToCompleteProfile = () => {
    if (user?.collectionName === "Influencers") {
      navigate({ to: `/creator/${user.username}/editar` });
    } else {
      navigate({ to: `/marca/${user?.username}/editar` });
    }
  };

  // Função para lidar com a inscrição
  const handleInscricao = async (): Promise<void> => {
    if (!user || !campaign) return;
    setIsLoadingSubmit(true);
    try {
      await addParticipation({
        campaign: campaign.id,
        influencer: user.id,
        status: ParticipationStatusFilter.Waiting,
        description: contentIdea,
      });

      toast.success(t("Inscrição realizada com sucesso!"));
      setIsModalOpen(false);
    } catch (error) {
      const err = error as ClientResponseError;
      if (err.data?.data?.influencer?.code === "validation_not_unique") {
        toast.error(t("Você já está inscrito nesta campanha!"));
      } else {
        console.error(
          `Erro ao inscrever usuário: ${JSON.stringify(err.data, null, 2)}`
        );
        toast.error(
          t("Ocorreu um erro ao tentar inscrever-se. Tente novamente.")
        );
      }
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  // Função para cancelar inscrição
  const handleCancelarInscricao = async (): Promise<void> => {
    if (!userParticipation) return;
    setIsLoadingCancel(true);
    try {
      await removeParticipation(userParticipation.id!);
      toast.success(t("Inscrição cancelada com sucesso!"));
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      toast.error(
        t("Ocorreu um erro ao tentar cancelar a inscrição. Tente novamente.")
      );
    } finally {
      setIsLoadingCancel(false);
    }
  };

  // Determinar o estado final do botão (texto, se está habilitado, handler)
  const userIsInfluencer = user?.collectionName === "Influencers";
  const userProfileIsComplete = user && isProfileComplete(user);
  const missingFields = user && getIncompleteProfileFields(user);

  let buttonText = "";
  let isDisabled = false;
  let onClickHandler: () => void = () => {};

  // Regras de Exibição do Botão:

  // 1. Caso seja marca ou dono da campanha, não mostrar botão
  if (isBrand || isOwner) {
    // Não renderiza botão
  }
  // 2. Caso o usuário não tenha perfil completo
  else if (userIsInfluencer && !userProfileIsComplete) {
    buttonText = "Completar Perfil";
    isDisabled = false;
    onClickHandler = navigateToCompleteProfile;
  }
  // 3. Caso o usuário já esteja inscrito
  else if (isUserRegistered) {
    // Ajuste o texto com base no status
    switch (participationStatus) {
      case "approved":
        buttonText = "Aprovado pela marca";
        isDisabled = true;
        break;
      case "waiting":
        buttonText = isLoadingCancel ? "Cancelando..." : "Cancelar Inscrição";
        onClickHandler = handleCancelarInscricao;
        break;
      case "completed":
        buttonText = "Trabalho concluído";
        isDisabled = true;
        break;
      default:
        buttonText = "Status desconhecido";
        isDisabled = true;
    }
  } else if (campaign?.status === "subscription_ended") {
    buttonText = "Inscrições encerradas";
    isDisabled = true;
  }
  // 4. Caso o usuário possa se inscrever normalmente
  else {
    buttonText = "Inscrever-se";
    onClickHandler = () => setIsModalOpen(true);
  }

  // Renderizações Condicionais:

  // Caso seja marca ou dono da campanha, não mostra nada
  if (isBrand || isOwner) {
    return null;
  }

  if (!subscriptionDate.status && !participationStatus) {
    if (subscriptionDate.message === "not_started") {
      buttonText = "Inscrições não iniciadas";
    } else if (subscriptionDate.message === "time_out") {
      buttonText = "Inscrições encerradas";
    }
    isDisabled = true;
  }

  // Caso usuário não tenha perfil completo
  if (userIsInfluencer && !userProfileIsComplete && missingFields) {
    return (
      <div>
        <div className="text-[#942A2A] font-semibold mt-2">
          <p>
            {t(
              "Para se inscrever, complete seu perfil preenchendo os seguintes campos:"
            )}
          </p>
          <ul className="list-disc list-inside">
            {missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
        <button
          className={`px-4 py-2 rounded-md mt-2 font-bold border bg-[#10438F] text-white hover:bg-[#10438F]/90`}
          onClick={onClickHandler}
        >
          {t(buttonText)}
        </button>
      </div>
    );
  }

  // Caso o usuário já esteja inscrito (approved ou waiting)
  // ou possa se inscrever agora
  return (
    <>
      <div className="flex items-center gap-4 flex-wrap max-sm:gap-0">
        <button
          className={`px-4 py-2 rounded-md mt-2 font-bold border transition-colors duration-200 flex flex-row ${
            buttonText === "Cancelar Inscrição" ||
            buttonText === "Cancelando..."
              ? "bg-white border-[#942A2A] text-[#942A2A] hover:bg-[#942A2A] hover:text-white"
              : buttonText === "Aprovado pela marca" ||
                  buttonText === "Trabalho concluído"
                ? "bg-green-500 text-white cursor-default"
                : "bg-[#10438F] text-white hover:bg-[#10438F]/90"
          } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isDisabled}
          onClick={onClickHandler}
        >
          {isLoadingCancel && <Spinner />}
          {t(buttonText)}
        </button>

        {participationStatus === "approved" && (
          <ModalSendLinkCampaign
            campaignId={campaign?.id as string}
            brandId={campaign?.expand?.brand?.id as string}
          />
        )}
      </div>

      {buttonText === "Inscrever-se" && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("Conclua sua Inscrição")}</DialogTitle>
              <DialogDescription>
                {t(
                  "Escreva aqui sua ideia/roteiro de conteúdo para essa campanha e/ou porquê a marca deve te escolher"
                )}
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleInscricao();
              }}
            >
              <div className="mt-4">
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 max-h-[60dvh] min-h-20"
                  placeholder="Digite aqui (máximo 600 caracteres)"
                  value={contentIdea}
                  maxLength={600}
                  onChange={(e) => setContentIdea(e.target.value)}
                  required
                ></textarea>
                <div className="text-right text-sm text-gray-500">
                  {contentIdea.length} / 600
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="acceptContract"
                  checked={isContractAccepted}
                  onChange={(e) => setIsContractAccepted(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  required
                />
                <label htmlFor="acceptContract" className="ml-2 text-sm">
                  {t("Li e concordo com o")}{" "}
                  <a
                    href={`${window.location.origin}/contrato-campanha`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 font-semibold"
                  >
                    {t("Contrato da Campanha")}
                  </a>
                </label>
              </div>
              <DialogFooter className="mt-4">
                <button
                  type="submit"
                  className={`bg-[#E34105] text-white px-4 py-2 rounded-md ${
                    !isContractAccepted || !contentIdea.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#E34105]/90"
                  }`}
                  disabled={
                    !isContractAccepted ||
                    !contentIdea.trim() ||
                    isLoadingSubmit
                  }
                >
                  {isLoadingSubmit ? t("Enviando...") : t("Concluir inscrição")}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CampaignSubscribeButton;
