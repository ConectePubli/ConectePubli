import React, { useState } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import RateParticipantModal from "./rateParticipantModal";
import pb from "@/lib/pb";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { toast } from "react-toastify";
import { Button } from "./button";
import { Influencer } from "@/types/Influencer";

interface Props {
  onClose: () => void;
  participation: CampaignParticipation;
  onStatusChange: () => void;
}

const ModalNotDelivered: React.FC<Props> = ({
  onClose,
  participation,
  onStatusChange,
}) => {
  const { t } = useTranslation();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmNotDelivered = async () => {
    setLoading(true);
    try {
      await pb
        .collection("Campaigns_Participations")
        .update(participation.id!, {
          status: "canceled",
        });

      toast.success(t("Status atualizado com sucesso!"));
      onStatusChange();
      setShowRatingModal(true);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(t("Ocorreu um erro ao atualizar o status."));
    } finally {
      setLoading(false);
    }
  };

  if (showRatingModal) {
    return (
      <RateParticipantModal
        participant={participation.expand?.influencer as Influencer}
        selectedParticipation={participation}
        jobCanceled={true}
        setModalType={() => {
          setShowRatingModal(false);
          onClose();
        }}
      />
    );
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-semibold">
            {t("Confirmar Não Entrega do Creator")}
          </h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-sm">
            {t("Você está prestes a marcar que o Creator")}{" "}
            <span className="font-bold">
              {participation.expand?.influencer?.name}
            </span>{" "}
            {t("NÃO entregou o trabalho nesta campanha.")}
          </p>
          <div className="text-sm">
            {t("Essa ação confirma que:")}
            <ul className="list-disc pl-4 mt-2 text-sm">
              <li>
                {t("O Creator não cumpriu o escopo combinado dentro do prazo.")}
              </li>
              <li>{t("O valor reservado será estornado para você.")}</li>
              <li>
                {t(
                  "O reembolso será processado e disponibilizado no próximo dia 15 do mês subsequente à confirmação."
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-100 p-4 rounded-md flex items-start gap-2 mt-4">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <p className="text-yellow-800 text-sm">
            {t("Importante: Essa ação é definitiva e não poderá ser desfeita.")}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("Voltar")}
          </button>

          <div className="flex gap-4">
            <Button
              onClick={handleConfirmNotDelivered}
              disabled={loading}
              variant="brown"
              className="px-4 py-2  text-white rounded-md  disabled:opacity-50 font-bold"
            >
              {loading ? t("Confirmando...") : t("Confirmar não entrega")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalNotDelivered;
