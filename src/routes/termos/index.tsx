import { createFileRoute } from "@tanstack/react-router";
import { t } from "i18next";
import { useEffect } from "react";

export const Route = createFileRoute("/termos/")({
  component: TermosDeUso,
});

function TermosDeUso() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">
        {t("Termos de Uso da Plataforma Conecte Publi")}
      </h1>
      <p className="mb-4">
        {t(
          "Bem-vindo(a) à nossa plataforma Conecte Publi, que facilita a conexão entre marcas e criadores digitais. Antes de utilizar nossos serviços, por favor, leia atentamente estes Termos de Uso. Ao acessar ou usar nossa plataforma, você concorda com os seguintes termos e condições:"
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("Aceitação dos Termos")}
      </h2>
      <p className="mb-4">
        {t(
          "Ao acessar ou utilizar a plataforma Conecte Publi, você concorda em cumprir e ficar vinculado a estes Termos de Uso, bem como a todas as leis e regulamentos aplicáveis. Se você não concordar com qualquer parte destes termos, não acesse ou utilize nossa plataforma."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("Descrição do Serviço")}
      </h2>
      <p className="mb-4">
        {t(
          "A plataforma Conecte Publi tem como objetivo facilitar a conexão entre marcas e criadores digitais para a realização de campanhas de marketing e divulgação de produtos ou serviços. Fornecemos uma interface onde marcas podem criar propostas de colaboração e criadores podem se candidatar para participar dessas campanhas."
        )}
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        {t("CLÁUSULA PRIMEIRA - COMPROMISSO DAS PARTES")}
      </h2>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("1. Compromisso da Marca:")}
      </h3>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <span className="font-semibold">1.1</span>{" "}
          {t(
            "A Marca compromete-se a zelar pelo engajamento com a plataforma."
          )}
        </li>
        <li>
          <span className="font-semibold">1.2</span>{" "}
          {t(
            "Fica terminantemente proibido à Marca estabelecer contatos externos à plataforma, com o intuito de buscar parcerias que não estejam estritamente alinhadas com os termos da campanha previamente descrita."
          )}
        </li>
        <li>
          <span className="font-semibold">1.3</span>{" "}
          {t(
            "Caso a Marca desista de uma campanha em que ainda não há criador aprovado, ela deverá pagar para a plataforma uma taxa de 20% do valor total da campanha."
          )}
        </li>
        <li>
          <span className="font-semibold">1.4</span>{" "}
          {t(
            "A Marca não poderá desistir da campanha se já houver um criador aprovado. A desistência, nesses casos, não é permitida para proteger o compromisso assumido entre a marca e o criador. Se a marca desistir deverá ainda assim pagar o valor total da campanha, ainda que não realizada."
          )}
        </li>
        <li>
          <span className="font-semibold">1.5</span>{" "}
          {t(
            "A Marca não poderá desativar uma campanha sem aviso prévio e autorização formal de um membro da equipe Conecte Publi, exceto em situações excepcionais devidamente comprovadas, como doença grave, roubo/furto de equipamento/material essencial à continuidade/realização da campanha, falência da Marca ou óbito, casos específicos que deverão serem analisados caso a caso. Atenção: Você só conseguirá editar a sua campanha enquanto não houver creators que se inscreveram na mesma."
          )}
        </li>
        <li>
          <span className="font-semibold">1.6</span>{" "}
          {t(
            "Qualquer alteração no briefing da campanha pela Marca após a aprovação e publicação na plataforma somente será permitida mediante autorização expressa de um membro da equipe da plataforma."
          )}
        </li>
        <li>
          <span className="font-semibold">1.7</span>{" "}
          {t(
            "Em caso de cancelamento de vagas específicas dentro de uma campanha por parte da Marca, esta deverá arcar com uma taxa de cancelamento correspondente a 20% do valor total definido para cada vaga cancelada. A cobrança desse valor tem por objetivo compensar o processo de administração da vaga e garantir o comprometimento da marca com os criadores que poderiam ter ocupado essas posições."
          )}
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("2. Compromisso do Creator:")}
      </h3>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <span className="font-semibold">2.1</span>{" "}
          {t(
            "O Creator compromete-se a atender integralmente às campanhas nas quais aderir, produzindo o conteúdo conforme descrito na campanha e mantendo alinhamento irrestrito com diretrizes da Marca anunciante."
          )}
        </li>
        <li>
          <span className="font-semibold">2.2</span>{" "}
          {t(
            "Não serão permitidas negociações fora da plataforma pelo Creator, ainda que com Marca para quem já tenha feito campanha. (sujeito a ser banido da plataforma, sem prejuízo por perdas e danos causados)"
          )}
        </li>
        <li>
          <span className="font-semibold">2.3</span>{" "}
          {t(
            "A plataforma reforça sua não-aceitação da compra de seguidores ou participação em grupos de engajamento para as redes sociais utilizadas por Creator. Caso um Creator já se enquadre nessas práticas, é obrigatório o expresso aviso prévio antes de aderir a uma campanha, cabendo à plataforma e/ou Marca aceitar ou não."
          )}
        </li>
        <li>
          <span className="font-semibold">2.4</span>{" "}
          {t(
            "Ao aceitar os presentes Termos de Uso, o Creator declara e concorda que autoriza, de forma irrevogável e gratuita, a Conecte Publi a utilizar sua imagem, nome, conteúdo criado e demais elementos associados à sua participação na plataforma, exclusivamente para fins de divulgação nas redes sociais, materiais promocionais, e outras ações de comunicação institucional da Conecte Publi."
          )}
        </li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        {t("CLÁUSULA SEGUNDA - PAGAMENTO DAS CAMPANHAS")}
      </h2>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("1. Criação da campanha")}
      </h3>
      <p className="mb-4">
        {t(
          "A Marca deve inserir todas as informações necessárias para a criação da campanha na plataforma Conecte Publi, incluindo o valor a ser investido. Sendo que 80% do valor total da campanha será utilizado para pagamentos aos Creators, e 20% destinado à Conecte Publi a título de taxa de serviço."
        )}
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">{t("2. Pagamento")}</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <span className="font-semibold">
            2.1 {t("Seleção dos Creators e Aprovação")} <br />
          </span>{" "}
          {t(
            "A Conecte Publi permite que a Marca selecione e aprove creators diretamente em cada campanha. Após a seleção, a Marca deve revisar e finalizar o pagamento."
          )}
        </li>
        <li>
          <span className="font-semibold">
            2.2 {t("Pagamento Antecipado e Automático")} <br />
          </span>{" "}
          {t(
            `O pagamento é processado automaticamente assim que a Marca clica em 'Fazer Pagamento' na tela do carrinho de compras com os creators aprovados. Esse processo garante que o valor seja alocado corretamente e a campanha liberada`
          )}
        </li>
        <li>
          <span className="font-semibold">
            2.3 {t(" Início Condicional da Campanha")}
          </span>{" "}
          <br />
          {t(
            "O início da campanha só ocorre após a confirmação do pagamento de cada creator pela marca. Caso o pagamento do creator aprovado, não seja efetuado, o Creator não poderá iniciar o seu trabalho na campanha."
          )}
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("3. Distribuição de valores")}
      </h3>
      <p className="mb-4">
        {t(
          "Após a conclusão da campanha e validação da entrega, 80% do valor pago será liberadopara o Creator responsável. A Conecte Publi reterá 20% como taxa de serviço."
        )}
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("4. Pagamento ao creator")}
      </h3>
      <p className="mb-4">
        {t(
          "Os valores acumulados para o Creator serão transferidos via PIX no dia 15 (quinze) de cada mês, referentes às campanhas finalizadas no mês anterior. O Creator deve garantir que a chave PIX cadastrada na plataforma esteja atualizada."
        )}
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("5. Reembolso à marca")}
      </h3>
      <p className="mb-4">
        {t(
          "Se o Creator não cumprir os requisitos estabelecidos, a Marca poderá solicitar reembolso integral. O reembolso será efetuado em até 10 (dez) dias úteis após a análise e comprovação do descumprimento pela plataforma."
        )}
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        {t(
          "CLÁUSULA TERCEIRA - CRITÉRIOS PARA BANIMENTO DE USUÁRIOS PELA PLATAFORMA:"
        )}
      </h2>
      <ul className="list-decimal list-inside space-y-2">
        <li>
          {t(
            "Violação de Termos de Serviço: Quando um usuário quebra regras estabelecidas, como publicações em desacordo com política e finalidade da plataforma, promoção de conteúdos por lei e pela plataforma proibidos e uso da plataforma para atividades não autorizadas previamente."
          )}
        </li>
        <li>
          {t(
            "Comportamento Abusivo ou Discriminatório: Atitudes e falas que caracterizem assédio e/ou bullying e qualquer ato ou comentário discriminatório darão ensejo para imediato banimento."
          )}
        </li>
        <li>
          {t(
            "Conteúdo ou Atividades Spam: O uso da plataforma para enviar spam, publicar conteúdos repetitivos e irrelevantes, ou promover links legalmente suspeitos justifica a exclusão da plataforma."
          )}
        </li>
        <li>
          {t(
            "Engano sobre Produto ou Marca: Quando uma Marca for apresentada de maneira enganosa, se apresentando ou apresentando produtos violando a confiança de usuários e consumidores esta será banida da plataforma."
          )}
        </li>
        <li>
          {t(
            "Engano por Creator (Creator Fake): Creators que se apresentem de forma enganosa, falsa ou fraudulenta, prejudicando a credibilidade da plataforma serão imediatamente banidos."
          )}
        </li>
        <li>
          {t(
            "Descumprimento da Finalidade de Campanhas: Creators que, sem justificativa aceitável, falham em cumprir as finalidades de campanhas previamente aprovadas pela plataforma serão banidos."
          )}{" "}
          {t(
            "(sujeito a ser banido da plataforma, sem prejuízo por perdas e danos causados)"
          )}
        </li>
        <li>
          {t(
            "Má Índole: Qualquer comportamento considerado de má índole (incoerente e incompatível com leis e costumes), que comprometa a confiança, segurança ou integridade da plataforma dará ensejo a banimento."
          )}
        </li>
        <li>
          {t(
            "Tentar ou Fechar Acordos por Fora da Plataforma: Usuários que tentam realizar negócios ou venham a celebrar acordos fora da plataforma, realizando termos e processos de trabalho que fazem parte do escopo da plataforma, após atuarem através da mesma, desrespeitando políticas de uso e prática comercial serão banidos."
          )}
        </li>
        <li>
          {t(
            "Desrespeito à Política de Privacidade e Termos e Condições: O não cumprimento das políticas de privacidade e/ou dos termos e condições estabelecidos pela plataforma, que garantem a segurança e a experiência de todos os usuários são motivos ensejadores de banimento."
          )}
        </li>
        <li>
          {t(
            "Quebra de Contrato entre Creator e Marca: Quando o creator desrespeitar os termos do contrato estabelecido entre ele e a marca, desconsiderando as condições acordadas e prejudicando a parceria será banido."
          )}
        </li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        {t("CLÁUSULA QUARTA - USO DE CONTEÚDO EM TRÁFEGO PAGO")}
      </h2>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("1. Termos de Veiculação")}
      </h3>
      <p className="mb-4">
        {t(
          "Ao aceitar a presente campanha publicitária, o(a) Creator concorda que, no caso de tráfego pago, a utilização de seu conteúdo seguirá rigorosamente os locais de exibição e o período de veiculação estabelecidos na campanha no momento da candidatura e aceite."
        )}
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("2. Alterações nas Condições")}
      </h3>
      <p className="mb-4">
        {t(
          "Quaisquer alterações nos locais de veiculação ou extensão do período previamente acordado deverão ser negociadas e formalizadas mediante nova autorização e compensação financeira adicional, conforme acordado entre as partes."
        )}
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("3. Remuneração e Direitos")}
      </h3>
      <p className="mb-4">
        {t(
          "A remuneração definida nesta campanha cobre exclusivamente o uso do conteúdo para os fins e prazos especificados. Caso o conteúdo seja reutilizado ou redistribuído além desses parâmetros, a marca estará sujeita a pagamento adicional e à formalização de novo contrato."
        )}
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("4. Direitos e Responsabilidades")}
      </h3>
      <ul className="list-disc list-inside mb-4">
        <li>
          {t(
            "O(a) Creator garante o cumprimento dos termos aceitos, comprometendo-se com a entrega e qualidade do material conforme o escopo da campanha."
          )}
        </li>
        <li>
          {t(
            "A marca se compromete a utilizar o conteúdo estritamente dentro das condições especificadas, respeitando os direitos autorais e de imagem do(a) Creator."
          )}
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">{t("5. Penalidades")}</h3>
      <p className="mb-4">
        {t(
          "O descumprimento de qualquer uma das condições estabelecidas nesta cláusula poderá acarretar sanções legais, incluindo indenização por uso indevido da imagem do(a) Creator."
        )}
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        {t("CLÁUSULA QUINTA - CONTRATAÇÃO ATRAVÉS DA VITRINE DE CREATORS")}
      </h2>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("1. Envio de Proposta pela Marca")}
      </h3>
      <p className="mb-4">
        {t(
          "A Marca pode enviar propostas diretamente a Creators pela Vitrine de Creators, detalhando o escopo do entregável, prazos e remuneração."
        )}
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("2. Aceitação ou Recusa da Proposta pelo Creator")}
      </h3>
      <p className="mb-4">
        {t(
          "O Creator deve acessar a plataforma para revisar a proposta enviada. Ele pode:"
        )}

        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>{t("Aceitar a Proposta")}:</strong>{" "}
            {t(
              "Ao aceitar, o Creator automaticamente concorda com os termos e condições da campanha detalhados na proposta e nos Termos de Uso."
            )}
          </li>
          <li>
            <strong>{t("Recusar a Proposta")}:</strong>{" "}
            {t(
              "Caso não concorde com os termos, o Creator pode recusar a proposta e enviar uma justificativa à Marca."
            )}
          </li>
        </ul>
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("3. Notificação de Decisão")}
      </h3>
      <p className="mb-4">
        {t(
          "Ambas as partes receberão notificações por e-mail detalhando a decisão do Creator sobre a proposta enviada."
        )}
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        {t("4. Início da Campanha")}
      </h3>
      <p className="mb-4">
        {t(
          "A produção dos entregáveis só poderá ser iniciada após a confirmação do pagamento pela Marca e o aceite formal do Creator."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("Responsabilidades do Usuário")}
      </h2>
      <p className="mb-4">
        {t(
          "(a) Registro: você deve criar uma conta e fornecer informações precisas, completas e atualizadas. Você é responsável por manter a confidencialidade de suas informações de login e por todas as atividades que ocorrerem em sua conta."
        )}
      </p>
      <p className="mb-4">
        {t(
          "(b) Uso Adequado: você concorda em utilizar nossa plataforma de forma adequada e em conformidade com todas as leis aplicáveis. Você não deve utilizar a plataforma para fins ilegais, fraudulentos ou não autorizados."
        )}
      </p>
      <p className="mb-4">
        {t(
          "(c) Veracidade das Informações: tanto Marcas quanto Creators são responsáveis por garantir a veracidade das informações fornecidas na plataforma."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("Propriedade Intelectual")}
      </h2>
      <p className="mb-4">
        {t(
          "(a) Direitos Autorais: todos os direitos autorais, marcas registradas, segredos comerciais e outros direitos de propriedade intelectual relacionados à plataforma Conecte Publi e ao seu conteúdo são de propriedade exclusiva da plataforma ou de terceiros devidamente autorizados."
        )}
      </p>
      <p className="mb-4">
        {t(
          "(b) Uso Restrito: você concorda em não copiar, reproduzir, modificar, distribuir, exibir, transmitir, vender, licenciar ou explorar qualquer parte da plataforma Conecte Publi sem a autorização por escrito da plataforma."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">{t("Privacidade")}</h2>
      <p className="mb-4">
        {t(
          "A privacidade dos usuários é importante para nós. Oo uso das informações pessoais fornecidas por você está sujeito à nossa Política de Privacidade, que descreve como coletamos, usamos, armazenamos e divulgamos essas informações."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("Limitação de Responsabilidade")}
      </h2>
      <p className="mb-4">
        {t(
          "(a) Uso por sua Conta e Risco: Você compreende e concorda que utiliza a plataforma Conecte Publi de livre e consciente vontade, sendo ciente e responsável por sua própria vontade, conta e risco. A plataforma não se responsabiliza por qualquer dano ou prejuízo decorrente do uso da plataforma."
        )}
      </p>
      <p className="mb-4">
        {t(
          "(b) Terceiros: A plataforma não se responsabiliza por quaisquer ações, omissões ou condutas de marcas, creators ou terceiros relacionados às transações realizadas na plataforma."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">{t("Rescisão")}</h2>
      <p className="mb-4">
        {t(
          "Reservamos o direito de suspender ou encerrar sua conta e restringir seu acesso à plataforma Conecte Publi, a nosso critério exclusivo, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo violação destes Termos de Uso."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("Alterações nos Termos de Uso")}
      </h2>
      <p className="mb-4">
        {t(
          "Podemos modificar Termos de Uso a qualquer momento, publicando uma versão atualizada na plataforma Conecte Publi. É sua responsabilidade revisar regularmente os Termos de Uso. O uso continuado da plataforma após quaisquer alterações constitui aceitação de alterações ocorridas após sua adesão."
        )}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("Disposições Gerais")}
      </h2>
      <p className="mb-4">
        {t(
          "Estes Termos de Uso constituem o acordo integral entre você e a plataforma Conecte Publi em relação ao conteúdo/assunto aqui tratado e substituem todos os acordos anteriores ou contemporâneos, escritos ou orais existentes."
        )}
      </p>
      <p className="mt-4">
        {t(
          "Caso qualquer disposição destes Termos de Uso seja considerada inválida ou inexequível, as demais disposições permanecerão em vigor."
        )}
      </p>
      <p className="mt-4">
        {t(
          "Estes Termos de Uso são regidos e interpretados de acordo com as leis do país e Estado em que a plataforma Conecte Publi está registrada."
        )}
      </p>
      <p className="mt-4">
        {t(
          "Se você tiver alguma dúvida, entre em contato conosco através dos canais de suporte."
        )}
      </p>
    </div>
  );
}

export default TermosDeUso;
