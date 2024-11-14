import pb from "@/lib/pb";
import { Campaign } from "@/types/Campaign";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { Influencer } from "@/types/Influencer"; // Assegure-se de importar a interface correta
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Ajuste o caminho conforme necessário
import { AuthModel, ClientResponseError } from "pocketbase";
import { toast } from "sonner";
import { ParticipationStatusFilter } from "@/types/Filters";

interface CampaignSubscribeButtonProps {
  campaign: Campaign;
  campaignParticipations: CampaignParticipation[];
  vagasRestantes: number | undefined;
}

const isProfileComplete = (user: AuthModel): boolean => {
  if (!user) return false;

  // Verificar todos os campos obrigatórios
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

  // Verificar se pelo menos um campo de rede social está preenchido
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

// Exemplo de um Spinner simples
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

const CampaignSubscribeButton: React.FC<CampaignSubscribeButtonProps> = ({
  campaign,
  campaignParticipations,
  vagasRestantes,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Influencer | null>(
    pb.authStore.model as Influencer | null
  );
  const isBrand = user?.collectionName === "Brands";
  const isVagasEsgotadas = vagasRestantes === 0;
  const isOwner = campaign.id === user?.id; // Verifica se o usuário é o dono da campanha

  // Estados para o modal e carregamento
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentIdea, setContentIdea] = useState("");
  const [isContractAccepted, setIsContractAccepted] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const [localCampaignParticipations, setLocalCampaignParticipations] =
    useState<CampaignParticipation[]>(campaignParticipations);

  useEffect(() => {
    setLocalCampaignParticipations(campaignParticipations);
  }, [campaignParticipations]);

  // Função para verificar se o usuário está inscrito
  const isUserRegistered = (): boolean => {
    if (!user) return false;
    return localCampaignParticipations.some(
      (participation: CampaignParticipation) =>
        participation.influencer === user.id
    );
  };

  // Atualizar o estado do usuário quando o authStore muda
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model as Influencer | null);
    });
    return () => unsubscribe();
  }, []);

  // Funções para navegação e ações
  const navigateToCompleteProfile = (): void => {
    if (user?.collectionName === "Influencers") {
      navigate({ to: `/influenciador/${user.username}/editar` });
    } else {
      navigate({ to: `/marca/${user?.username}/editar` });
    }
  };

  const handleInscricao = async (): Promise<void> => {
    if (!user) return;
    setIsLoadingSubmit(true);
    try {
      const res = await pb
        .collection<CampaignParticipation>("Campaigns_Participations")
        .create({
          campaign: campaign.id,
          influencer: user.id,
          status: "waiting",
          description: contentIdea,
        });

      toast.success("Inscrição realizada com sucesso!");
      setIsModalOpen(false);
      console.log(localCampaignParticipations);
      setLocalCampaignParticipations([
        ...localCampaignParticipations,
        {
          campaign: campaign.id,
          collectionId: res.collectionId,
          collectionName: res.collectionName,
          created: res.created,
          id: res.id,
          updated: res.updated,
          influencer: user.id,
          status: ParticipationStatusFilter.Waiting,
          description: contentIdea,
        },
      ]);
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

  const handleCancelarInscricao = async (): Promise<void> => {
    if (!user) return;
    setIsLoadingCancel(true);
    try {
      await pb
        .collection<CampaignParticipation>("Campaigns_Participations")
        .delete(
          localCampaignParticipations.find((p) => p.influencer === user.id)
            ?.id || ""
        );

      toast.success("Inscrição cancelada com sucesso!");

      setLocalCampaignParticipations(
        localCampaignParticipations.filter((p) => p.influencer !== user.id)
      );
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      toast.error(
        "Ocorreu um erro ao tentar cancelar a inscrição. Tente novamente."
      );
    } finally {
      setIsLoadingCancel(false); // Finalizar o estado de carregamento
    }
  };

  // Determine o estado atual do botão
  let buttonText: string = "Inscrever-se";
  let isDisabled: boolean =
    isBrand || (!isUserRegistered && isVagasEsgotadas) || isOwner;
  let onClickHandler: () => void = () => setIsModalOpen(true);

  if (isUserRegistered()) {
    buttonText = isLoadingCancel ? "Cancelando..." : "Cancelar Inscrição";
    onClickHandler = handleCancelarInscricao;
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
        user?.collectionName === "Influencers" && (
          <p className="text-[#942A2A] font-semibold">
            Complete seu perfil para se inscrever
          </p>
        )}
      {shouldRenderButton ? (
        <>
          <button
            className={`px-4 py-2 rounded-md mt-2 font-bold border transition-colors duration-200 flex flex-row ${
              buttonText === "Cancelar Inscrição" ||
              buttonText === "Cancelando..."
                ? "bg-white border-[#942A2A] text-[#942A2A] hover:bg-[#942A2A] hover:text-white"
                : "bg-[#10438F] text-white hover:bg-[#10438F]/90"
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isDisabled || isLoadingCancel}
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
                        href={`${window.location.pathname}/termos`}
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
        !isUserRegistered() && (
          <p className="text-[#942A2A] font-semibold">
            As vagas para esta campanha estão preenchidas. Fique atento para
            novas oportunidades em breve!
          </p>
        )
      )}
    </>
  );
};

export default CampaignSubscribeButton;
