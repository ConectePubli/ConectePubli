import React, { useState } from "react";
import { MapPin, User } from "lucide-react";

import Modal from "./Modal";

import pb from "@/lib/pb";
import { Influencer } from "@/types/Influencer";
import { CampaignParticipation } from "@/types/Campaign_Participations";

interface Props {
  participant: Influencer;
  selectedParticipation: CampaignParticipation;
  setModalType: React.ComponentState;
}

const RateParticipantModal: React.FC<Props> = ({
  participant,
  setModalType,
}) => {
  const [ratings, setRatings] = useState({
    creativeContent: 0,
    punctuality: 0,
    engagement: 0,
  });
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("TODO DO: RATE");
      setModalType(null);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={() => setModalType(null)}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Avaliar Influencer</h2>

        <div className="flex flex-wrap items-center gap-4">
          {participant.profile_img ? (
            <img
              src={pb.files.getUrl(participant, participant.profile_img)}
              alt="Foto do Influenciador"
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
              {`${participant.city || "Cidade não definida"}, ${
                participant.state || "Estado não definido"
              }, ${participant.country || "País não definido"}`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-medium">
              Quão bem o conteúdo produzido atendeu às diretrizes criativas?
            </p>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setRatings((prev) => ({ ...prev, creativeContent: value }))
                  }
                  className={`px-4 py-2 rounded border ${
                    ratings.creativeContent === value
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium">
              Quão pontual e comprometido foi o influenciador?
            </p>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setRatings((prev) => ({ ...prev, punctuality: value }))
                  }
                  className={`px-4 py-2 rounded border ${
                    ratings.punctuality === value
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium">
              Como você avalia o alcance e engajamento do conteúdo?
            </p>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setRatings((prev) => ({ ...prev, engagement: value }))
                  }
                  className={`px-4 py-2 rounded border ${
                    ratings.engagement === value
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2" htmlFor="comment">
              Deixe um comentário sobre este influenciador
            </label>
            <textarea
              id="comment"
              className="w-full h-24 border border-gray-300 rounded p-2"
              placeholder="Ex.: Excelente profissional, cumpriu todos os prazos com qualidade!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setModalType(null)}
            className="text-gray-600 hover:underline"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={
              loading ||
              !ratings.creativeContent ||
              !ratings.punctuality ||
              !ratings.engagement ||
              !comment.trim()
            }
          >
            {loading ? "Enviando..." : "Avaliar"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RateParticipantModal;
