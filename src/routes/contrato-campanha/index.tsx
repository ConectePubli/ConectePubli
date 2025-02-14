// src/pages/ContratoDeCampanha.tsx

import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/contrato-campanha/")({
  component: ContratoDeCampanha,
});

function ContratoDeCampanha() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">
        {t("Contrato de Campanha Conecte Publi")}
      </h1>
      <p className="mb-4">
        {t(
          "Por meio deste documento, a Marca e o Creator, conectados pela plataforma Conecte Publi,estabelecem as condições para a realização do entregável solicitado, detalhadas nos termos abaixo"
        )}
        :
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("1. Relação Contratual")}
      </h2>
      <p className="mb-4">
        {t(
          "Este contrato formaliza a relação entre Marca e Creator para a realização do entregável solicitado. Ambas as partes reconhecem que a Conecte Publi atua exclusivamente como intermediária, facilitando a conexão, sem envolvimento direto ou responsabilidades legais sobre o conteúdo do contrato."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("2. Obrigações da Marca")}
      </h2>
      <p className="mb-4">
        <strong>● {t("Proposta de Entregável")}:</strong>{" "}
        {t(
          "A Marca deve detalhar claramente os requisitos do entregável, incluindo formato, estilo, prazos e orientações específicas."
        )}
      </p>
      <p className="mb-4">
        <strong>● {t("Aprovação e Pagamento")}:</strong>{" "}
        {t(
          "A Marca deve aprovar o Creator selecionado e efetuar o pagamento através da plataforma antes do início da produção."
        )}
      </p>
      <p className="mb-4">
        <strong>● {t("Validação do Conteúdo")}:</strong>{" "}
        {t(
          "A Marca é responsável por revisar e validar o conteúdo entregue, dentro do prazo acordado."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("3. Obrigações do Creator")}
      </h2>
      <p className="mb-4">
        <strong>● {t("Cumprimento das Diretrizes")}:</strong>{" "}
        {t(
          "O Creator deve seguir todas as instruções e diretrizes fornecidas pela Marca para garantir que o entregável atenda às expectativas."
        )}
      </p>
      <p className="mb-4">
        <strong>● {t("Prazos")}:</strong>{" "}
        {t(
          "O Creator se compromete a cumprir rigorosamente os prazos estabelecidos pela Marca."
        )}
      </p>
      <p className="mb-4">
        <strong>● {t("Conformidade Legal")}:</strong>{" "}
        {t(
          "O Creator é responsável por garantir que o conteúdo respeite todas as leis aplicáveis, incluindo direitos de propriedade intelectual e de terceiros."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("4. Aprovação e Início da Atividade")}
      </h2>
      <p className="mb-4">
        ● {t("A produção do entregável só terá início após")}:{" "}
        {t(
          "1. Seleção dos creators inscritos na campanha. 2. Confirmação do pagamento pela Marca, realizada através da Conecte Publi."
        )}
      </p>
      <p className="mb-4">
        <strong>● </strong>{" "}
        {t(
          "Após esses passos, ambas as partes serão notificadas para iniciar o processo de entrega"
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("5. Remuneração e Pagamento")}
      </h2>
      <p className="mb-4">
        <strong>●</strong>{" "}
        {t(
          "O valor acordado para o entregável será disponibilizado ao Creator somente após a entrega do conteúdo e validação final pela Marca."
        )}
      </p>
      <p className="mb-4">
        <strong>●</strong>{" "}
        {t(
          "A ConectePubli reterá 20% como taxa de serviço, enquanto o Creator receberá 80% do valor total pago pela Marca"
        )}
      </p>
      <p className="mb-4">
        <strong>●</strong>{" "}
        {t(
          "O valor volta para a marca caso vença a data final e o creator não entregue todos os entregáveis obrigatórios"
        )}
      </p>
      <p className="mb-4">
        ● {t("Pagamento ao Creator (Tradicional)")}:{" "}
        {t(
          "Os valores acumulados para o Creator serão transferidos via PIX no dia 15 (quinze) de cada mês. O pagamento corresponderá às campanhas concluídas até o último dia do mês anterior. Para garantir o recebimento, o Creator deve manter sua chave PIX cadastrada na plataforma sempre atualizada."
        )}
      </p>
      <p className="mb-4">
        ● {t("Pagamento ao Creator (Inverso)")}:{" "}
        {t(
          "Os valores acumulados para o Creator serão transferidos via PIX no dia 15 (quinze) de cada mês. O pagamento corresponderá aos entregáveis concluídos até o último dia do mês anterior. Para garantir o recebimento, o Creator deve manter sua chave PIX cadastrada na plataforma sempre atualizada."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("6. Consentimento de Uso de Conteúdo e Imagem")}
      </h2>
      <p className="mb-4">
        <strong>●</strong>{" "}
        {t(
          "O Creator autoriza a Marca e a Conecte Publi a utilizarem o conteúdo entregue, bem como seu nome, imagem e voz, exclusivamente para fins promocionais relacionados ao entregável."
        )}
      </p>
      <p className="mb-4">
        <strong>●</strong>{" "}
        {t(
          "A Marca compromete-se a usar o conteúdo apenas dentro das finalidades acordadas, evitando usos não autorizados."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("7. Responsabilidades e Conformidade")}
      </h2>
      <p className="mb-4">
        <strong>●</strong>{" "}
        {t(
          "Ambas as partes comprometem-se a agir com transparência e boa-fé durante o cumprimento do contrato."
        )}
      </p>
      <p className="mb-4">
        <strong>●</strong>{" "}
        {t(
          "A Marca é responsável por fornecer informações claras e detalhadas para a execução do entregável."
        )}
      </p>
      <p className="mb-4">
        <strong>●</strong>{" "}
        {t(
          "O Creator compromete-se a realizar o entregável com qualidade, respeitando os termos acordados."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("8. Resolução de Conflitos")}
      </h2>
      <p className="mb-4">
        <strong>●</strong>{" "}
        {t(
          "Qualquer disputa decorrente deste contrato deverá ser resolvida diretamente entre Marca e Creator, sem responsabilidade da Conecte Publi em mediar ou intervir no conflito"
        )}
      </p>
    </div>
  );
}

export default ContratoDeCampanha;
