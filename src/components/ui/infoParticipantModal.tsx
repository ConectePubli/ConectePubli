import React, { useState } from "react";
import Modal from "./Modal";
import { Flag, MapPin, MessageCircle, User } from "lucide-react";
import { CaretDown, MagnifyingGlassPlus } from "phosphor-react";

import { Influencer } from "@/types/Influencer";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { Campaign } from "@/types/Campaign";

import { getStatusColor } from "@/utils/getColorStatusInfluencer";

import pb from "@/lib/pb";

interface Props {
  campaignData: Campaign;
  selectedParticipation: CampaignParticipation;
  setSelectedParticipation: React.ComponentState;
  participant: Influencer;
  setModalType: React.ComponentState;
}

const InfoParticipantModal: React.FC<Props> = ({
  campaignData,
  selectedParticipation,
  setSelectedParticipation,
  participant,
  setModalType,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncateText = (text: string, limit: number) =>
    text.length > limit ? text.slice(0, limit) + "..." : text;

  return (
    <Modal onClose={() => setModalType(null)}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Informações do Influenciador</h2>

        <div className="flex flex-wrap items-center gap-4">
          {participant?.profile_img ? (
            <img
              src={pb.files.getUrl(participant, participant?.profile_img)}
              alt="Foto do Influenciador"
              className="w-16 h-16 min-w-[4rem] rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 min-w-[4rem] rounded-full bg-gray-300 flex items-center justify-center">
              <User size={24} color="#fff" />
            </div>
          )}

          <div className="flex-1">
            <p className="font-semibold text-lg">{participant?.name}</p>
            <p className="text-sm text-red-600 flex items-center gap-1">
              <MapPin size={16} />
              {`${participant?.city || "Cidade não definida"}, ${
                participant?.state || "Estado não definido"
              }, ${participant?.country || "País não definido"}`}
            </p>
          </div>
        </div>

        <div>
          <p
            className="text-sm mt-1 font-semibold"
            style={{
              color: getStatusColor(selectedParticipation.status),
            }}
          >
            Status:{" "}
            {selectedParticipation.status === "waiting"
              ? "Proposta Pendente"
              : selectedParticipation.status === "approved"
                ? "Trabalho em Progresso"
                : selectedParticipation.status === "completed"
                  ? "Trabalho Concluído"
                  : ""}
          </p>
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
                  {showFullDescription ? "Ver Menos" : "Ver Mais"}
                </button>
              )}
            </>
          ) : (
            "O influenciador não forneceu uma descrição detalhada."
          )}
        </div>

        <div className="flex gap-4 flex-wrap max-sm:gap-y-2">
          <button
            className="flex items-center gap-1 text-gray-700 font-semibold hover:underline"
            onClick={() => {
              window.open(
                `/influenciador/${participant?.username}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            <MagnifyingGlassPlus size={17} weight="bold" />
            Ver Perfil
          </button>

          {campaignData.status !== "ended" &&
            selectedParticipation.status !== "waiting" && (
              <button
                className="flex items-center gap-1 text-gray-700 font-semibold hover:underline"
                onClick={() => {
                  // Ação de "Enviar Mensagem" aqui
                }}
              >
                <MessageCircle size={17} />
                Enviar Mensagem
              </button>
            )}

          {/* {selectedParticipation.status === "completed" && (
            <button
              className="flex items-center gap-1 text-gray-700 font-semibold hover:underline"
              onClick={() => {
                setModalType("rateParticipant");
              }}
            >
              <Stars size={17} />
              Avaliar
            </button>
          )} */}
        </div>

        {selectedParticipation.status === "approved" && (
          <>
            <button
              className="px-4 py-2 bg-[#338B13] text-white rounded hover:bg-[#25670d] transition flex items-center w-[215px]"
              onClick={() => {
                setSelectedParticipation(selectedParticipation);
                setModalType("conclude");
              }}
            >
              <Flag size={18} className="mr-1" />
              Concluir Colaboração
            </button>
          </>
        )}

        <div>
          <h3 className="font-semibold text-lg flex items-center">
            Endereço{" "}
            <CaretDown className="ml-1 translate-y-0.5" weight="bold" />
          </h3>
          <p className="text-gray-700">
            CEP: {participant?.cep || "Não informado"}
          </p>
          <p className="text-gray-700">
            Rua: {participant?.street || "Não informado"}
          </p>
          <p className="text-gray-700">
            Complemento: {participant?.complement || "Não informado"}
          </p>
          <p className="text-gray-700">
            Número: {participant?.address_num || "Não informado"}
          </p>
          <p className="text-gray-700">
            Bairro: {participant?.neighborhood || "Não informado"}
          </p>
          <p className="text-gray-700">
            Cidade: {participant?.city || "Não informado"}
          </p>
          <p className="text-gray-700">
            Estado: {participant?.state || "Não informado"}
          </p>
          <p className="text-gray-700">
            País: {participant?.country || "Não informado"}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default InfoParticipantModal;