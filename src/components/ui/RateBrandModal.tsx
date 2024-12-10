import React, { useState } from "react";
import { MapPin, User } from "lucide-react";

import Modal from "./Modal";

import pb from "@/lib/pb";
import { Influencer } from "@/types/Influencer";
import { toast } from "react-toastify";
import { Brand } from "@/types/Brand";
import { Campaign } from "@/types/Campaign";

interface Props {
  participant: Influencer;
  brand: Brand;
  campaign: Campaign;
  setModalType: React.ComponentState;
}

const RateBrandModal: React.FC<Props> = ({
  participant,
  brand,
  campaign,
  setModalType,
}) => {
  const [ratings, setRatings] = useState({
    clarity: 0,
    availability: 0,
    realisticExpectations: 0,
  });
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (
        !ratings.clarity ||
        !ratings.availability ||
        !ratings.realisticExpectations ||
        !comment.trim()
      ) {
        toast.error("Por favor, preencha todos os campos.");
        return;
      }

      const feedback = [
        {
          question:
            "Quão claro foi o briefing fornecido pela marca em relação aos objetivos, público-alvo e diretrizes da campanha?",
          rating: ratings.clarity,
        },
        {
          question:
            "Como você avalia a disponibilidade e a agilidade da marca em responder às dúvidas ou solicitações durante o projeto?",
          rating: ratings.availability,
        },
        {
          question:
            "A marca demonstrou expectativas realistas e lidou bem com ajustes necessários durante a campanha?",
          rating: ratings.realisticExpectations,
        },
      ];

      await pb.collection("ratings").create({
        to_brand: brand.id,
        from_influencer: participant.id,
        campaign: campaign.id,
        comment,
        feedback: feedback,
      });

      toast.success("Avaliação enviada com sucesso!");
      setModalType(null);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast.error("Ocorreu um erro ao enviar a avaliação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={() => setModalType(null)}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Avaliar Marca</h2>
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
              {`${participant.city || "Cidade não definida"}, ${
                participant.state || "Estado não definido"
              }, ${participant.country || "País não definido"}`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border-t border-gray-300" />
          {/* Clarity */}
          <div>
            <p className="font-medium">
              Quão claro foi o briefing fornecido pela marca em relação aos
              objetivos, público-alvo e diretrizes da campanha?
            </p>
            <div className="flex gap-2 mt-2 w-full">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setRatings((prev) => ({ ...prev, clarity: value }))
                  }
                  className={`flex-1 px-4 py-2 rounded border border-[#10438F] text-center ${
                    ratings.clarity === value
                      ? "bg-[#10438F] text-white"
                      : "bg-white text-[#10438F]"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              (1 = Nada claro, 5 = Extremamente claro)
            </p>
          </div>

          <div className="h-[1px] bg-gray-300 items-center" />
          {/* Availability */}
          <div>
            <p className="font-medium">
              Como você avalia a disponibilidade e a agilidade da marca em
              responder às dúvidas ou solicitações durante o projeto?
            </p>
            <div className="flex gap-2 mt-2 w-full">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setRatings((prev) => ({ ...prev, availability: value }))
                  }
                  className={`flex-1 px-4 py-2 rounded border border-[#10438F] text-center ${
                    ratings.availability === value
                      ? "bg-[#10438F] text-white"
                      : "bg-white text-[#10438F]"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              (1 = Muito insatisfatória, 5 = Excelente)
            </p>
          </div>

          <div className="h-[1px] bg-gray-300 items-center" />
          {/* Realistic Expectations */}
          <div>
            <p className="font-medium">
              A marca demonstrou expectativas realistas e lidou bem com ajustes
              necessários durante a campanha?
            </p>
            <div className="flex gap-2 mt-2 w-full">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setRatings((prev) => ({
                      ...prev,
                      realisticExpectations: value,
                    }))
                  }
                  className={`flex-1 px-4 py-2 rounded border border-[#10438F] text-center ${
                    ratings.realisticExpectations === value
                      ? "bg-[#10438F] text-white"
                      : "bg-white text-[#10438F]"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              (1 = Muito abaixo do esperado, 5 = Muito acima do esperado)
            </p>
          </div>

          <div className="h-[1px] bg-gray-300 items-center" />
          <div>
            <label className="block font-medium mb-2" htmlFor="comment">
              Deixe um comentário sobre esta marca*
            </label>
            <textarea
              id="comment"
              className="w-full h-24 border border-gray-300 rounded p-2"
              placeholder="Escreva aqui um comentário sobre a marca."
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
            className="bg-[#10438F] text-white px-4 py-2 rounded hover:bg-[#10438F]/90 transition cursor-pointer"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Avaliar"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RateBrandModal;
