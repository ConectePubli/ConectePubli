import React, { useState } from "react";
import { MapPin, User } from "lucide-react";

import Modal from "./Modal";

import pb from "@/lib/pb";

import { Influencer } from "@/types/Influencer";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { toast } from "react-toastify";

interface Props {
  participant: Influencer;
  selectedParticipation: CampaignParticipation;
  setModalType: React.ComponentState;
}

const ConcludeModalParticipant: React.FC<Props> = ({
  participant,
  selectedParticipation,
  setModalType,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Modal onClose={() => setModalType(null)}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Concluir Colaboração</h2>

        <div className="flex items-center gap-4">
          {participant.profile_img ? (
            <img
              src={pb.files.getUrl(participant, participant.profile_img)}
              alt="Foto do Influenciador"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={24} color="#fff" />
            </div>
          )}
          <div>
            <p className="font-semibold text-lg">{participant.name}</p>
            <p className="text-sm text-red-600 flex items-center gap-1">
              <MapPin size={16} />
              {`${participant.city || "Cidade não definida"}, ${
                participant.state || "Estado não definido"
              }, ${participant.country || "País não definido"}`}
            </p>
          </div>
        </div>

        <p className="text-gray-700">
          Ao Concluir Colaboração, você está confirmando que o influenciador(a)
          completou todas as atividades conforme o combinado, e que a campanha
          foi concluída com sucesso pela parte desse influenciador. Essa ação
          indica que o trabalho atendeu às expectativas da marca e não poderá
          ser desfeita.
        </p>

        <p className="font-medium">Deseja realmente concluir?</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setModalType(null)}
            className="text-gray-600 hover:underline"
          >
            Cancelar
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

                toast("Status do candidato atualizado com sucesso");

                setModalType(null);

                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              } catch (error) {
                console.error("Erro ao concluir colaboração:", error);
                toast("Ocorreu um erro ao atualizar o status do candidato");
              } finally {
                setLoading(false);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Aguarde..." : "Sim, Concluir"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConcludeModalParticipant;
