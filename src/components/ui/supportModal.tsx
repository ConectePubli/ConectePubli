import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import axios from "axios";
import { Button } from "@/components/ui/button";

import { Influencer } from "@/types/Influencer";
import { MapPin, User } from "lucide-react";

import pb from "@/lib/pb";
import { toast } from "react-toastify";

interface Props {
  participant: Influencer;
  setModalType: React.ComponentState;
}

const SupportModal: React.FC<Props> = ({ participant, setModalType }) => {
  const [supportMessage, setSupportMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSendSupportMessage = async () => {
    setIsSubmitting(true);

    try {
      const userData = JSON.parse(
        localStorage.getItem("pocketbase_auth") as string
      );

      const userDetails = await pb
        .collection("Brands")
        .getOne(userData.model.id, {
          fields: "name,email",
        });

      console.log(userDetails);

      await axios.post(
        "https://conecte-publi.pockethost.io/api/support_email",
        {
          title: `Solicitação de Mediação - ${userData.name}`,
          email: userDetails.email,
          message: supportMessage,
        }
      );

      setIsSubmitted(true);
    } catch (error) {
      console.error("Erro ao enviar pedido de suporte:", error);
      toast("Ocorreu um erro ao enviar sua solicitação. Tente novamente.");
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
            Solicitar Mediação para o Trabalho do Influenciador
          </h2>

          <div className="flex items-center gap-4 mb-4">
            {participant.profile_img ? (
              <img
                src={pb.files.getUrl(participant, participant.profile_img)}
                alt="Foto do Influenciador"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-300">
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
            Se houver divergências no trabalho deste influenciador, nossa equipe
            de suporte pode ajudar a mediar o caso. No entanto, caso ambas as
            partes cheguem a um acordo por conta própria, vocês podem resolver a
            situação diretamente.
          </p>

          <h3 className="text-base font-semibold mb-2">
            Passo a passo para resolver a situação:
          </h3>
          <ol className="list-decimal list-inside mb-4 text-sm text-gray-700">
            <li>
              <strong>Tente resolver diretamente:</strong> Recomendamos dialogar
              com o influenciador e oferecer feedback antes de contatar o
              suporte. Exemplos:
              <ul className="list-disc ml-6 mt-1">
                <li>
                  <em>Descumprimento parcial:</em> Caso haja pequenas falhas,
                  como hashtags faltando, solicite que o influenciador ajuste o
                  conteúdo.
                </li>
                <li>
                  <em>Prazos não cumpridos:</em> Lembre o influenciador(a) da
                  importância do prazo e veja se é possível uma reprogramação.
                </li>
                <li>
                  <em>Inconsistência na mensagem:</em> Se o conteúdo não segue
                  as diretrizes, explique o que deve ser corrigido antes de
                  optar pelo suporte.
                </li>
              </ul>
            </li>
          </ol>

          <h3 className="text-sm font-semibold mb-3">
            Em casos simples (como desistência do influenciador), peça para
            ele(a) clicar em “Desinscrever-se da Campanha” para uma saída rápida
            e amigável.
          </h3>

          <ol className="list-none list-decimal list-inside mb-4 text-sm text-gray-700">
            <li className="mb-3">
              <strong>
                2. Processo de mediação e custos (Caso seja necessário):
              </strong>{" "}
              <ul className="list-disc ml-6 mt-1">
                <li>
                  <em>Se o influenciador cumpriu os requisitos da campanha:</em>{" "}
                  Caso a marca deseje desqualificar o influenciador que realizou
                  o trabalho conforme as especificações da campanha, poderá ser
                  necessário pagar 20% do valor acordado para esse
                  influenciador.
                </li>
                <li>
                  <em>Se o Influenciador Não Realizou o Trabalho:</em> Caso o
                  influenciador não tenha colaborado ou não tenha entregue
                  nenhum conteúdo relevante para a campanha, a marca terá
                  direito ao reembolso integral para essa posição específica na
                  campanha depois de uma avaliação da equipe da ConectePubli.
                </li>
              </ul>
            </li>
            <li className="mb-3">
              <strong>3. Coleta de evidências para mediação:</strong> Caso o
              suporte seja acionado, ambas as partes deverão fornecer evidências
              (comunicações, entregas e outras documentações relevantes) para
              embasar a decisão.
            </li>
            <li className="mb-3">
              <strong>4. Contato e acompanhamento:</strong> Se não houver acordo
              direto, nossa equipe de suporte entrará em contato com ambas as
              partes para entender melhor a situação e ajudar a encontrar uma
              solução justa.
            </li>
          </ol>

          <label
            className="block mb-2 text-sm font-medium text-gray-900"
            htmlFor="supportMessage"
          >
            Explique a situação
          </label>
          <textarea
            id="supportMessage"
            className="w-full h-32 border border-gray-300 rounded-lg p-2 mb-4 text-sm"
            placeholder="Descreva brevemente o problema que está ocorrendo..."
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
              Cancelar
            </button>

            <Button
              variant="blue"
              onClick={handleSendSupportMessage}
              disabled={isSubmitting || !supportMessage.trim()}
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Pedido Enviado</h2>
          <p className="text-gray-700 mb-4">
            Seu pedido foi enviado com sucesso. Nossa equipe de suporte entrará
            em contato em breve.
          </p>
          <div className="flex justify-end">
            <Button
              variant="blue"
              onClick={() => {
                setIsSubmitted(false);
                setModalType(null);
              }}
            >
              Fechar
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default SupportModal;
