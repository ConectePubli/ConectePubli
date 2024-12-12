import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import pb from "@/lib/pb";
import { toast } from "react-toastify";
import logo from "@/assets/logo.svg";
import { Campaign } from "@/types/Campaign";

interface Props {
  setModalType: React.ComponentState;
  campaign: Campaign;
}

const RatePlatformModal: React.FC<Props> = ({ setModalType, campaign }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"Brands" | "Influencers" | null>(
    null
  );

  useEffect(() => {
    const checkType = async () => {
      const type = pb.authStore.model?.collectionName;
      setUserType(type);
    };
    checkType();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!rating || !comment.trim()) {
        toast.error("Por favor, preencha todos os campos.");
        return;
      }

      const feedback = [
        {
          question:
            "Em uma escala de 1 a 5, como você avalia sua satisfação geral com a plataforma Conecte Publi, considerando navegação, funcionalidades e suporte?",
          short_term: "Satisfação geral",
          rating: rating,
        },
      ];

      // Montando o objeto de criação da avaliação
      const dataToCreate: {
        comment: string;
        to_conectepubli: boolean;
        feedback: { question: string; rating: number }[];
        from_brand?: string;
        from_influencer?: string;
        campaign?: string;
      } = {
        comment,
        to_conectepubli: true,
        feedback: feedback,
        campaign: campaign.id,
      };

      if (userType === "Brands") {
        dataToCreate.from_brand = pb.authStore.model?.id;
      } else if (userType === "Influencers") {
        dataToCreate.from_influencer = pb.authStore.model?.id;
      } else {
        toast.error("Não foi possível identificar o tipo de usuário.");
        return;
      }

      await pb.collection("ratings").create(dataToCreate);

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
        <h2 className="text-xl font-semibold">Avaliar Plataforma</h2>
        <div className="border-t border-gray-300" />

        {/* Logo da plataforma */}
        <div className="flex">
          <img
            src={logo}
            alt="Logo Conecte Publi"
            className="w-full h-20 object-contain"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="border-t border-gray-300" />
          {/* Rating */}
          <div>
            <p className="font-medium">
              Em uma escala de 1 a 5, como você avalia sua satisfação geral com
              a plataforma Conecte Publi, considerando navegação,
              funcionalidades e suporte?
            </p>
            <div className="flex gap-2 mt-2 w-full">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className={`flex-1 px-4 py-2 rounded border border-[#10438F] text-center ${
                    rating === value
                      ? "bg-[#10438F] text-white"
                      : "bg-white text-[#10438F]"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              (1 = Muito insatisfeito(a), 5 = Muito satisfeito)
            </p>
          </div>

          <div className="h-[1px] bg-gray-300 items-center" />
          <div>
            <label className="block font-medium mb-2" htmlFor="comment">
              Sugestões, críticas ou comentários*
            </label>
            <textarea
              id="comment"
              className="w-full h-24 border border-gray-300 rounded p-2"
              placeholder="Escreva aqui suas sugestões, críticas ou comentários sobre como podemos melhorar a experiência na Conecte Publi e fortalecer as parcerias entre marcas e influenciadores."
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
            disabled={loading || userType === null}
          >
            {loading ? "Enviando..." : "Avaliar"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RatePlatformModal;
