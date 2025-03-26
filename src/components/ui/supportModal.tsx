import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import axios from "axios";
import { Button } from "@/components/ui/button";

import { Influencer } from "@/types/Influencer";
import { MapPin, User } from "lucide-react";

import pb from "@/lib/pb";
import { toast } from "react-toastify";
import { Campaign } from "@/types/Campaign";
import { Brand } from "@/types/Brand";
import { t } from "i18next";

interface Props {
  campaignData: Campaign;
  participant: Influencer;
  setModalType: React.ComponentState;
}

const SupportModal: React.FC<Props> = ({
  campaignData,
  participant,
  setModalType,
}) => {
  const [supportMessage, setSupportMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSendSupportMessage = async () => {
    setIsSubmitting(true);

    try {
      const userData = JSON.parse(
        localStorage.getItem("pocketbase_auth") as string
      );

      const brandDetails: Brand = await pb
        .collection("Brands")
        .getOne(userData.model.id, {
          fields: "name,email,cell_phone",
        });

      const message = `
        **Detalhes da Marca:**
        - Nome da Marca: ${brandDetails?.name || "Não informado"}
        - Número de telefone: ${brandDetails.cell_phone}
        - Nome do Responsável: ${campaignData.responsible_name || "Não informado"}
        - Número do Responsável: ${campaignData.responsible_name || "Não informado"}
        - Email do Responsável: ${campaignData.responsible_email || "Não informado"}
        
        **Detalhes da Campanha:**
        - Nome da Campanha: ${campaignData?.name || "Não informado"}
        - Orçamento Total: ${Number(campaignData?.open_jobs) * campaignData?.price || "Não informado"}
        - Link para a Campanha: ${
          campaignData
            ? `${window.location.origin}/campanhas/${campaignData.id}`
            : "Não disponível"
        }

        Nota: Para acessar o link da campanha, a conta precisa estar logada na plataforma. Contas de marcas não têm acesso direto.

        **Detalhes do Creator:**
        - Nome: ${participant?.name || "Não informado"}
        - Número de Telefone: ${participant?.cell_phone || "Não informado"}
        - Email: ${participant?.email || "Não informado"}
  
        **Mensagem da Marca:**
        ${supportMessage.trim() || "Nenhuma mensagem adicional."}
      `;

      // Enviar e-mail
      await axios.post(
        "https://pocketbase.conectepubli.com/api/support_email",
        {
          title: `Solicitação de Mediação - Campanha ${campaignData?.name || "Desconhecida"}`,
          email: brandDetails?.email || "sem-email@dominio.com",
          message: message,
        }
      );

      setIsSubmitted(true);
    } catch (error) {
      console.error("Erro ao enviar pedido de suporte:", error);
      toast.error(
        t("Ocorreu um erro ao enviar sua solicitação. Tente novamente.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      onClose={() => {
        setIsSubmitted(false);
        setModalType(null);
      }}
    >
      {!isSubmitted ? (
        <>
          <h2 className="text-xl font-semibold mb-4">
            {t("Solicitar Mediação para o Trabalho do Creator")}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            {participant.profile_img ? (
              <img
                src={pb.files.getUrl(participant, participant.profile_img)}
                alt="Foto do Creator"
                className="w-16 h-16 min-w-[4rem] rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 min-w-[4rem] rounded-full bg-gray-300 flex items-center justify-center">
                <User size={24} color="#fff" />
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

          <p className="text-sm text-gray-600 mb-4">
            {t(
              "Se houver divergências no trabalho deste creator, nossa equipe de suporte pode ajudar a mediar o caso. No entanto, caso ambas as partes cheguem a um acordo por conta própria, vocês podem resolver a situação diretamente."
            )}
          </p>

          <h3 className="text-base font-semibold mb-2">
            {t("Passo a passo para resolver a situação")}:
          </h3>
          <ol className="list-decimal list-inside mb-4 text-sm text-gray-700">
            <li>
              <strong>{t("Tente resolver diretamente")}:</strong>{" "}
              {t(
                "Recomendamos dialogar com o creator e oferecer feedback antes de contatar o suporte. Exemplos:"
              )}
              <ul className="list-disc ml-6 mt-1">
                <li>
                  <em>{t("Descumprimento parcial")}:</em>{" "}
                  {t(
                    "Caso haja pequenas falhas, como hashtags faltando, solicite que o creator ajuste o conteúdo."
                  )}
                </li>
                <li>
                  <em>{t("Prazos não cumpridos")}:</em>{" "}
                  {t(
                    "Lembre o creator da importância do prazo e veja se é possível uma reprogramação."
                  )}
                </li>
                <li>
                  <em>{t("Inconsistência na mensagem")}:</em>{" "}
                  {t(
                    "Se o conteúdo não  segue as diretrizes, explique o que deve ser corrigido antes de optar pelo suporte."
                  )}
                </li>
              </ul>
            </li>
          </ol>

          <h3 className="text-sm font-semibold mb-3">
            {t(
              "Em casos simples (como desistência do creator), peça para ele(a) clicar em “Desinscrever-se da Campanha” para uma saída rápida e amigável."
            )}
          </h3>

          <ol className="list-none list-decimal list-inside mb-4 text-sm text-gray-700">
            <li className="mb-3">
              <strong>
                2. {t("Processo de mediação e custos")} (
                {t("Caso seja necessário")}):
              </strong>{" "}
              <ul className="list-disc ml-6 mt-1">
                <li>
                  <em>
                    {t("Se o creator cumpriu os requisitos da campanha")}:
                  </em>{" "}
                  {t(
                    "Caso a marca deseje desqualificar o creator que realizou o trabalho conforme as especificações da campanha, poderá ser necessário pagar 20% do valor acordado para esse creator."
                  )}
                </li>
                <li>
                  <em>{t("Se o Creator Não Realizou o Trabalho")}:</em>{" "}
                  {t(
                    "Caso o creator não tenha colaborado ou não tenha entregue nenhum conteúdo relevante para a campanha, a marca terá direito ao reembolso integral para essa posição específica na campanha depois de uma avaliação da equipe da ConectePubli."
                  )}
                </li>
              </ul>
            </li>
            <li className="mb-3">
              <strong>3. {t("Coleta de evidências para mediação")}:</strong>{" "}
              {t(
                "Caso o suporte seja acionado, ambas as partes deverão fornecer evidências (comunicações, entregas e outras documentações relevantes) para embasar a decisão."
              )}
            </li>
            <li className="mb-3">
              <strong>4. {t("Contato e acompanhamento")}:</strong>{" "}
              {t(
                "Se não houver acordo direto, nossa equipe de suporte entrará em contato com ambas as partes para entender melhor a situação e ajudar a encontrar uma solução justa."
              )}
            </li>
          </ol>

          <label
            className="block mb-2 text-sm font-medium text-gray-900"
            htmlFor="supportMessage"
          >
            {t("Explique a situação")}
          </label>
          <textarea
            id="supportMessage"
            className="w-full h-32 border border-gray-300 rounded-lg p-2 mb-4 text-sm"
            placeholder={t(
              "Descreva brevemente o problema que está ocorrendo..."
            )}
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            disabled={isSubmitting}
          />

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setModalType(null)}
              className="text-gray-600 hover:text-gray-900"
              disabled={isSubmitting}
            >
              {t("Cancelar")}
            </button>

            <Button
              variant="blue"
              onClick={handleSendSupportMessage}
              disabled={isSubmitting || !supportMessage.trim()}
            >
              {isSubmitting ? t("Enviando...") : t("Enviar")}
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">{t("Pedido Enviado")}</h2>
          <p className="text-gray-700 mb-4">
            {t(
              "Seu pedido foi enviado com sucesso. Nossa equipe de suporte entrará em contato em breve."
            )}
          </p>
          <div className="flex justify-end">
            <Button
              variant="blue"
              onClick={() => {
                setIsSubmitted(false);
                setModalType(null);
              }}
            >
              {t("Fechar")}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default SupportModal;
