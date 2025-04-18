import React, { useState } from "react";
import axios from "axios";

import Modal from "./Modal";

import pb from "@/lib/pb";

import { UserAuth } from "@/types/UserAuth";
import { Campaign } from "@/types/Campaign";
import { Brand } from "@/types/Brand";
import { useTranslation } from "react-i18next";

interface Props {
  setModalType: React.ComponentState;
  campaignData: Campaign;
}

const ModalCancelCampaign: React.FC<Props> = ({
  setModalType,
  campaignData,
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [submittedCancel, setSubmittedCancel] = useState(false);

  const handleCancelCampaign = async () => {
    setLoadingCancel(true);

    const userData: UserAuth = JSON.parse(
      localStorage.getItem("pocketbase_auth") as string
    );

    const brandDetails: Brand = await pb
      .collection("Brands")
      .getOne(userData.model.id, {
        fields: "email,phone,contact_name",
      });

    try {
      await axios.post(
        `${import.meta.env.VITE_POCKETBASE_URL}/api/support_email`,
        {
          title: `Cancelamento da campanha: ${campaignData?.name}`,
          email: brandDetails.email,
          message: `
            Motivo do cancelamento: ${reason}
            
            Detalhes da Campanha:
            - Número de telefone: ${brandDetails?.cell_phone || "Telefone não cadastrado"}
            - Nome da marca: ${brandDetails?.name || "Sem nome"}
            - Nome do responsavel da campanha: ${campaignData.responsible_name}
            - Número do responsavel da campanha: ${campaignData.responsible_phone}
            - Email do responsavel: ${campaignData.responsible_email}
            - Nome da campanha: ${campaignData.name}
            - Orçamento Total: ${Number(campaignData?.open_jobs) * campaignData?.price || "Não informado"}
            - Link para a campanha: ${
              campaignData
                ? `${window.location.origin}/campanhas/${campaignData.id}`
                : "Não disponível"
            }

            Nota: Para acessar o link da campanha, a conta precisa estar logada na plataforma. Contas de marcas não podem acessar diretamente esta página.
          `,
        }
      );
      setSubmittedCancel(true);
    } catch (error) {
      console.error("Erro ao enviar pedido de cancelamento:", error);
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <Modal onClose={() => setModalType(null)}>
      {!submittedCancel ? (
        <>
          <h2 className="font-semibold mb-2 text-xl">
            {t("Cancelar Campanha")}
          </h2>
          <p className="text-gray-700 text-base mb-4">
            {t(
              "Caso deseje cancelar sua campanha, observe que nossa equipe de suporte avaliará a situação para garantir que todos os envolvidos sejam tratados de forma justa. Dependendo do progresso dos creators, a campanha poderá ter custos ou reembolsos parciais."
            )}
          </p>
          <h3 className="font-semibold text-lg mb-3">
            {t("Passo a Passo para o Cancelamento:")}
          </h3>
          <ol className="text-base text-gray-600 list-decimal list-inside mb-4">
            <li className="mb-2">
              <strong>{t("Entenda as Condições de Cancelamento")}</strong>
              <ul className="list-disc list-inside ml-4">
                <li>
                  <strong>{t("Nenhum Creator Selecionado:")}</strong>
                  {t(
                    " Se você não selecionou nenhum creator para trabalhar na campanha, seu reembolso será de 80% após a verificação da equipe."
                  )}
                </li>
                <li>
                  <strong>
                    {t("Creators com Status 'Trabalho em Progresso':")}
                  </strong>{" "}
                  {t(
                    "Caso existam creators em 'Trabalho em Progresso', poderá haver custos proporcionais ao trabalho já realizado. Nossa equipe determinará um reembolso justo com base no nível de cumprimento dos requisitos."
                  )}
                </li>
                <li>
                  <strong>
                    {t("Creators com Status 'Trabalho Concluído':")}
                  </strong>{" "}
                  {t(
                    "Se algum creator foi marcado como 'Trabalho Concluído', o valor referente ao trabalho deste creator não será reembolsado, já que você como a marca aceitou e aprovou a entrega final."
                  )}
                </li>
              </ul>
            </li>
            <li>
              <strong>
                {t(
                  " Forneça um Motivo para o Cancelamento (Campo de Feedback)"
                )}
              </strong>
              <p className="ml-4">
                {t(
                  "Para nos ajudar a entender e melhorar a experiência, descreva brevemente o motivo do cancelamento abaixo."
                )}
              </p>
            </li>
          </ol>
          <textarea
            className="w-full h-20 border border-gray-300 rounded p-2 mb-4"
            placeholder="Motivo do Cancelamento"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <p className="text-base font-semibold text-gray-700 mb-4">
            {t(
              "Deseja realmente cancelar a campanha? Isso irá enviar um aviso para a nossa equipe avaliar a situação."
            )}
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setModalType(null)}
              className="text-gray-600 hover:text-gray-900"
              disabled={loadingCancel}
            >
              {t("Fechar")}
            </button>
            <button
              onClick={handleCancelCampaign}
              className={`bg-[#942A2A] text-white px-4 py-2 rounded hover:bg-red-700 transition hover:cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
                loadingCancel && "opacity-30 cursor-not-allowed"
              }`}
              disabled={loadingCancel || !reason.trim()}
            >
              {loadingCancel ? t("Enviando...") : t("Sim, Cancelar campanha")}
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-semibold mb-5 text-xl">{t("Pedido Enviado")}</h2>
          <p className="text-gray-700 mb-4">
            {t(
              "Seu pedido de cancelamento foi enviado e será analisado pela nossa equipe."
            )}
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => setModalType(null)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              {t("Fechar")}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ModalCancelCampaign;
