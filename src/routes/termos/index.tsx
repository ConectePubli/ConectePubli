import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/termos/")({
  component: TermosDeUso,
});

function TermosDeUso() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">
        Termos de Uso da Plataforma Conecte Publi
      </h1>
      <p className="mb-4">
        Bem-vindo(a) à nossa plataforma Conecte Publi, que facilita a conexão
        entre marcas e influenciadores digitais! Antes de utilizar nossos
        serviços, por favor, leia atentamente estes Termos de Uso. Ao acessar ou
        usar nossa plataforma, você concorda com os seguintes termos e
        condições:
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Aceitação dos Termos</h2>
      <p className="mb-4">
        Ao acessar ou utilizar a plataforma Conecte Publi, você concorda em
        cumprir e ficar vinculado a estes Termos de Uso, bem como a todas as
        leis e regulamentos aplicáveis. Se você não concordar com qualquer parte
        destes termos, não utilize nossa plataforma.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Descrição do Serviço</h2>
      <p className="mb-4">
        A plataforma Conecte Publi tem como objetivo facilitar a conexão entre
        marcas e influenciadores digitais para a realização de campanhas de
        marketing e divulgação de produtos ou serviços. Fornecemos uma interface
        onde marcas podem criar propostas de colaboração e influenciadores podem
        se candidatar para participar dessas campanhas.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Compromisso das Partes
      </h2>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        1. Compromisso da Marca:
      </h3>
      <ul className="list-disc list-inside space-y-2">
        <li>
          A Marca compromete-se a zelar pelo comprometimento com a plataforma.
        </li>
        <li>
          Fica terminantemente proibido à Marca estabelecer contatos externos à
          plataforma, com o intuito de buscar parcerias que não estejam
          estritamente alinhadas com os termos da campanha previamente descrita.
        </li>
        <li>
          No caso de aprovação seguida de desaprovação de um creator pela Marca,
          esta compromete-se a arcar com uma multa no valor mínimo de R$80,00,
          podendo variar conforme o montante estipulado na campanha.
        </li>
        <li>
          A Marca não poderá desativar uma campanha sem aviso prévio e
          autorização formal de um membro da equipe Conecte Publi, exceto em
          casos excepcionais.
        </li>
        <li>
          Qualquer alteração no briefing da campanha após a aprovação e
          publicação na plataforma somente será permitida mediante autorização
          expressa de um membro da equipe da plataforma.
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        2. Comprometimento dos Creators:
      </h3>
      <ul className="list-disc list-inside space-y-2">
        <li>
          Os Creators comprometem-se a atender integralmente às campanhas nas
          quais se inscreverem, produzindo o conteúdo conforme descrito na
          campanha e mantendo alinhamento irrestrito com a marca anunciante.
        </li>
        <li>
          A plataforma reforça sua não-aceitação da compra de seguidores ou
          participação em grupos de engajamento para as redes sociais utilizadas
          pelos creators.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Pagamento de Campanhas
      </h2>
      <p className="mb-4">
        A marca deve inserir todas as informações necessárias para a criação da
        campanha na plataforma ConectePubli, incluindo o valor a ser investido.
        Este valor será utilizado para os pagamentos aos creators, sendo 80% do
        valor da campanha e à ConectePubli como taxa de serviço 20%.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Responsabilidades do Usuário
      </h2>
      <p className="mb-4">
        (a) Registro: Para utilizar a plataforma Conecte Publi, você deve criar
        uma conta e fornecer informações precisas, completas e atualizadas. Você
        é responsável por manter a confidencialidade de suas informações de
        login e por todas as atividades que ocorrerem em sua conta.
      </p>
      <p className="mb-4">
        (b) Uso Adequado: Você concorda em utilizar nossa plataforma de forma
        adequada e em conformidade com todas as leis aplicáveis. Você não deve
        utilizar a plataforma para fins ilegais, fraudulentos ou não
        autorizados.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Propriedade Intelectual
      </h2>
      <p className="mb-4">
        (a) Direitos Autorais: Todos os direitos autorais, marcas registradas,
        segredos comerciais e outros direitos de propriedade intelectual
        relacionados à plataforma Conecte Publi e ao seu conteúdo são de
        propriedade exclusiva da plataforma ou de terceiros devidamente
        autorizados.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Privacidade</h2>
      <p className="mb-4">
        A privacidade dos usuários é importante para nós. Nosso uso das
        informações pessoais fornecidas por você está sujeito à nossa Política
        de Privacidade, que descreve como coletamos, usamos, armazenamos e
        divulgamos essas informações.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Limitação de Responsabilidade
      </h2>
      <p className="mb-4">
        (a) Uso por sua Conta e Risco: Você compreende e concorda que utiliza a
        plataforma Conecte Publi por sua própria conta e risco. A plataforma não
        se responsabiliza por qualquer dano ou prejuízo decorrente do uso da
        plataforma.
      </p>
      <p className="mb-4">
        (b) Terceiros: A plataforma não se responsabiliza por quaisquer ações,
        omissões ou condutas de marcas, influenciadores ou terceiros
        relacionados às transações realizadas na plataforma.
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
        Podemos modificar estes Termos de Uso a qualquer momento, publicando uma
        versão atualizada na plataforma Conecte Publi. É sua responsabilidade
        revisar regularmente os Termos de Uso. O uso continuado da plataforma
        após quaisquer alterações constitui sua aceitação dessas alterações.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Disposições Gerais</h2>
      <p className="mb-4">
        Estes Termos de Uso constituem o acordo integral entre você e a
        plataforma Conecte Publi em relação ao assunto aqui tratado e substituem
        todos os acordos anteriores ou contemporâneos, escritos ou orais.
      </p>

      <p className="mb-4">
        Caso qualquer disposição destes Termos de Uso seja considerada inválida
        ou inexequível, as demais disposições permanecerão em vigor.
      </p>

      <p className="mt-4">
        Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato
        conosco através dos canais de suporte fornecidos na plataforma.
      </p>
    </div>
  );
}
