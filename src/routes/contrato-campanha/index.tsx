import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/contrato-campanha/")({
  component: ContratoDeCampanha,
});

function ContratoDeCampanha() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">
        Termo de Aceite / Contrato para Participação em Campanha
      </h1>
      <p className="mb-4">
        Ao aceitar participar de uma campanha organizada por uma marca
        cadastrada na plataforma ConectePubli (
        <a href="https://conectepubli.com.br" className="text-blue-500">
          conectepubli.com.br
        </a>
        ), como criador(a) de conteúdo, declaro para todos os fins de direito
        que, de livre vontade, li, reconheço e aceito os termos de aceite /
        contrato abaixo e concordo com os seguintes termos e condições:
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1 - Relação Contratual
      </h2>
      <p className="mb-4">
        Ao aceitar participar da campanha, firmo um contrato diretamente com a
        marca anunciante. Reconheço que a plataforma ConectePubli atua apenas
        como intermediária na conexão entre marcas e criadores, não sendo parte
        integrante deste contrato, não tendo responsabilidades a serem
        requeridas.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2 - Termos da Campanha
      </h2>
      <p className="mb-4">
        Concordo em seguir os termos e condições específicos estabelecidos pela
        marca anunciante para a campanha, conforme informado pela plataforma.
        Isso inclui, mas não se limita a:
      </p>
      <p className="mb-4">
        <strong>● Conteúdo:</strong> Devo produzir e publicar conteúdo relevante
        e em conformidade com as diretrizes fornecidas pela marca. O conteúdo
        pode incluir, mas não se limita a posts em redes sociais, vídeos, fotos
        ou qualquer outra forma de divulgação acordada.
      </p>
      <p className="mb-4">
        <strong>● Cronograma:</strong> Devo cumprir os prazos estabelecidos pela
        marca para a criação, revisão e publicação do conteúdo relacionado à
        campanha.
      </p>
      <p className="mb-4">
        <strong>● Menções e Hashtags:</strong> Devo incluir as menções, tags ou
        hashtags fornecidas pela marca nas postagens relacionadas à campanha.
      </p>
      <p className="mb-4">
        <strong>● Direitos Autorais:</strong> Reconheço que todo o conteúdo
        criado para a campanha, incluindo, mas não se limitando a fotografias,
        vídeos e textos, é de propriedade da marca anunciante, sujeito a
        direitos autorais e outras normas de propriedade intelectual aplicáveis.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3 - Remuneração e Pagamento
      </h2>
      <p className="mb-4">
        Aceito que a plataforma efetue o pagamento, devido pela campanha
        realizada, após eu ter cumprido todos os entregáveis do escopo combinado
        com a marca.
      </p>
      <p className="mb-4">
        Aceito que somente após a conclusão da campanha e a aprovação do
        trabalho pela marca, a ConectePubli liberará o pagamento, nas seguintes
        condições:
      </p>
      <p className="mb-4">
        ● Do valor total da campanha 80% (oitenta por cento) será a mim
        destinado enquanto criador de conteúdo e 20% (vinte por cento) será
        retido pela ConectePubli como taxa de serviço. Aceito que, mesmo com a
        campanha finalizada, o pagamento devido por meu trabalho será feito
        manualmente via PIX pela ConectePubli, no dia 15 de cada mês, referente
        às campanhas finalizadas no mês anterior, através de chave PIX por mim
        informada.
      </p>
      <p className="mb-4">
        ● Fica estabelecido que o pagamento será realizado exclusivamente após a
        conclusão e entrega de todos os itens obrigatórios do escopo definido
        pela marca para a campanha. Caso o escopo não seja entregue de forma
        integral ou não esteja em conformidade com os termos previamente
        estabelecidos pela marca, o pagamento não será efetuado.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4 - Responsabilidades e Conformidade
      </h2>
      <p className="mb-4">
        Aceito ser responsável por cumprir todas as leis e regulamentos
        aplicáveis durante a participação na campanha. Isso inclui, mas não se
        limita a seguir as diretrizes de publicidade, respeitar direitos de
        terceiros e evitar a promoção de conteúdo enganoso, ilegal ou
        prejudicial.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5 - Relacionamento Independente
      </h2>
      <p className="mb-4">
        Ao aceitar este termo/ contrato, reconheço que a relação com a marca
        anunciante é de trabalho independente, caracterizado por ser realizado
        sem vínculo empregatício, não sendo considerado um funcionário, parceiro
        comercial ou representante da marca anunciante e/ou com a plataforma
        ConectePubli.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6 - Consentimento de Uso de Imagem
      </h2>
      <p className="mb-4">
        Ao participar da campanha, concedo, à marca anunciante e à plataforma
        ConectePubli, o direito irrevogável de usarem meu nome, imagem, voz e
        conteúdo criado para a campanha, exclusivamente para fins promocionais e
        de marketing relacionados à campanha.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        7 - Cancelamento e Rescisão
      </h2>
      <p className="mb-4">
        Reconheço e aceito que a marca anunciante tem o direito de cancelar a
        minha participação na campanha a qualquer momento, mediante aviso
        prévio, com 10 (dez) dias de antecedência, aplicando-se a mim também
        esse mesmo direito de renúncia e rescisão. O cancelamento ou rescisão
        não isenta a parte renunciante do cumprimento dos termos e condições
        previamente acordados.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8 - Responsabilidade</h2>
      <p className="mb-4">
        Reconheço que a plataforma ConectePubli não assume qualquer
        responsabilidade por disputas, reclamações, danos ou prejuízos
        resultantes da relação com a marca anunciante. Qualquer litígio ou
        controvérsia deverá ser resolvido diretamente com a marca envolvida.
      </p>
    </div>
  );
}
