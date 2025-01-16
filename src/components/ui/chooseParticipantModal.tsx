import React, { useState } from "react";
import { MapPin, User } from "lucide-react";

import Modal from "./Modal";
import { Button } from "./button";

import { Influencer } from "@/types/Influencer";

import pb from "@/lib/pb";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface Props {
  setModalType: React.ComponentState;
  participant: Influencer;
  selectedParticipantion: CampaignParticipation;
  updateParticipationStatus: (
    participationId: string,
    newStatus: string
  ) => void;
}

const ChooseParticipantModal: React.FC<Props> = ({
  setModalType,
  participant,
  selectedParticipantion,
  updateParticipationStatus,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Modal onClose={() => setModalType(null)}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t("Escolher Influencer")}</h2>

        <div className="flex flex-wrap items-center gap-2">
          {participant?.profile_img ? (
            <img
              src={pb.files.getUrl(participant, participant?.profile_img)}
              alt="Foto do Creator"
              className="w-16 h-16 min-w-[4rem] rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 min-w-[4rem] rounded-full bg-gray-300 flex items-center justify-center">
              <User size={20} color="#fff" />
            </div>
          )}
          <div>
            <p className="font-semibold text-lg">{participant?.name}</p>
            <p className="text-sm text-red-600 flex items-center gap-1">
              <MapPin size={16} />
              {`${participant?.city}, ${participant?.state}, ${participant?.country}`}
            </p>
          </div>
        </div>

        <p className="text-gray-700">
          {t(
            "Ao escolher este(a) creator, você está confirmando a participação dele(a) na campanha e autorizando o início das atividades conforme os termos acordados. O(a) creator será responsável por executar as tarefas conforme o briefing da campanha e entregar os conteúdos no prazo estabelecido."
          )}
        </p>

        <p className="font-medium">{t("Deseja confirmar a aprovação?")}</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setModalType(null)}
            className="text-gray-600 hover:text-gray-900"
          >
            {t("Cancelar")}
          </button>

          <Button
            variant={"blue"}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={async () => {
              setLoading(true);

              try {
                await pb
                  .collection("Campaigns_Participations")
                  .update(selectedParticipantion?.id as string, {
                    status: "approved",
                  });

                toast(t("Status do candidato atualizado com sucesso"));

                updateParticipationStatus(
                  selectedParticipantion?.id as string,
                  "approved"
                );

                setModalType(null);
              } catch (e) {
                console.log(`Erro ao atualizar status: ${e}`);
                toast(t("Ocorreu um erro ao atualizar o status do candidato"));
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? t("Aguarde...") : t("Escolher para Campanha")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChooseParticipantModal;
