import { useState } from "react";
import { PaperPlaneTilt } from "phosphor-react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "@tanstack/react-router";
import { t } from "i18next";

import { createOrGetChat, sendMessage } from "@/services/chatService";

import Modal from "@/components/ui/Modal";
import { Button } from "./button";

interface Props {
  creatorId: string;
  brandId: string;
}

const ModalSendDeliverable: React.FC<Props> = ({ creatorId, brandId }) => {
  const router = useRouter();
  const [isSendDeliverableOpen, setIsSendDeliverableOpen] = useState(false);
  const [deliverable, setDeliverable] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartChat = async (influencerId: string, brandId: string) => {
    try {
      const chat = await createOrGetChat("", influencerId, brandId);

      router.navigate({
        to: "/dashboard/chat/",
        search: {
          campaignId: chat.campaign,
          influencerId: chat.influencer,
          brandId: chat.brand,
        },
      });

      await sendMessage(chat?.id, deliverable, "Influencers");
    } catch (error) {
      console.error("Erro ao iniciar o chat:", error);
      toast(t("Não foi possível iniciar o chat"), {
        type: "error",
      });
    }
  };

  const handleSendDeliverable = async () => {
    if (!deliverable.trim()) {
      toast.warning(t("Por favor, preencha os campos obrigatórios"));
      return;
    }

    setIsSubmitting(true);

    try {
      await handleStartChat(creatorId, brandId);

      setIsSendDeliverableOpen(false);
    } catch (error) {
      console.error("Erro ao enviar o link:", error);
      toast.error(t("Ocorreu um erro ao enviar o link. Tente novamente."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        className="w-full lg:w-auto flex justify-center items-center px-4 py-2 rounded-md font-bold border bg-[#10438F] text-white hover:bg-[#10438F]/90 flex items-center"
        onClick={() => setIsSendDeliverableOpen(true)}
      >
        <PaperPlaneTilt weight="bold" className="mr-2" />{" "}
        {t("Enviar Entregáveis")}
      </button>

      {isSendDeliverableOpen && (
        <Modal onClose={() => setIsSendDeliverableOpen(false)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="linkInput"
                className="block font-bold text-gray-700 mb-2"
              >
                {t("Entregáveis")}
              </label>
              <textarea
                id="linkInput"
                className="w-full border border-gray-300 rounded-md p-2 max-h-[60dvh] min-h-40"
                placeholder={t(
                  "Envie o conteúdo dos entregáveis requisitados pela Marca ou envie suas dúvidas"
                )}
                value={deliverable}
                onChange={(e) => setDeliverable(e.target.value)}
              ></textarea>
            </div>

            <div className="text-right">
              <Button
                variant={"blue"}
                className={`${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSendDeliverable}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("Enviando...") : t("Enviar Entregáveis")}
              </Button>
            </div>
          </div>
          <ToastContainer />
        </Modal>
      )}
    </>
  );
};

export default ModalSendDeliverable;
