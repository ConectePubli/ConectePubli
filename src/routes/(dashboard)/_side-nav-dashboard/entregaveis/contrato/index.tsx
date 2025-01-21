import { createFileRoute } from "@tanstack/react-router";
import { t } from "i18next";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/entregaveis/contrato/"
)({
  component: Page,
});

function Page() {
  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-lg p-8 max-w-5xl">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          {t("Contrato de Campanha para Contratação via Vitrine de Creators")}
        </h1>
        <h2 className="text-xl font-semibold mt-4">{t("OBJETO")}</h2>
        <p className="mt-2 text-gray-800 ml-5">
          {t(
            "O presente contrato tem por objeto regular as condições para a execução de entregáveis selecionados e contratados pela Marca através da Vitrine de Creators da Plataforma."
          )}
        </p>

        <h2 className="text-xl font-semibold mt-6">
          1. {t("FLUXO CONTRATUAL")}
        </h2>
        <h3 className="text-lg font-medium mt-4 ml-3">
          1.1 {t("Seleção de Entregáveis e Proposta pela Marca")}
        </h3>
        <p className="mt-2 text-gray-800 ml-5">
          1.1.1{" "}
          {t(
            "A Marca acessa a Vitrine de Creators para selecionar o tipo e a quantidade de entregáveis desejados, como Reels, Fotos ou Combos."
          )}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          1.1.2{" "}
          {t(
            "Após a seleção, a Marca enviará uma proposta detalhada ao Creator, incluindo formato, prazo e valores por entregável, conforme informado no perfil do Creator."
          )}
        </p>
        <h3 className="text-lg font-medium mt-4 ml-3">
          1.2 {t("Notificação e Aprovação pelo Creator")}
        </h3>
        <p className="mt-2 text-gray-800 ml-5">
          1.2.1{" "}
          {t("O Creator será notificado por e-mail sobre a proposta enviada.")}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          1.2.2{" "}
          {t(
            "Ao aceitar a proposta, o Creator concordará automaticamente com os termos do presente contrato."
          )}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          1.2.3{" "}
          {t(
            "Caso o Creator recuse a proposta, ele poderá justificar a recusa, enviando detalhes por e-mail à Marca."
          )}
        </p>

        <h3 className="text-lg font-medium mt-4 ml-3">
          1.3 {t("Aceitação pela Marca e Pagamento")}
        </h3>
        <p className="mt-2 text-gray-800 ml-5">
          1.3.1{" "}
          {t(
            "Após a aprovação do Creator, a Marca deverá acessar a Plataforma para aceitar formalmente o contrato."
          )}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          1.3.2{" "}
          {t(
            "O pagamento deverá ser realizado pela Marca no momento da aceitação, somando os valores indicados para cada entregável selecionado."
          )}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          1.3.3{" "}
          {t(
            "O Creator só poderá iniciar a produção do entregável após a confirmação do pagamento pela Plataforma."
          )}
        </p>

        <h2 className="text-xl font-semibold mt-6">
          2. {t("OBRIGAÇÕES DAS PARTES")}
        </h2>
        <h3 className="text-lg font-medium mt-4 ml-3">
          2.1 {t("Obrigações da Marca")}
        </h3>
        <p className="mt-2 text-gray-800 ml-5">
          2.1.1{" "}
          {t(
            "Fornecer ao Creator todas as informações necessárias para a execução do entregável, incluindo diretrizes específicas."
          )}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          2.1.2{" "}
          {t(
            "Efetuar o pagamento diretamente na Plataforma, garantindo o desbloqueio do trabalho."
          )}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          2.1.3 {t("Revisar e aprovar o material entregue no prazo acordado.")}
        </p>

        <h3 className="text-lg font-medium mt-4 ml-3">
          2.2 {t("Obrigações do Creator")}
        </h3>
        <p className="mt-2 text-gray-800 ml-5">
          2.2.1{" "}
          {t(
            "Cumprir rigorosamente as diretrizes e prazos definidos pela Marca."
          )}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          2.2.2{" "}
          {t(
            "Garantir que o conteúdo entregue esteja em conformidade com as leis aplicáveis, especialmente em relação a direitos autorais e de imagem."
          )}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          2.2.3{" "}
          {t(
            "Enviar o entregável por meio do chat da Plataforma para aprovação da Marca."
          )}
        </p>

        <h2 className="text-xl font-semibold mt-6">
          3. {t("REMUNERAÇÃO E PAGAMENTO")}
        </h2>
        <p className="mt-2 text-gray-800 ml-5">
          3.1{" "}
          {t(
            "O valor acordado será liberado ao Creator após a aprovação final do material pela Marca."
          )}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          3.2{" "}
          {t(
            "A Conecte Publi reterá 20% como taxa de serviço, e 80% será destinado ao Creator."
          )}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          3.3{" "}
          {t(
            "Em caso de não entrega ou descumprimento das condições acordadas, o valor será devolvido integralmente à Marca."
          )}
        </p>

        <h2 className="text-xl font-semibold mt-6">
          4. {t("NOTIFICAÇÕES E APROVAÇÕES")}
        </h2>
        <p className="mt-2 text-gray-800 ml-5">
          4.1 {t("Ambas as partes serão notificadas sobre:")}
        </p>
        <ul className="list-disc ml-10 text-gray-800 mt-2">
          <li>{t("Proposta enviada, aprovada ou recusada.")}</li>
          <li>{t("Confirmação do pagamento e início autorizado.")}</li>
          <li>{t("Finalização e aprovação do entregável.")}</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          5. {t("CANCELAMENTO E RESCISÃO")}
        </h2>
        <p className="mt-2 text-gray-800 ml-5">
          5.1{" "}
          {t(
            "O contrato poderá ser rescindido em caso de não cumprimento das obrigações por qualquer das partes."
          )}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          5.2{" "}
          {t(
            "Em caso de cancelamento pela Marca após o pagamento, o valor será retido e analisado conforme as políticas da Plataforma."
          )}
        </p>

        <h2 className="text-xl font-semibold mt-6">
          6. {t("RESOLUÇÃO DE CONFLITOS")}
        </h2>
        <p className="mt-2 text-gray-800 ml-5">
          6.1{" "}
          {t(
            "Em caso de disputa, as partes concordam em buscar solução direta antes de qualquer procedimento judicial ou arbitral."
          )}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          6.2{" "}
          {t(
            "A Plataforma não será responsável por mediar ou intervir nos conflitos entre Marca e Creator."
          )}
        </p>

        <h2 className="text-xl font-semibold mt-6">
          7. {t("DISPOSIÇÕES GERAIS")}
        </h2>
        <p className="mt-2 text-gray-800 ml-5">
          7.1 {t("Este contrato é regido pelas leis vigentes no Brasil.")}
        </p>
        <p className="mt-2 text-gray-800 ml-5">
          7.2{" "}
          {t(
            "Ambas as partes declaram ciência e concordância com todos os termos aqui descritos, ao aceitarem a proposta e realizarem o pagamento pela Plataforma."
          )}
        </p>
      </div>
    </div>
  );
}

export default Page;
