import React, { useState } from "react";
import { PaperPlaneTilt, Warning } from "phosphor-react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "@tanstack/react-router";

import { createOrGetChat } from "@/services/chatService";

import Modal from "@/components/ui/Modal";
import { UserAuth } from "@/types/UserAuth";

interface Props {
  campaignId: string;
  brandId: string;
}

const ModalSendLinkCampaign: React.FC<Props> = ({ campaignId, brandId }) => {
  const router = useRouter();
  const [isEnviarLinkModalOpen, setIsEnviarLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // enviar link para chat da marca
  const handleStartChat = async () => {
    try {
      const user: UserAuth = JSON.parse(
        localStorage.getItem("pocketbase_auth") as string
      );
      const chat = await createOrGetChat(campaignId, user.model.id, brandId);

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
    }
  };

  const handleEnviarLink = async () => {
    if (!linkUrl.trim()) {
      toast.warning("Por favor, preencha os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);

    try {
      await handleStartChat();
      setIsEnviarLinkModalOpen(false);
    } catch (error) {
      console.error("Erro ao enviar o link:", error);
      alert("Ocorreu um erro ao enviar o link. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        className="px-4 py-2 rounded-md mt-2 font-bold border bg-[#10438F] text-white hover:bg-[#10438F]/90 flex items-center"
        onClick={() => setIsEnviarLinkModalOpen(true)}
      >
        <PaperPlaneTilt weight="bold" className="mr-2" /> Enviar link
      </button>

      {isEnviarLinkModalOpen && (
        <Modal onClose={() => setIsEnviarLinkModalOpen(false)}>
          <div className="space-y-4">
            <div className="bg-yellow-100 p-4 rounded-md text-yellow-800 text-sm font-semibold flex items-center gap-2 max-sm:gap-0">
              <Warning size={18} className="w-4 h-4 max-sm:min-w-[2rem]" />{" "}
              Importante lembrar que uma taxa de sucesso de 20% será aplicada
            </div>

            <div>
              <label
                htmlFor="linkInput"
                className="block font-bold text-gray-700 mb-2"
              >
                URL da Postagem
              </label>
              <textarea
                id="linkInput"
                className="w-full border border-gray-300 rounded-md p-2 max-h-[60dvh] min-h-40"
                placeholder="Cole aqui a URL da(s) postagem(ns) conforme orientado na campanha. Se desejar, inclua mais de um link e adicione texto adicional para contexto!"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              ></textarea>
            </div>

            <div className="text-right">
              <button
                className={`px-4 py-2 rounded-md font-bold text-white bg-blue-600 hover:bg-blue-700 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleEnviarLink}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar link"}
              </button>
            </div>
          </div>
          <ToastContainer />
        </Modal>
      )}
    </>
  );
};

export default ModalSendLinkCampaign;
