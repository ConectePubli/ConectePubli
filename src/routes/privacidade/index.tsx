import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/privacidade/")({
  component: PoliticaDePrivacidade,
});

function PoliticaDePrivacidade() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">
        Política de Privacidade da Plataforma Conecte Publi
      </h1>
      <p className="mb-4">
        Esta Política de Privacidade descreve como a plataforma Conecte Publi
        coleta, usa, armazena e divulga as informações pessoais dos usuários. Ao
        utilizar nossa plataforma, você concorda com as práticas descritas nesta
        política.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1 - Informações Coletadas
      </h2>
      <p className="mb-4">
        <strong>(a) Informações de Registro:</strong> Ao criar uma conta na
        plataforma Conecte Publi, você fornecerá informações como nome, endereço
        de e-mail, nome de usuário e senha.
      </p>
      <p className="mb-4">
        <strong>(b) Informações do Perfil:</strong> Você pode optar por fornecer
        informações adicionais em seu perfil, como informações demográficas,
        interesses, histórico profissional e links para suas redes sociais.
      </p>
      <p className="mb-4">
        <strong>(c) Informações de Pagamento:</strong> Se você for uma marca que
        realiza pagamentos aos creators, poderemos coletar informações de
        pagamento, como números de cartão de crédito, endereço de cobrança e
        detalhes necessários para a transação financeira. As informações de
        pagamento são processadas por nossos provedores de serviços de pagamento
        e não são armazenadas em nossos servidores.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2 - Uso das Informações
      </h2>
      <p className="mb-4">
        <strong>(a) Fornecimento dos Serviços:</strong> Utilizamos as
        informações coletadas para operar, manter e melhorar a plataforma
        Conecte Publi, para fornecer suporte ao usuário e facilitar a conexão
        entre marcas e creators.
      </p>
      <p className="mb-4">
        <strong>(b) Comunicações:</strong> Podemos utilizar o endereço de e-mail
        fornecido para enviar notificações relacionadas à plataforma,
        atualizações, informações sobre campanhas e outros comunicados
        relevantes.
      </p>
      <p className="mb-4">
        <strong>(c) Personalização:</strong> Utilizamos as informações para
        personalizar a experiência do usuário na plataforma, exibindo conteúdos
        e recomendações relevantes com base em interesses e preferências
        identificadas.
      </p>
      <p className="mb-4">
        <strong>(d) Análises e Melhorias:</strong> Podemos utilizar informações
        agregadas e anônimas para fins analíticos, estatísticos e de pesquisa, a
        fim de melhorar nossos serviços e entender melhor as necessidades e
        preferências dos usuários.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3 - Compartilhamento de Informações
      </h2>
      <p className="mb-4">
        <strong>(a) Compartilhamento com Marcas e Creators:</strong> Para
        facilitar a conexão entre marcas e creators, compartilharemos
        informações relevantes, como nome de usuário, informações de perfil e
        histórico de colaborações, com as partes envolvidas na transação.
      </p>
      <p className="mb-4">
        <strong>(b) Terceiros de Confiança:</strong> Podemos compartilhar
        informações com fornecedores de serviços terceirizados que nos auxiliam
        na operação da plataforma, como serviços de hospedagem, processamento de
        pagamentos e análise de dados. Esses terceiros estão sujeitos a
        obrigações contratuais de proteção de dados.
      </p>
      <p className="mb-4">
        <strong>(c) Cumprimento Legal:</strong> Podemos divulgar informações
        pessoais se exigido por lei, regulamento ou ordem judicial, ou se
        acreditarmos de boa-fé que tal divulgação é necessária para proteger
        nossos direitos, segurança ou propriedade, ou para cumprir com um
        processo legal.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4 - Segurança das Informações
      </h2>
      <p className="mb-4">
        Empregamos medidas de segurança adequadas para proteger as informações
        pessoais dos usuários contra acesso não autorizado, uso indevido ou
        alteração não autorizada. No entanto, nenhum método de transmissão pela
        Internet ou armazenamento eletrônico é 100% seguro, e não podemos
        garantir a segurança absoluta das informações.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5 - Cookies e Tecnologias Semelhantes
      </h2>
      <p className="mb-4">
        Podemos utilizar cookies e outras tecnologias semelhantes de livre
        escolha para coletar informações sobre o uso da plataforma, aprimorar a
        experiência do usuário e fornecer conteúdos personalizados. Você pode
        gerenciar suas preferências de cookies nas configurações do seu
        navegador.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6 - Links para Sites de Terceiros
      </h2>
      <p className="mb-4">
        A plataforma Conecte Publi pode conter links para sites de terceiros.
        Esta Política de Privacidade se aplica apenas à plataforma Conecte
        Publi, e não nos responsabilizamos pelas práticas de privacidade de
        outros sites. Recomendamos que você revise as políticas de privacidade
        desses sites antes de fornecer informações pessoais.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        7 - Consentimento do Usuário
      </h2>
      <p className="mb-4">
        Ao utilizar a plataforma Conecte Publi, você consente com a coleta, uso,
        armazenamento e divulgação de suas informações pessoais conforme
        descrito nesta Política de Privacidade.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        8 - Alterações nesta Política de Privacidade
      </h2>
      <p className="mb-4">
        Podemos atualizar esta Política de Privacidade periodicamente para
        refletir mudanças em nossas práticas de privacidade. Recomendamos que
        você revise esta política regularmente. O uso continuado da plataforma
        após quaisquer alterações constitui sua aceitação dessas alterações.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contato</h2>
      <p className="mb-4">
        Se você tiver alguma dúvida ou preocupação sobre esta Política de
        Privacidade ou sobre o uso de suas informações pessoais, entre em
        contato conosco através dos canais de suporte fornecidos na plataforma.
      </p>
    </div>
  );
}
