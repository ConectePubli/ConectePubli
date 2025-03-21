import React, { useState } from "react";
import { MapPin, User } from "lucide-react";

import Modal from "./Modal";

import pb from "@/lib/pb";
import { Influencer } from "@/types/Influencer";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "axios";

interface Props {
  participant: Influencer;
  selectedParticipation: CampaignParticipation;
  setModalType: React.ComponentState;
}

const RateParticipantModal: React.FC<Props> = ({
  participant,
  selectedParticipation,
  setModalType,
}) => {
  const { t } = useTranslation();
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
      if (
        !ratings.creativeContent ||
        !ratings.punctuality ||
        !ratings.engagement ||
        !comment.trim()
      ) {
        toast.error(t("Por favor, preencha todos os campos."));
        return;
      }

      const feedback = [
        {
          question: "Quão bem o conteúdo produzido atendeu às diretrizes?",
          short_term: "Qualidade",
          rating: ratings.creativeContent,
        },
        {
          question: "Pontualidade e comunicação do influenciador?",
          short_term: "Pontualidade",
          rating: ratings.punctuality,
        },
        {
          question: "Como avalia o alcance e engajamento?",
          short_term: "Performance",
          rating: ratings.engagement,
        },
      ];

      await pb.collection("ratings").create({
        to_influencer: participant.id,
        from_brand: selectedParticipation.expand?.campaign?.brand,
        campaign: selectedParticipation.expand?.campaign?.id,
        comment,
        feedback: feedback,
      });

      toast.success(t("Avaliação enviada com sucesso!"));
      setModalType(null);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast.error("Ocorreu um erro ao enviar a avaliação.");
    } finally {
      setLoading(false);
    }
  };

  const sendMail = async () => {
    try {
      const response = await axios.post(
        `https://conecte-publi.pockethost.io/api/send_brand_reminder_evaluation`,
        {
          brandEmail: pb.authStore.model?.email,
          brandName: pb.authStore.model?.name,
          creatorName: participant.name,
          campaignName: selectedParticipation.expand?.campaign?.name,
          evaluationLink: `/dashboard/campanhas/${selectedParticipation.expand?.campaign?.id}/aprovar`,
        }
      );

      console.log(response);
    } catch (e) {
      console.log(`error sending reminder brand evaluation: ${e}`);
    }
  };

  return (
    <Modal onClose={() => setModalType(null)}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t("Avaliar Influencer")}</h2>
        <div className="border-t border-gray-300" />
        <div className="flex flex-wrap items-center gap-4">
          {participant.profile_img ? (
            <img
              src={pb.files.getUrl(participant, participant.profile_img)}
              alt="Foto do Creator"
              className="w-12 h-12 min-w-[3rem] rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 min-w-[3rem] rounded-full bg-gray-300 flex items-center justify-center">
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

        <div className="flex flex-col gap-4">
          <div className="border-t border-gray-300" />
          <div>
            <p className="font-medium">
              {t(
                "Quão bem o conteúdo produzido atendeu às diretrizes criativas e aos objetivos da campanha?"
              )}
            </p>
            <div className="flex gap-2 mt-2 w-full">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setRatings((prev) => ({ ...prev, creativeContent: value }))
                  }
                  className={`flex-1 px-4 py-2 rounded border border-[#10438F] text-center ${
                    ratings.creativeContent === value
                      ? "bg-[#10438F] text-white"
                      : "bg-white text-[#10438F]"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {t(
                "(1 = Não atendeu de forma alguma, 5 = Atendeu perfeitamente)"
              )}
            </p>
          </div>

          <div className="h-[1px] bg-gray-300 items-center" />
          <div>
            <p className="font-medium">
              {t(
                "Quão pontual e comprometido foi o influenciador em cumprir os prazos e manter uma comunicação clara durante o processo?"
              )}
            </p>
            <div className="flex gap-2 mt-2 w-full">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setRatings((prev) => ({ ...prev, punctuality: value }))
                  }
                  className={`flex-1 px-4 py-2 rounded border border-[#10438F] text-center ${
                    ratings.punctuality === value
                      ? "bg-[#10438F] text-white"
                      : "bg-white text-[#10438F]"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {t(
                "(1 = Extremamente insatisfatório, 5 = Extremamente satisfatório)"
              )}
            </p>
          </div>

          <div className="h-[1px] bg-gray-300 items-center" />
          <div>
            <p className="font-medium">
              {t(
                "Como você avalia o alcance e o engajamento do conteúdo produzido em termos de interações, cliques ou conversões?"
              )}
            </p>
            <div className="flex gap-2 mt-2 w-full">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setRatings((prev) => ({ ...prev, engagement: value }))
                  }
                  className={`flex-1 px-4 py-2 rounded border border-[#10438F] text-center ${
                    ratings.engagement === value
                      ? "bg-[#10438F] text-white"
                      : "bg-white text-[#10438F]"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {t(
                "(1 = Muito abaixo das expectativas, 5 = Muito acima das expectativas)"
              )}
            </p>
          </div>

          <div className="h-[1px] bg-gray-300 items-center" />
          <div>
            <label className="block font-medium mb-2" htmlFor="comment">
              {t("Deixe um comentário sobre este creator*")}
            </label>
            <textarea
              id="comment"
              className="w-full h-24 border border-gray-300 rounded p-2"
              placeholder="Escreva aqui um comentário que será exibido no perfil do creator. Ex.: 'Excelente profissional, cumpriu todos os prazos com qualidade!'."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setModalType(null);
              sendMail();
            }}
            className="text-gray-600 hover:underline"
            disabled={loading}
          >
            {t("Cancelar")}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#10438F] text-white px-4 py-2 rounded hover:bg-[#10438F]/90 transition cursor-pointer"
            disabled={loading}
          >
            {loading ? t("Enviando...") : t("Avaliar")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RateParticipantModal;
