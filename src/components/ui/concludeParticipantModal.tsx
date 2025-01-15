import React, { useState } from "react";
import { MapPin, User } from "lucide-react";
import { t } from "i18next";

import Modal from "./Modal";

import pb from "@/lib/pb";

import { Influencer } from "@/types/Influencer";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { toast } from "react-toastify";

interface Props {
  participant: Influencer;
  selectedParticipation: CampaignParticipation;
  setModalType: React.ComponentState;
  updateParticipationStatus: (
    participationId: string,
    newStatus: string
  ) => void;
}

const ConcludeModalParticipant: React.FC<Props> = ({
  participant,
  selectedParticipation,
  setModalType,
  updateParticipationStatus,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Modal onClose={() => setModalType(null)}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t("Concluir Colaboração")}</h2>

        <div className="flex flex-wrap items-center gap-4">
          {participant.profile_img ? (
            <img
              src={pb.files.getUrl(participant, participant.profile_img)}
              alt="Foto do Creator"
              className="w-16 h-16 min-w-[4rem] rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 min-w-[4rem] rounded-full bg-gray-300 flex items-center justify-center">
              <User size={24} color="#fff" />
            </div>
          )}
          <div>
            <p className="font-semibold text-lg">{participant.name}</p>
            <p className="text-sm text-red-600 flex items-center gap-1">
              <MapPin size={16} />
              {`${participant.city || t("Cidade não definida")}, ${
                participant.state || t("Estado não definido")
              }, ${participant.country || t("País não definido")}`}
            </p>
          </div>
        </div>

        <p className="text-gray-700">
          {t(
            "Ao Concluir Colaboração, você está confirmando que o creator completou todas as atividades conforme o combinado, e que a campanha foi concluída com sucesso pela parte desse creator. Essa ação indica que o trabalho atendeu às expectativas da marca e não poderá ser desfeita."
          )}
        </p>

        <p className="font-medium">{t("Deseja realmente concluir")}?</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setModalType(null)}
            className="text-gray-600 hover:underline"
          >
            {t("Cancelar")}
          </button>
          <button
            onClick={async () => {
              setLoading(true);

              try {
                await pb
                  .collection("Campaigns_Participations")
                  .update(selectedParticipation.id as string, {
                    status: "completed",
                  });

                toast(t("Status do candidato atualizado com sucesso"));

                updateParticipationStatus(
                  selectedParticipation?.id as string,
                  "completed"
                );

                setModalType("rateParticipant");
              } catch (error) {
                console.error("Erro ao concluir colaboração:", error);
                toast(t("Ocorreu um erro ao atualizar o status do candidato"));
              } finally {
                setLoading(false);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? t("Aguarde...") : t("Sim, Concluir")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConcludeModalParticipant;
