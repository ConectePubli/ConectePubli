/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
  createFileRoute,
  redirect,
  useLoaderData,
} from "@tanstack/react-router";
import { t } from "i18next";
import { toast } from "react-toastify";
import { CaretLeft } from "phosphor-react";

// 📌 IMPORTANDO AS IMAGENS
import contratos_prontos from "@/assets/contents_creators/contratos_prontos.png";
import guia_completo_criadores from "@/assets/contents_creators/guia_completo_criadores.png";
import como_criar_conteudo from "@/assets/contents_creators/como_criar_conteudo.png";
import creator_economy_dicionario from "@/assets/contents_creators/creator_economy_dicionario.png";
import ebook_emitir_nota_fiscal from "@/assets/contents_creators/ebook_emitir_nota_fiscal.png";
import como_criar_roteiros from "@/assets/contents_creators/como_criar_roteiros.png";
import aula_edicao from "@/assets/contents_creators/aula_edicao.png";
import aula_midia_kit from "@/assets/contents_creators/aula_midia_kit.png";

// 📌 IMPORTANDO OS PDFs
import contratos_prontos_pdf from "@/assets/contents_creators/downloads/Kit Completo Contratos Prontos + Tutorial de Edição.pdf";
import guia_completo_criadores_pdf from "@/assets/contents_creators/downloads/Ebook Creator Economy 360° - Um Guia Completo Para Creators.pdf";
import como_criar_conteudo_pdf from "@/assets/contents_creators/downloads/Ebook Como Criar Conteúdo – Ferramentas, Dicas e Prompts Estratégicos com ChatGPT.pdf";
import creator_economy_dicionario_pdf from "@/assets/contents_creators/downloads/Dicionário da Creators Economy.pdf";
import ebook_emitir_nota_fiscal_pdf from "@/assets/contents_creators/downloads/E-Book Guia Prático para Emitir Nota Fiscal como Creator.pdf";
import como_criar_roteiros_pdf from "@/assets/contents_creators/downloads/Ebook Como Criar Roteiros – Técnicas Práticas e Prompts Estratégicos com IA e ChatGPT.pdf";

import { CreatorProduct } from "@/types/CreatorProduct";
import pb from "@/lib/pb";

import Spinner from "@/components/ui/Spinner";
import GatewayPaymentModal from "@/components/ui/GatewayPaymentModal";
import Modal from "@/components/ui/Modal";
import MuxPlayer from "@mux/mux-player-react";
import { getUserType } from "@/lib/auth";

interface VideoLessonType {
  index: string;
  title: string;
  video_id: string;
  subtitle: string;
  intro: string | string[];
  highlights: { title: string; description?: string }[];
  moreIntro: string;
  advancedFeatures: { title: string; description: string }[];
  stepsTitle: string;
  steps: string[];
  lastTexts?: string[];
  downloadText: string;
  downloadLinks?: string[];
  additionalLinks?: { text: string; url: string }[];
}

const medias = [
  {
    id: "achak6oh9sh3gwe",
    image: guia_completo_criadores,
    file: guia_completo_criadores_pdf,
  },
  {
    id: "scpc4bm2z4ahogw",
    image: aula_edicao,
    file: "video",
  },
  {
    id: "4buw4f7duhyk0nv",
    image: aula_midia_kit,
    file: "video",
  },
  {
    id: "4e0e0cjusv2x4xq",
    image: contratos_prontos,
    file: contratos_prontos_pdf,
  },
  {
    id: "45ilvko3zqd36yv",
    image: como_criar_roteiros,
    file: como_criar_roteiros_pdf,
  },
  {
    id: "zpc3r39o5ysl8tx",
    image: como_criar_conteudo,
    file: como_criar_conteudo_pdf,
  },
  {
    id: "s1icd9t9nlessxq",
    image: creator_economy_dicionario,
    file: creator_economy_dicionario_pdf,
  },
  {
    id: "z341j47jkc57qww",
    image: ebook_emitir_nota_fiscal,
    file: ebook_emitir_nota_fiscal_pdf,
  },
];

const videoLessons: VideoLessonType[] = [
  {
    index: "scpc4bm2z4ahogw",
    title: t("Aula Tutorial: Edição de Conteúdo no CapCut para Creators"),
    video_id: "Lfpv7x35zHdvuyPt7XHIML00nUwCeMoNEoD6CpeHH02Vw",
    subtitle: t("Edite Seus Próprios Vídeos Como um Profissional!"),
    intro: t(
      "Bem-vindos à aula de edição de vídeos no CapCut, onde vou ensinar três tipos de edição essenciais para criadores de conteúdo:"
    ),
    highlights: [
      {
        title: t("Vídeo longo"),
        description: t(
          "Perfeito para tutoriais, como o que fiz do Mídia Kit. O resultado completo está disponível na Central de Recursos dos Creators da Conecte Publi, e vou mostrar um pedacinho aqui para vocês!"
        ),
      },
      {
        title: t("Vídeo curto (Reels até 90s)"),
        description: t(
          "Aqui, vou editar um trecho do podcast para demonstrar todos os recursos que vocês podem aplicar em qualquer vídeo. Também vou mostrar exemplos reais: o vídeo da marca Reserva, onde utilizei camadas para destacar elementos importantes, e o vídeo da DUH, com edição de unboxing."
        ),
      },
      {
        title: t("B-rolls (até 15s)"),
        description: t(
          "São aqueles takes rápidos que enfatizam detalhes do produto. Vou mostrar um B-roll que editei, destacando a textura e os detalhes do produto de forma profissional."
        ),
      },
    ],
    moreIntro: t(
      "Além disso, vamos aprender recursos avançados para deixar a edição ainda mais fluida:"
    ),
    advancedFeatures: [
      {
        title: t("Isolamento de voz"),
        description: t("Como extrair a voz para editar de forma rápida."),
      },
      {
        title: t("Sincronização de imagem e áudio"),
        description: t("Ajustar pontos exatos."),
      },
      {
        title: t("Melhoria de imagem"),
        description: t("Ajustes de brilho, nitidez e contraste."),
      },
      {
        title: t("Efeitos e animações"),
        description: t("Adicionar transições e camadas."),
      },
      {
        title: t("Remoção e substituição de fundo"),
        description: t("Trocar o fundo e criar sobreposições."),
      },
      {
        title: t("Resolução e qualidade"),
        description: t(
          "Melhorar a qualidade do vídeo, mesmo que não tenha sido gravado na melhor configuração."
        ),
      },
      {
        title: t("Legendas, trilha sonora e efeitos de áudio"),
        description: t(
          "Como adicionar legendas automáticas, músicas e efeitos sonoros."
        ),
      },
      {
        title: t("Velocidade do vídeo"),
        description: t(
          "Como acelerar ou usar câmera lenta para dar mais impacto."
        ),
      },
      {
        title: t("Salvar e compartilhar"),
        description: t(
          "Como exportar em alta qualidade (2K e mais), salvar no Google Drive, WeTransfer ou arquivos, e enviar o link para a marca na Conecte Publi, caso tenha sido aprovado em uma campanha."
        ),
      },
    ],
    stepsTitle: t("📌 Passo a passo da edição:"),
    steps: [
      t("1️⃣ Criar um novo projeto no CapCut."),
      t("2️⃣ Adicionar todos os vídeos que serão editados."),
      t(
        "3️⃣ Dividir as partes mais importantes e excluir o que não será usado."
      ),
      t("4️⃣ Aplicar efeitos, cortes, transições e ajustes."),
      t(
        "5️⃣ Exportar e salvar no formato ideal para garantir qualidade máxima ao enviar para as marcas."
      ),
    ],
    lastTexts: [
      "E para facilitar, vou disponibilizar 4 overlays exclusivos para sobreposições. O link para baixar está na descrição do vídeo! 🎁",
      "Agora, bora começar a edição e transformar seus vídeos em conteúdos ainda mais incríveis? 🚀",
    ],
    downloadLinks: [
      "https://drive.google.com/file/d/1XvIq2yUXDqNN-T3M1m8GQ2Fv0m-ueN7W",
    ],
    downloadText: t("Link com overlays:"),
  },
  {
    index: "4buw4f7duhyk0nv",
    title: t("Aula Tutorial: Como Criar Seu Mídia Kit"),
    video_id: "025zekBN02QhG6FXwcVBFUsvsVrzvEtuZANFB3UC5CwUU",
    subtitle: t("Transforme Seu Mídia Kit em um Site Profissional!"),
    intro: [
      t(
        "Vocês viram que na Conecte Publi temos um espaço para colocar o link do mídia kit, certo? Para facilitar, estou disponibilizando + de 10 modelos gratuitos de mídia kit prontos no Canva para vocês editarem com suas informações e personalizarem do seu jeito."
      ),
      t(
        "Além disso, neste vídeo, vou ensinar como transformar seu mídia kit em um site, para que vocês tenham um link profissional para colocar na Conecte Publi e compartilhar com quem quiserem."
      ),
      t("O que você vai aprender neste vídeo?"),
    ],
    highlights: [
      {
        title: t("Como escolher um modelo de mídia kit pronto no Canva."),
        description: "",
      },
      {
        title: t("Como editar e personalizar com suas informações."),
        description: "",
      },
      {
        title: t("Como transformar o mídia kit em um site gratuito no Canva."),
        description: "",
      },
      {
        title: t(
          "Como gerar um link profissional e onde adicioná-lo na Conecte Publi."
        ),
        description: "",
      },
    ],
    moreIntro: t("📌 No final, você terá seu mídia kit em dois formatos:"),
    advancedFeatures: [
      { title: "PDF", description: t("Para enviar diretamente para marcas.") },
      {
        title: t("Link de site publicado"),
        description: t("Para compartilhar de forma profissional."),
      },
    ],
    stepsTitle: t("Passo a Passo:"),
    steps: [
      t("1️⃣ Escolha o modelo de mídia kit que mais combina com você."),
      t(
        "2️⃣ Faça uma cópia no Canva e renomeie com seu nome. Exemplo: Mídia Kit [Seu Nome]."
      ),
      t(
        "3️⃣ Edite com todas as suas informações: Sobre você, trabalhos realizados, resultados obtidos, tipos de entrega, nichos, estatísticas e métricas, valores, formas de trabalho e seus contatos."
      ),
      t(
        "4️⃣ Personalize! Ajuste fontes, cores, layout e adicione sua logo (se tiver)."
      ),
      t(
        "5️⃣ Publique como site! No final, transforme seu mídia kit em um site gratuito no Canva."
      ),
      t("6️⃣ Agora você tem dois formatos: PDF e Link do site."),
      t(
        "7️⃣ Vá até a Conecte Publi, adicione o link do seu mídia kit na plataforma e salve!"
      ),
    ],
    downloadText: t(
      "📌 Acesse os links gratuitos dos modelos de mídia kit aqui: 👇"
    ),
    downloadLinks: [
      "https://www.canva.com/design/DAGd5x5nXRs/Bsea2TNOvdCQPrW8b22WqA/edit?utm_content=DAGd5x5nXRs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      "https://www.canva.com/design/DAGd6LMEfU0/VEIn2Cn7o2zLBb476m7_8Q/edit?utm_content=DAGd6LMEfU0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      "https://www.canva.com/design/DAGd6PpKo_o/Jwcaynd7Fqk-h04rqWkD3A/edit?utm_content=DAGd6PpKo_o&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      "https://www.canva.com/design/DAGd6Jr2hlk/jHs_p7Xu0xD4FoCFtgHHTQ/edit?utm_content=DAGd6Jr2hlk&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      "https://www.canva.com/design/DAGd6NyKOWg/pimjO1G-9hjb0PLz8mkEGg/edit?utm_content=DAGd6NyKOWg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      "https://www.canva.com/design/DAGd6AP8fe8/RwRMMR-UE6h19cJjjHcXBA/edit?utm_content=DAGd6AP8fe8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      "https://www.canva.com/design/DAGd6OLF30A/uGTM3OB0u3yImh6CVmeURA/edit?utm_content=DAGd6OLF30A&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      "https://www.canva.com/design/DAGd6PDTyN0/ARc4w1QIfl1Ts1NiXOVBBQ/edit?utm_content=DAGd6PDTyN0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      "https://www.canva.com/design/DAGd6N16vOw/o9HeLhuhOWFFs4XVEFP2Hg/edit?utm_content=DAGd6N16vOw&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      "https://www.canva.com/design/DAGd6N016Qg/Uwo3-X-Ew6_r1eOs6BUphQ/edit?utm_content=DAGd6N016Qg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      "https://www.canva.com/design/DAGd6OD_cKs/chf18zZ9bifsxR1326SI_Q/edit?utm_content=DAGd6OD_cKs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
    ],
    additionalLinks: [
      {
        text: t(
          "🌟 Vou deixar aqui abaixo o link do meu mídia kit, que mostrei no vídeo. Vocês também podem usá-lo como base, apenas modificando com as informações de vocês! 😉 Segue:"
        ),
        url: "https://www.canva.com/design/DAF6ezDbMLY/W0dYgjJa18EvT6x03LyZHA/edit?utm_content=DAF6ezDbMLY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      },
      {
        text: t("🔗 Link do que editei no vídeo tutorial com vocês:"),
        url: "https://www.canva.com/design/DAGd6eAhavw/LPgHYUerXMP5EmwMJKaemg/edit?utm_content=DAGd6eAhavw&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      },
    ],
  },
];

function VideoSection({ videoData }: { videoData: VideoLessonType }) {
  const [showMore, setShowMore] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (videoContainerRef.current && descriptionRef.current) {
        const videoTop = videoContainerRef.current.getBoundingClientRect().top;
        const descriptionBottom =
          descriptionRef.current.getBoundingClientRect().bottom;
        setIsSticky(videoTop <= 20 && descriptionBottom > window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const highlightLimit = videoData.index === "scpc4bm2z4ahogw" ? 3 : 1;

  return (
    <div
      className={`${videoData.index >= "4buw4f7duhyk0nv" ? "mt-12" : "mt-0"}`}
    >
      <h2 className="text-xl font-semibold mb-4">{videoData.title}</h2>
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div
          ref={videoContainerRef}
          className={`relative w-full lg:w-[50%] bg-gray-200 rounded-lg flex items-center justify-center ${
            isSticky ? "lg:sticky lg:top-5" : ""
          } overflow-hidden`}
        >
          <MuxPlayer
            streamType="on-demand"
            playbackId={videoData.video_id}
            metadataVideoTitle={videoData.title}
            autoPlay={false}
            muted={true}
            loop={false}
            className="w-full h-[350px] rounded-lg"
          />
        </div>
        <div className="w-full lg:w-[50%]" ref={descriptionRef}>
          <h3 className="text-lg font-semibold text-[#10438F]">
            {videoData.subtitle}
          </h3>
          <hr className="border-[#10438F] my-2 w-20" />
          <div className="text-gray-700 text-base leading-relaxed">
            {Array.isArray(videoData.intro) ? (
              videoData.intro.map((intro, index) => (
                <p key={index} className="mb-3">
                  {intro}
                </p>
              ))
            ) : (
              <p>{videoData.intro}</p>
            )}

            <ul className="mt-2 space-y-2">
              {videoData.highlights
                .slice(0, highlightLimit)
                .map((item, index) => (
                  <li key={index}>
                    ✅ <span className="font-semibold">{item.title}</span>{" "}
                    {item.description && `– ${item.description}`}
                  </li>
                ))}
            </ul>

            {!showMore && (
              <button
                onClick={() => setShowMore(true)}
                className="mt-4 text-[#10438F] font-semibold underline"
              >
                {t("Ver mais")}
              </button>
            )}

            {showMore && (
              <>
                <ul className="mt-2 space-y-2">
                  {videoData.highlights
                    .slice(highlightLimit)
                    .map((item, index) => (
                      <li key={index}>
                        ✅ <span className="font-semibold">{item.title}</span>{" "}
                        {item.description && `– ${item.description}`}
                      </li>
                    ))}
                </ul>

                <p className="mt-4">{videoData.moreIntro}</p>
                {videoData.advancedFeatures.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {videoData.advancedFeatures.map((feature, index) => (
                      <li key={index}>
                        ✔️{" "}
                        <span className="font-semibold">{feature.title}</span> –{" "}
                        {feature.description}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-4">{videoData.stepsTitle}</p>
                <ol className="mt-2 space-y-1">
                  {videoData.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
                {videoData.lastTexts &&
                  videoData.lastTexts?.map((text) => {
                    return <p className="mt-4">{text}</p>;
                  })}
                {videoData.downloadLinks && (
                  <p className="mt-4">{videoData.downloadText}</p>
                )}
                {videoData.downloadLinks?.map((link, index) => (
                  <p key={index} className="break-words overflow-hidden mb-5">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-words overflow-hidden"
                    >
                      {link}
                    </a>
                  </p>
                ))}
                {videoData.additionalLinks?.map((link, index) => (
                  <p key={index}>
                    {link.text}{" "}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {link.url}
                    </a>
                  </p>
                ))}

                <button
                  onClick={() => setShowMore(false)}
                  className="mt-4 text-[#10438F] font-semibold underline"
                >
                  {t("Ver Menos")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/recursos/creator/"
)({
  component: Page,
  loader: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login",
      });
    }

    if (userType !== "Influencers") {
      throw redirect({
        to: "/dashboard",
      });
    }

    try {
      const creatorProducts = await pb
        .collection("creator_products")
        .getFullList();
      const creatorProductsData =
        creatorProducts as unknown as CreatorProduct[];

      const userId = pb.authStore.model?.id;
      let purchasedProducts = [] as CreatorProduct[];
      if (userId) {
        purchasedProducts = await pb
          .collection("purchased_creator_products")
          .getFullList({ filter: `creator="${userId}"` });
      }

      return { creatorProducts: creatorProductsData, purchasedProducts };
    } catch (error) {
      console.error("Erro no loader:", error);
      throw new Error(t("Erro ao carregar os produtos"));
    }
  },
  pendingComponent: () => (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  ),
  errorComponent: () => (
    <div className="p-4">
      {t(
        "Aconteceu um erro ao carregar essa página, não se preocupe o erro é do nosso lado e vamos trabalhar para resolve-lo!"
      )}
    </div>
  ),
});

function Page() {
  const [paymentModal, setPaymentModal] = useState(false);
  const [setLoadingPayment] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<CreatorProduct>();

  const [seeVideo, setSeeVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoLessonType>();

  const { creatorProducts, purchasedProducts } = useLoaderData({
    from: Route.id,
  }) as {
    creatorProducts: CreatorProduct[];
    purchasedProducts: any[];
  };

  const getMediaByProductId = (productId: string) =>
    medias.find((m) => m.id === productId);

  const purchasedProductsDetails = purchasedProducts.map((record) => {
    const product = creatorProducts.find(
      (p) => p.id === record.creator_product
    );
    const media = product ? getMediaByProductId(product.id) : null;
    return { ...record, product, media };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {paymentModal && (
        <Modal onClose={() => setPaymentModal(false)}>
          <GatewayPaymentModal
            type="creator_product"
            unit_amount={selectedProduct?.pagseguro_price}
            toast={toast}
            setLoadingPayment={setLoadingPayment}
            product={selectedProduct}
          />
        </Modal>
      )}

      <h1 className="text-2xl font-bold text-left">
        {t("Kit Completo para Sucesso na Creator Economy")}
      </h1>
      <p className="text-left text-gray-700 mb-8 mt-3">
        {t(
          "Adquira aulas, ferramentas e materiais exclusivos para aprimorar suas habilidades, otimizar sua rotina e impulsionar seus resultados como creator!"
        )}
      </p>

      {!seeVideo ? (
        <>
          {/* PRODUTOS COMPRADOS */}
          {purchasedProductsDetails.length > 0 && (
            <div className="pb-10 mb-10 border-b border-gray-400">
              <h2 className="text-2xl font-semibold text-green-600 mb-4">
                Itens Comprados
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {purchasedProductsDetails.map((item) => {
                  if (!item.product || !item.media) return null;
                  const isVideo = item.media.file === "video";
                  return (
                    <div
                      key={item.product.id}
                      className="bg-white border border-green-400 shadow-md rounded-lg overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative">
                        <img
                          src={item.media.image}
                          alt={item.product.stripe_product_name}
                          className="w-full h-60 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold flex-grow mb-2 text-left">
                          {t(item.product.stripe_product_name)}
                        </h3>
                        <div className="mt-auto">
                          {isVideo ? (
                            <button
                              className="w-full bg-blue-500 text-white py-2 rounded-md text-center block hover:bg-blue-600 transition"
                              onClick={() => {
                                const videoData = videoLessons.find(
                                  (video) => video.index === item.product.id
                                );
                                setSelectedVideo(videoData);
                                setSeeVideo(true);
                              }}
                            >
                              Visualizar Aula
                            </button>
                          ) : (
                            <a
                              href={item.media.file}
                              download
                              className="w-full bg-blue-500 text-white py-2 rounded-md text-center block hover:bg-blue-600 transition"
                            >
                              {t("Download")}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {creatorProducts
              .filter(
                (dbProduct) =>
                  !purchasedProducts.find(
                    (record) => record.creator_product === dbProduct.id
                  )
              )
              .map((dbProduct) => {
                const media = medias.find((m) => m.id === dbProduct.id);
                if (!media) return null;

                return (
                  <div
                    key={dbProduct.id}
                    className="bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative">
                      <img
                        src={media.image}
                        alt={dbProduct.stripe_product_name}
                        className="w-full h-60 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold flex-grow mb-2 text-left">
                        {t(dbProduct.stripe_product_name)}
                      </h3>
                      <div className="mt-auto">
                        <button
                          className="w-full bg-orange-500 text-white py-2 rounded-md text-center block hover:bg-orange-600 transition"
                          onClick={() => {
                            console.log(dbProduct);
                            setSelectedProduct(dbProduct);
                            setPaymentModal(true);
                          }}
                        >
                          {`${(dbProduct.pagseguro_price / 100).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}`}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <div>
          <div className="header">
            <p
              className="flex items-center font-semibold space-x-3 cursor-pointer"
              onClick={() => {
                setSeeVideo(false);
              }}
            >
              <CaretLeft /> Voltar
            </p>
          </div>

          <div>
            <VideoSection
              key={selectedVideo?.index}
              videoData={selectedVideo as VideoLessonType}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
