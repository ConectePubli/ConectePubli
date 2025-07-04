import React, { useState } from "react";
import Modal from "./Modal";
import { Flag, MapPin, MessageCircle, Stars, User } from "lucide-react";
import { CaretDown, MagnifyingGlassPlus, WhatsappLogo } from "phosphor-react";
import { t } from "i18next";

import { Influencer } from "@/types/Influencer";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { Campaign } from "@/types/Campaign";

import { getStatusColor } from "@/utils/getColorStatusInfluencer";

import pb from "@/lib/pb";
import { useRouter } from "@tanstack/react-router";
import { createOrGetChat } from "@/services/chatService";
import { toast, ToastContainer } from "react-toastify";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

interface Props {
  campaignData: Campaign;
  selectedParticipation: CampaignParticipation;
  setSelectedParticipation: React.ComponentState;
  participant: Influencer;
  setModalType: React.ComponentState;
  cartParticipations: CampaignParticipation[];
}

const InfoParticipantModal: React.FC<Props> = ({
  campaignData,
  selectedParticipation,
  setSelectedParticipation,
  participant,
  setModalType,
  cartParticipations,
}) => {
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useState(false);

  // chat
  const [loadingChat, setLoadingChat] = useState<boolean>(false);

  const handleStartChat = async (influencerId: string, brandId: string) => {
    setLoadingChat(true);

    try {
      const chat = await createOrGetChat(
        campaignData?.id as string,
        influencerId,
        brandId
      );

      router.navigate({
        to: "/dashboard/chat/",
        search: {
          campaignId: chat.campaign,
          influencerId: chat.influencer,
          brandId: chat.brand,
        },
      });
    } catch (error) {
      console.error("Erro ao iniciar o chat:", error);
      toast("Não foi possível iniciar o chat", {
        type: "error",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncateText = (text: string, limit: number) =>
    text.length > limit ? text.slice(0, limit) + "..." : text;

  return (
    <Modal onClose={() => setModalType(null)}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t("Informações do Creator")}</h2>

        <div className="flex flex-wrap items-center gap-4">
          {participant?.profile_img ? (
            <img
              src={pb.files.getUrl(participant, participant?.profile_img)}
              alt="Foto do Creator"
              className="w-16 h-16 min-w-[4rem] rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 min-w-[4rem] rounded-full bg-gray-300 flex items-center justify-center">
              <User size={24} color="#fff" />
            </div>
          )}

          <div className="flex-1">
            <p className="font-semibold text-lg">{participant?.name}</p>
            {selectedParticipation.status !== "waiting" && (
              <div className="flex flex-col">
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <MapPin size={16} />
                  {`${participant?.city || t("Cidade não definida")}, ${
                    participant?.state || t("Estado não definido")
                  }, ${participant?.country || t("País não definido")}`}
                </p>

                <p className="flex items-center">
                  <WhatsappLogo className="w-4 h-4 mr-1" />{" "}
                  {formatPhoneNumber(String(participant?.cell_phone))}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          {cartParticipations.some(
            (cartItem) => cartItem.id === selectedParticipation.id
          ) ? (
            <>
              <p
                className="text-sm mt-1 font-semibold"
                style={{
                  color: "#FFC107",
                }}
              >
                {t("Status: Pagamento pendente")}
              </p>
            </>
          ) : (
            <>
              <p
                className="text-sm mt-1 font-semibold"
                style={{
                  color: getStatusColor(selectedParticipation.status),
                }}
              >
                Status:{" "}
                {selectedParticipation.status === "waiting"
                  ? t("Proposta Pendente")
                  : selectedParticipation.status === "approved"
                    ? t("Trabalho em Progresso")
                    : selectedParticipation.status === "completed"
                      ? t("Trabalho Concluído")
                      : selectedParticipation.status === "canceled"
                        ? t("Trabalho não Entregue")
                        : ""}
              </p>
            </>
          )}
        </div>

        {/* Bio */}
        <div className="text-gray-700">
          {selectedParticipation?.description ? (
            <>
              <p>
                {showFullDescription
                  ? selectedParticipation.description
                  : truncateText(selectedParticipation.description, 100)}
              </p>
              {selectedParticipation.description.length > 100 && (
                <button
                  className="text-blue-600 text-sm hover:underline"
                  onClick={toggleDescription}
                >
                  {showFullDescription ? t("Ver Menos") : t("Ver Mais")}
                </button>
              )}
            </>
          ) : (
            t("O creator não forneceu uma descrição detalhada.")
          )}
        </div>

        <div className="flex gap-4 flex-wrap max-sm:gap-y-2">
          <button
            className="flex items-center gap-1 text-gray-700 font-semibold hover:underline"
            onClick={() => {
              window.open(
                `/creator/${participant?.username}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            <MagnifyingGlassPlus size={17} weight="bold" />
            {t("Ver Perfil")}
          </button>

          {campaignData.status !== "ended" &&
            selectedParticipation.status !== "waiting" &&
            campaignData.paid === true && (
              <button
                className="flex items-center gap-1 text-gray-700 font-semibold hover:underline"
                onClick={() => {
                  handleStartChat(
                    selectedParticipation.influencer || "",
                    campaignData.brand
                  );
                }}
              >
                {loadingChat ? (
                  t("Aguarde...")
                ) : (
                  <>
                    <MessageCircle size={18} className="mr-1" />
                    {t("Enviar Mensagem")}
                  </>
                )}
              </button>
            )}

          {selectedParticipation.status === "completed" && (
            <button
              className="flex items-center gap-1 text-gray-700 font-semibold hover:underline"
              onClick={() => {
                setModalType("rateParticipant");
              }}
            >
              <Stars size={17} />
              {t("Avaliar")}
            </button>
          )}
        </div>

        {selectedParticipation.status === "approved" &&
          campaignData.paid === true && (
            <>
              <button
                className="px-4 py-2 bg-[#338B13] text-white rounded hover:bg-[#25670d] transition flex items-center justify-center w-[215px]"
                onClick={() => {
                  setSelectedParticipation(selectedParticipation);
                  setModalType("conclude");
                }}
              >
                <Flag size={18} className="mr-2" />
                {t("Trabalho concluído")}
              </button>
            </>
          )}

        {selectedParticipation.status !== "waiting" && (
          <div>
            <h3 className="font-semibold text-lg flex items-center">
              {t("Endereço")}{" "}
              <CaretDown className="ml-1 translate-y-0.5" weight="bold" />
            </h3>
            <p className="text-gray-700">
              {t("CEP")}: {participant?.cep || t("Não informado")}
            </p>
            <p className="text-gray-700">
              {t("Rua")}: {participant?.street || t("Não informado")}
            </p>
            <p className="text-gray-700">
              {t("Complemento")}:{" "}
              {participant?.complement || t("Não informado")}
            </p>
            <p className="text-gray-700">
              {t("Número")}: {participant?.address_num || t("Não informado")}
            </p>
            <p className="text-gray-700">
              {t("Bairro")}: {participant?.neighborhood || t("Não informado")}
            </p>
            <p className="text-gray-700">
              {t("Cidade")}: {participant?.city || t("Não informado")}
            </p>
            <p className="text-gray-700">
              {t("Estado")}: {participant?.state || t("Não informado")}
            </p>
            <p className="text-gray-700">
              {t("País")}: {participant?.country || t("Não informado")}
            </p>
          </div>
        )}
      </div>

      <ToastContainer />
    </Modal>
  );
};

export default InfoParticipantModal;
