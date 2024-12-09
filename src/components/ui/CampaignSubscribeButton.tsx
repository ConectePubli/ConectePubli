import pb from "@/lib/pb";
import { CampaignParticipation } from "@/types/Campaign_Participations";
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

const CampaignSubscribeButton: React.FC = () => {
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
  const vagasRestantes = campaign?.vagasRestantes;
  const isBrand = user?.collectionName === "Brands";
  const isVagasEsgotadas = vagasRestantes === 0;
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

  const isUserRegistered = (): boolean => {
    if (!user || !campaignParticipations) return false;
    return campaignParticipations.some(
      (participation: CampaignParticipation) =>
        participation.influencer === user.id
    );
  };

  const navigateToCompleteProfile = (): void => {
    if (user?.collectionName === "Influencers") {
      navigate({ to: `/creator/${user.username}/editar` });
    } else {
      navigate({ to: `/marca/${user?.username}/editar` });
    }
  };

  const handleInscricao = async (): Promise<void> => {
    if (!user) return;
    setIsLoadingSubmit(true);
    try {
      await addParticipation({
        campaign: campaign!.id,
        influencer: user.id,
        status: ParticipationStatusFilter.Waiting,
        description: contentIdea,
      });

      toast.success("Inscrição realizada com sucesso!");
      setIsModalOpen(false);
    } catch (error) {
      const err = error as ClientResponseError;
      if (
        err.data &&
        err.data.data.influencer &&
        err.data.data.influencer.code === "validation_not_unique"
      ) {
        toast.error("Você já está inscrito nesta campanha!");
      } else {
        console.error(
          `Erro ao inscrever usuário: ${JSON.stringify(err.data, null, 2)}`
        );
        toast.error("Ocorreu um erro ao tentar inscrever-se. Tente novamente.");
      }
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const getIncompleteProfileFields = (user: Influencer): string[] => {
    const missingFields: string[] = [];

    if (!user.name) missingFields.push("Nome");
    if (!user.username) missingFields.push("Nome de usuário");
    if (!user.email) missingFields.push("Email");
    if (!user.bio) missingFields.push("Biografia");
    if (!user.background_img) missingFields.push("Imagem de fundo");
    if (!user.birth_date) missingFields.push("Data de nascimento");
    if (!user.cell_phone) missingFields.push("Celular");
    if (!user.account_type) missingFields.push("Tipo de conta");
    if (!user.gender) missingFields.push("Gênero");
    if (!user.country) missingFields.push("País");
    if (!user.state) missingFields.push("Estado");
    if (!user.city) missingFields.push("Cidade");
    if (!user.neighborhood) missingFields.push("Bairro");
    if (!user.street) missingFields.push("Rua");
    if (!user.address_num) missingFields.push("Número");
    if (!user.cep) missingFields.push("CEP");
    if (!user.pix_key) missingFields.push("Chave PIX");

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
      missingFields.push("Pelo menos uma rede social");
    }

    return missingFields;
  };
  const missingFields = user ? getIncompleteProfileFields(user) : [];

  const handleCancelarInscricao = async (): Promise<void> => {
    if (!user) return;
    setIsLoadingCancel(true);
    try {
      const participation = campaignParticipations.find(
        (p) => p.influencer === user.id
      );
      if (participation) {
        removeParticipation(participation.id!);

        toast.success("Inscrição cancelada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      toast.error(
        "Ocorreu um erro ao tentar cancelar a inscrição. Tente novamente."
      );
    } finally {
      setIsLoadingCancel(false);
    }
  };

  const userParticipation = user
    ? campaignParticipations.find((p) => p.influencer === user.id)
    : null;

  let buttonText: string = "Inscrever-se";
  let isDisabled: boolean =
    isBrand || (!isUserRegistered() && isVagasEsgotadas) || isOwner;
  let onClickHandler: () => void = () => setIsModalOpen(true);

  if (userParticipation) {
    if (userParticipation.status === "approved") {
      buttonText = "Aprovado pela marca";
      isDisabled = true;
      onClickHandler = () => {};
    } else if (userParticipation.status === "waiting") {
      buttonText = isLoadingCancel ? "Cancelando..." : "Cancelar Inscrição";
      onClickHandler = handleCancelarInscricao;
    }
  } else if (
    !isProfileComplete(user) &&
    user?.collectionName === "Influencers"
  ) {
    buttonText = "Completar Perfil";
    isDisabled = isBrand || isVagasEsgotadas || isOwner;
    onClickHandler = navigateToCompleteProfile;
  }

  if (isBrand) {
    return null;
  }

  const shouldRenderButton =
    (!isVagasEsgotadas || isUserRegistered()) && !isOwner && !isBrand;

  return (
    <>
      {!isBrand &&
        !isProfileComplete(user) &&
        !isVagasEsgotadas &&
        user?.collectionName === "Influencers" && (
          <div className="text-[#942A2A] font-semibold mt-2">
            <p>
              Para se inscrever, complete seu perfil preenchendo os seguintes
              campos:
            </p>
            <ul className="list-disc list-inside">
              {missingFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
        )}
      {shouldRenderButton ? (
        <>
          <button
            className={`px-4 py-2 rounded-md mt-2 font-bold border transition-colors duration-200 flex flex-row ${
              buttonText === "Cancelar Inscrição" ||
              buttonText === "Cancelando..."
                ? "bg-white border-[#942A2A] text-[#942A2A] hover:bg-[#942A2A] hover:text-white"
                : buttonText === "Aprovado pela marca"
                  ? "bg-green-500 text-white cursor-default"
                  : "bg-[#10438F] text-white hover:bg-[#10438F]/90"
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isDisabled}
            onClick={onClickHandler}
          >
            {isLoadingCancel && <Spinner />}
            {buttonText}
          </button>

          {buttonText === "Inscrever-se" && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Conclua sua Inscrição</DialogTitle>
                  <DialogDescription>
                    Escreva aqui sua ideia/roteiro de conteúdo para essa
                    campanha e/ou porquê a marca deve te escolher
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
                      Li e concordo com o{" "}
                      <a
                        href={`${window.location.origin}/contrato-campanha`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-600 font-semibold"
                      >
                        Contrato da Campanha
                      </a>
                    </label>
                  </div>
                  <DialogFooter className="mt-4">
                    <button
                      type="submit"
                      className={`bg-[#E34105] text-white px-4 py-2 rounded-md ${
                        !isContractAccepted || !contentIdea.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#E34105] hover:bg-opacity-90"
                      }`}
                      disabled={
                        !isContractAccepted ||
                        !contentIdea.trim() ||
                        isLoadingSubmit
                      }
                    >
                      {isLoadingSubmit ? "Enviando..." : "Concluir inscrição"}
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </>
      ) : (
        (!isUserRegistered() ||
          (isUserRegistered() && userParticipation?.status === "sold_out" && (
            <p className="text-[#942A2A] font-semibold">
              $
              {`As vagas para esta campanha estão preenchidas. Agradecemos seu interesse ${isUserRegistered() && "e participação"}! Fique de olho nas próximas oportunidades que lançaremos em breve.`}
            </p>
          )),
        (
          <p className="text-[#DC3545]">
            {campaign?.vagasRestantes === 0 &&
              "As vagas para esta campanha encerraram"}
          </p>
        ))
      )}
    </>
  );
};

export default CampaignSubscribeButton;
