import { createFileRoute } from "@tanstack/react-router";
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
        Termos de Uso da Plataforma Conecte Publi
      </h1>
      <p className="mb-4">
        Bem-vindo(a) à nossa plataforma Conecte Publi, que facilita a conexão
        entre marcas e criadores digitais. Antes de utilizar nossos serviços,
        por favor, leia atentamente estes Termos de Uso. Ao acessar ou usar
        nossa plataforma, você concorda com os seguintes termos e condições:
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Aceitação dos Termos</h2>
      <p className="mb-4">
        Ao acessar ou utilizar a plataforma Conecte Publi, você concorda em
        cumprir e ficar vinculado a estes Termos de Uso, bem como a todas as
        leis e regulamentos aplicáveis. Se você não concordar com qualquer parte
        destes termos, não acesse ou utilize nossa plataforma.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Descrição do Serviço</h2>
      <p className="mb-4">
        A plataforma Conecte Publi tem como objetivo facilitar a conexão entre
        marcas e criadores digitais para a realização de campanhas de marketing
        e divulgação de produtos ou serviços. Fornecemos uma interface onde
        marcas podem criar propostas de colaboração e criadores podem se
        candidatar para participar dessas campanhas.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        CLÁUSULA PRIMEIRA - COMPROMISSO DAS PARTES
      </h2>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        1. Compromisso da Marca:
      </h3>
      <ul className="list-inside space-y-2 pl-4">
        <li>
          <span className="font-semibold">1.1</span> A Marca compromete-se a
          zelar pelo engajamento com a plataforma.
        </li>
        <li>
          <span className="font-semibold">1.2</span> Fica terminantemente
          proibido à Marca estabelecer contatos externos à plataforma, com o
          intuito de buscar parcerias que não estejam estritamente alinhadas com
          os termos da campanha previamente descrita.
        </li>
        <li>
          <span className="font-semibold">1.3</span> Caso a Marca desista de uma
          campanha em que ainda não há criador aprovado, ela deverá pagar para a
          plataforma uma taxa de 20% do valor total da campanha.
        </li>
        <li>
          <span className="font-semibold">1.4</span> A Marca não poderá desistir
          da campanha se já houver um criador aprovado. A desistência, nesses
          casos, não é permitida para proteger o compromisso assumido entre a
          marca e o criador. Se a marca desistir deverá ainda assim pagar o
          valor total da campanha, ainda que não realizada
        </li>
        <li>
          <span className="font-semibold">1.5</span> A Marca não poderá
          desativar uma campanha sem aviso prévio e autorização formal de um
          membro da equipe Conecte Publi, exceto em situações excepcionais
          devidamente comprovadas, como doença grave, roubo/furto de
          equipamento/material essencial a continuidade/realização da campanha,
          falência da Marca ou óbito, casos específicos que deverão serem
          analisados caso a caso.
        </li>
        <li>
          <span className="font-semibold">1.6</span> Qualquer alteração no
          briefing da campanha pela Marca após a aprovação e publicação na
          plataforma somente será permitida mediante autorização expressa de um
          membro da equipe da plataforma.
        </li>
        <li>
          <span className="font-semibold">1.7</span> Em caso de cancelamento de
          vagas específicas dentro de uma campanha por parte da Marca, esta
          deverá arcar com uma taxa de cancelamento correspondente a 20% do
          valor total definido para cada vaga cancelada. A cobrança desse valor
          tem por objetivo compensar o processo de administração da vaga e
          garantir o comprometimento da marca com os criadores que poderiam ter
          ocupado essas posições.
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        2. Compromisso do Creator:
      </h3>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <span className="font-semibold">2.1</span> O Creator compromete-se a
          atender integralmente às campanhas nas quais aderir, produzindo o
          conteúdo conforme descrito na campanha e mantendo alinhamento
          irrestrito com diretrizes da Marca anunciante.
        </li>
        <li>
          <span className="font-semibold">2.2</span> Não serão permitidas
          negociações fora da plataforma pelo Creator, ainda que com Marca para
          quem já tenha feito campanha. (sujeito a ser banido da plataforma, sem
          prejuízo por perdas e danos causados)
        </li>
        <li>
          <span className="font-semibold">2.3</span> A plataforma reforça sua
          não-aceitação da compra de seguidores ou participação em grupos de
          engajamento para as redes sociais utilizadas por Creator. Caso um
          Creator já se enquadre nessas práticas, é obrigatório o expresso aviso
          prévio antes de aderir a uma campanha, cabendo à plataforma e/ou Marca
          aceitar ou não.
        </li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        CLÁUSULA SEGUNDA - PAGAMENTO DAS CAMPANHAS
      </h2>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        1. Criação da campanha
      </h3>
      <p className="mb-4">
        A Marca deve inserir todas as informações necessárias para a criação da
        campanha na plataforma Conecte Publi, incluindo o valor a ser investido.
        Sendo que 80% do valor total da campanha será utilizado para pagamentos
        aos Creators, e 20% destinado à Conecte Publi a título de taxa de
        serviço.
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        2. Pagamento da campanha
      </h3>
      <p className="mb-4">
        Após a conclusão da criação da campanha, o valor estipulado pela Marca
        deverá ser pago diretamente na plataforma Conecte Publi através do
        sistema de pagamento PagBank. O pagamento deve ser realizado
        automaticamente e imediamente após a Marca clicar em "salvar campanha".
        Somente após a confirmação do pagamento a campanha será ativada e
        disponibilizada para os Creators na plataforma.
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        3. Distribuição de valores
      </h3>
      <p className="mb-4">
        Somente quando a campanha for finalizada é que o valor correspondente a
        80% (oitenta por cento) do valor pago pela Marca será destinado ao
        Creator responsável pela execução das atividades, ficando retido 20%
        (vinte por cento) do valor pela Conecte Publi a título de taxa de
        serviço.
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        4. Pagamento ao creator
      </h3>
      <p className="mb-4">
        O pagamento ao Creator não será realizado imediatamente após a
        finalização de uma campanha. Valores devidos ao Creator serão
        transferidos pela Conecte Publi, através de transferência via PIX sempre
        no dia 15 (quinze) de cada mês, para a chave PIX informada pelo Creator,
        referente a todas as campanhas finalizadas por ele no mês anterior.
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">5. Reembolso à marca</h3>
      <p className="mb-4">
        Se o Creator não cumprir os requisitos estabelecidos e aceitos para a
        campanha, a Marca terá direito a requerer reembolso integral do valor
        investido, sem acréscimos, o que será devido somente após comprovado
        descumprimento dos requisitos não cumpridos, cabendo à Marca aguardar
        análise pela plataforma da comprovação apresentada. O reembolso devido à
        Marca será realizado em até 10 (dez) dias úteis após comprovado o
        descumprimento.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        CLÁUSULA TERCEIRA - CRITÉRIOS PARA BANIMENTO DE USUÁRIOS PELA
        PLATAFORMA:
      </h2>
      <ul className="list-decimal list-inside space-y-2">
        <li>
          Violação de Termos de Serviço: Quando um usuário quebra regras
          estabelecidas, como publicações em desacordo com política e finalidade
          da plataforma, promoção de conteúdos por lei e pela plataforma
          proibidos e uso da plataforma para atividades não autorizadas
          previamente.
        </li>
        <li>
          Comportamento Abusivo ou Discriminatório: Atitudes e falas que
          caracterizem assédio e/ou bullying e qualquer ato ou comentário
          discriminatório darão ensejo para imediato banimento.
        </li>
        <li>
          Conteúdo ou Atividades Spam: O uso da plataforma para enviar spam,
          publicar conteúdos repetitivos e irrelevantes, ou promover links
          legalmente suspeitos justifica a exclusão da plataforma.
        </li>
        <li>
          Engano sobre Produto ou Marca: Quando uma Marca for apresentada de
          maneira enganosa, se apresentando ou apresentando produtos violando a
          confiança de usuários e consumidores esta será banida da plataforma.
        </li>
        <li>
          Engano por Creator (Creator Fake): Creators que se apresentem de forma
          enganosa, falsa ou fraudulenta, prejudicando a credibilidade da
          plataforma serão imediatamente banidos.
        </li>
        <li>
          Descumprimento da Finalidade de Campanhas: Creators que, sem
          justificativa aceitável, falham em cumprir as finalidades de campanhas
          previamente aprovadas pela plataforma serão banidos.{" "}
        </li>
        <li>
          Má Índole: Qualquer comportamento considerado de má índole (incoerente
          e incompatível com leis e costumes), que comprometa a confiança,
          segurança ou integridade da plataforma dará ensejo a banimento.
        </li>
        <li>
          Tentar ou Fechar Acordos por Fora da Plataforma: Usuários que tentam
          realizar negócios ou venham a celebrar acordos fora da plataforma,
          realizando termos e processos de trabalho que fazem parte do escopo da
          plataforma, após atuarem através da mesma, desrespeitando políticas de
          uso e prática comercial serão banidos.
        </li>
        <li>
          Desrespeito à Política de Privacidade e Termos e Condições: O não
          cumprimento das políticas de privacidade e/ou dos termos e condições
          estabelecidos pela plataforma, que garantem a segurança e a
          experiência de todos os usuários são motivos ensejadores de banimento.
        </li>
        <li>
          Quebra de Contrato entre Creator e Marca: Quando o creator
          desrespeitar os termos do contrato estabelecido entre ele e a marca,
          desconsiderando as condições acordadas e prejudicando a parceria será
          banido.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Responsabilidades do Usuário
      </h2>
      <p className="mb-4">
        (a) Registro: você deve criar uma conta e fornecer informações precisas,
        completas e atualizadas. Você é responsável por manter a
        confidencialidade de suas informações de login e por todas as atividades
        que ocorrerem em sua conta.
      </p>
      <p className="mb-4">
        (b) Uso Adequado: você concorda em utilizar nossa plataforma de forma
        adequada e em conformidade com todas as leis aplicáveis. Você não deve
        utilizar a plataforma para fins ilegais, fraudulentos ou não
        autorizados.
      </p>
      <p className="mb-4">
        (c) Veracidade das Informações: tanto Marcas quanto Creators são
        responsáveis por garantir a veracidade das informações fornecidas na
        plataforma.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Propriedade Intelectual
      </h2>
      <p className="mb-4">
        (a) Direitos Autorais: todos os direitos autorais, marcas registradas,
        segredos comerciais e outros direitos de propriedade intelectual
        relacionados à plataforma Conecte Publi e ao seu conteúdo são de
        propriedade exclusiva da plataforma ou de terceiros devidamente
        autorizados.
      </p>
      <p className="mb-4">
        (b) Uso Restrito: você concorda em não copiar, reproduzir, modificar,
        distribuir, exibir, transmitir, vender, licenciar ou explorar qualquer
        parte da plataforma Conecte Publi sem a autorização por escrito da
        plataforma.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Privacidade</h2>
      <p className="mb-4">
        A privacidade dos usuários é importante para nós. Oo uso das informações
        pessoais fornecidas por você está sujeito à nossa Política de
        Privacidade, que descreve como coletamos, usamos, armazenamos e
        divulgamos essas informações.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Limitação de Responsabilidade
      </h2>
      <p className="mb-4">
        (a) Uso por sua Conta e Risco: Você compreende e concorda que utiliza a
        plataforma Conecte Publi de livre e consciente vontade, sendo ciente e
        responsável por sua própria vontade, conta e risco. A plataforma não se
        responsabiliza por qualquer dano ou prejuízo decorrente do uso da
        plataforma.
      </p>
      <p className="mb-4">
        (b) Terceiros: A plataforma não se responsabiliza por quaisquer ações,
        omissões ou condutas de marcas, creators ou terceiros relacionados às
        transações realizadas na plataforma.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Rescisão</h2>
      <p className="mb-4">
        Reservamos o direito de suspender ou encerrar sua conta e restringir seu
        acesso à plataforma Conecte Publi, a nosso critério exclusivo, sem aviso
        prévio ou responsabilidade, por qualquer motivo, incluindo violação
        destes Termos de Uso.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Alterações nos Termos de Uso
      </h2>
      <p className="mb-4">
        Podemos modificar Termos de Uso a qualquer momento, publicando uma
        versão atualizada na plataforma Conecte Publi. É sua responsabilidade
        revisar regularmente os Termos de Uso. O uso continuado da plataforma
        após quaisquer alterações constitui aceitação de alterações ocorridas
        após sua adesão.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Disposições Gerais</h2>
      <p className="mb-4">
        Estes Termos de Uso constituem o acordo integral entre você e a
        plataforma Conecte Publi em relação ao conteúdo/assunto aqui tratado e
        substituem todos os acordos anteriores ou contemporâneos, escritos ou
        orais existentes.
      </p>
      <p className="mt-4">
        Caso qualquer disposição destes Termos de Uso seja considerada inválida
        ou inexequível, as demais disposições permanecerão em vigor.
      </p>
      <p className="mt-4">
        Estes Termos de Uso são regidos e interpretados de acordo com as leis do
        país e Estado em que a plataforma Conecte Publi está registrada.
      </p>
      <p className="mt-4">
        Se você tiver alguma dúvida, entre em contato conosco através dos canais
        de suporte.
      </p>
    </div>
  );
}
