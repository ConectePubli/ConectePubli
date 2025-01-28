/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from "lodash.debounce";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Spinner as SpinnerPhosphor } from "phosphor-react";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

import GoldCheckIcon from "@/assets/icons/gold-check.png";
import LocationPin from "@/assets/icons/location-pin.svg";
import Tag from "@/assets/icons/tag.svg";

import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

import { Influencer } from "@/types/Influencer";
import { Deliverables } from "@/types/Deliverables";

import pb from "@/lib/pb";
import { createOrGetChat } from "@/services/chatService";
import { channelIcons } from "@/utils/socialMediasIcons";
import { getSocialLink } from "@/utils/getSocialLink";

const searchSchema = z.object({
  page: z.number().optional(),
  q: z.string().optional(),
});

type SelectedDeliverable = {
  product: string;
  price: number;
  quantity: number;
};

type SelectedCreator = {
  creator: Influencer;
  deliverables: SelectedDeliverable[];
  totalPrice: number;
  description: string;
};

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/vitrine-de-creators/"
)({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => {
    const page = Number(search.page ?? 1);
    const q = search.q ?? "";
    return { page, q };
  },
  loader: async ({ deps: { page, q } }) => {
    const userType = pb.authStore.model?.collectionName;
    if (userType === "Influencers") {
      throw redirect({
        to: "/dashboard-creator",
      });
    }
    const brandId = pb.authStore.model?.id;
    let hasPlan = true;
    try {
      await pb
        .collection("purchased_brand_plans")
        .getFirstListItem(`brand="${brandId}" && active=true`);
    } catch (error) {
      hasPlan = false;
      console.error("Erro ao buscar o plano da marca:", error);
    }
    const perPage = 6;

    let filter = 'name != ""';

    if (q) {
      filter += ` && (full_name ~ "${q}" || name ~ "${q}" || neighborhood ~ "${q}" || city ~ "${q}" || state ~ "${q}" || country ~ "${q}" || account_type ~ "${q}")`;
    }
    const result = await pb
      .collection("Influencers")
      .getList<Influencer>(page, perPage, {
        filter,
        sort: "-top_creator,created",
      });

    return {
      creators: result.items,
      totalPages: result.totalPages,
      page,
      hasPlan,
      q,
    };
  },
  pendingComponent: () => (
    <div className="flex justify-center items-center h-[calc(100vh-66px)] ">
      <Spinner />
    </div>
  ),
  staleTime: Infinity,
  shouldReload: false,
  component: Page,
});

function Page() {
  const { t } = useTranslation();

  const { creators, totalPages, page, hasPlan } = Route.useLoaderData();
  const router = useRouter();

  const [loadingChatId, setLoadingChatId] = useState<string | null>(null);
  const [loadingPage, setLoadingPage] = useState(false);

  const [selectedCreators, setSelectedCreators] = useState<SelectedCreator[]>(
    []
  );
  const [modalCreator, setModalCreator] = useState<SelectedCreator | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);
  const [loadingProposal, setLoadingProposal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSendProposal = async () => {
    if (!modalCreator) return;

    setLoadingProposal(true);

    try {
      let storiesQty = 0;
      let feedQty = 0;
      let reelsQty = 0;
      let ugcQty = 0;
      modalCreator.deliverables.forEach((d) => {
        if (d.product.toLowerCase().includes("stories"))
          storiesQty += d.quantity;
        if (
          d.product.toLowerCase().includes("feed") &&
          !d.product.toLowerCase().includes("reels")
        )
          feedQty += d.quantity;
        if (d.product.toLowerCase().includes("reels")) reelsQty += d.quantity;
        if (d.product.toLowerCase().includes("ugc")) ugcQty += d.quantity;
      });

      const body: Partial<Deliverables> = {
        brand: pb.authStore.model?.id,
        influencer: modalCreator.creator.id,
        status: "waiting",
        total_price: modalCreator.totalPrice,
        description: modalCreator.description,
        paid: false,
      };

      if (storiesQty !== 0) {
        body.stories_qty = storiesQty;
      }
      if (feedQty !== 0) {
        body.feed_qty = feedQty;
      }
      if (reelsQty !== 0) {
        body.reels_qty = reelsQty;
      }
      if (ugcQty !== 0) {
        body.ugc_qty = ugcQty;
      }

      await pb.collection("deliverable_proposals").create(body);
      setShowSuccess(true);

      // remover dados do creators quando enviar a proposta
      setSelectedCreators((prev) =>
        prev.filter((creator) => creator.creator.id !== modalCreator.creator.id)
      );
    } catch (e) {
      console.log(`error create derivelable proposal: ${e}`);
      toast.error("Não foi possível enviar a proposta, tente novamente");
    } finally {
      setLoadingProposal(false);
    }
  };

  const debouncedNavigate = useMemo(
    () =>
      debounce((query: string) => {
        router.navigate({
          // @ts-expect-error - Não sei como corrigir isso
          search: (prev) => ({
            ...prev,
            q: query,
            page: 1,
          }),
        });
      }, 500),
    [router]
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    debouncedNavigate(newValue);
  }

  useEffect(() => {
    setLoadingPage(false);
  }, [page]);

  function setPage(newPage: number) {
    setLoadingPage(true);
    router.navigate({
      // @ts-expect-error - Não sei como corrigir isso
      search: (prev) => ({
        ...prev,
        page: newPage,
      }),
    });
  }

  const handleStartChat = async (influencerId: string, brandId: string) => {
    setLoadingChatId(influencerId);

    try {
      const chat = await createOrGetChat("", influencerId, brandId);

      router.navigate({
        to: "/dashboard/chat/",
        search: {
          campaignId: chat.campaign,
          influencerId: chat.influencer,
          brandId: chat.brand,
        },
      });
    } catch (error) {
      console.error("Erro ao iniciar o chat:", error);
      toast("Não foi possível iniciar o chat", {
        type: "error",
      });
    } finally {
      setLoadingChatId(null);
    }
  };

  if (!hasPlan) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-66px)] bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mb-[66px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {t("Acesso Restrito")}
          </h1>
          <p className="text-gray-600 mb-6">
            {t(
              "Essa funcionalidade está disponível apenas para marcas do plano"
            )}
            <span className="text-[#FF672F] font-bold">{t(" Premium")}</span>
            {t(". Faça o upgrade e aproveite todos os benefícios.")}
          </p>

          <button
            onClick={() => router.navigate({ to: "/premium/marca" })}
            className="bg-[#10438F] text-white px-6 py-3 rounded-lg hover:bg-[#10438F]/90 transition-all font-semibold"
          >
            {t("Ver Planos")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t("Vitrine de Creators")}</h1>
      <p className="mb-4">
        {t(
          "Descubra os creators da nossa plataforma e entre em contato com os que mais se alinham à sua marca."
        )}
      </p>

      <div className="relative z-0 mb-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-black" />
        </div>
        <input
          id="campaignSearch"
          type="text"
          placeholder={t("Pesquisar pelo nome do Creator")}
          onChange={handleSearchChange}
          className="w-full pl-10 p-2 border-black/40 border border-gray-300 rounded-lg"
        />
      </div>

      {creators.length === 0 ? (
        <p className="text-gray-600">{t("Nenhum creator encontrado.")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {creators.map((creator) => {
            const socialLinks = [
              { name: "Instagram", url: creator.instagram_url },
              { name: "YouTube", url: creator.youtube_url },
              { name: "Tiktok", url: creator.tiktok_url },
              { name: "Facebook", url: creator.facebook_url },
              { name: "LinkedIn", url: creator.linkedin_url },
              { name: "Twitter", url: creator.twitter_url },
              { name: "Twitch", url: creator.twitch_url },
              { name: "Pinterest", url: creator.pinterest_url },
              { name: "Kwai", url: creator.kwai_url },
              { name: "YourClub", url: creator.yourclub_url },
            ].filter((link) => link.url);

            const deliverablesData = [
              { product: "1 Reels", price: creator.reels_price },
              {
                product: t("1 Vídeo + Combo de Fotos UGC"),
                price: creator.ugc_price,
              },
              { product: "Stories IGC", price: creator.stories_price },
              { product: t("Post no Feed"), price: creator.feed_price },
            ];

            const creatorSelected = selectedCreators.find(
              (sc) => sc.creator.id === creator.id
            );
            const hasDeliverables = creatorSelected?.deliverables.length;

            return (
              <div
                key={creator.id}
                className="border-[1px] rounded-xl border-black/40 p-4 flex flex-col items-start h-full"
              >
                <div
                  className="flex items-center mb-4 hover:cursor-pointer"
                  onClick={() =>
                    router.navigate({ to: `/creator/${creator.username}` })
                  }
                >
                  {creator.profile_img && (
                    <img
                      src={pb.getFileUrl(creator, creator.profile_img)}
                      alt={creator.full_name}
                      className="w-24 h-24 rounded-full mr-3 object-cover"
                    />
                  )}
                  {!creator.profile_img && (
                    <div className="w-24 h-24 rounded-full mr-3 bg-gray-200">
                      <div className="flex items-center justify-center h-full text-gray-500 font-bold line-clamp-1">
                        {creator.name
                          .split(" ")
                          .map((name: string) => name[0])
                          .join("")}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-row">
                  <h2
                    className="text-lg font-semibold mr-2 hover:cursor-pointer line-clamp-1"
                    onClick={() =>
                      router.navigate({ to: `/creator/${creator.username}` })
                    }
                  >
                    {creator.full_name !== ""
                      ? `${creator.full_name && creator.full_name.length > 25 ? `${creator.full_name.slice(0, 25)}...` : creator.full_name}`
                      : `${creator.name && creator.name.length > 25 ? `${creator.name.slice(0, 20)}...` : creator.name}`}
                  </h2>
                  {creator.top_creator && (
                    <div
                      className={`inline-flex items-center gap-x-1 px-3 py-1 rounded-full font-bold text-xs cursor-default select-none bg-blue-900 text-white`}
                    >
                      <img
                        src={GoldCheckIcon}
                        alt={"Gold Check"}
                        className="w-6 h-6"
                        draggable={false}
                      />
                      Top Creator
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-700 mb-2 flex flex-col">
                  {(creator.account_type && (
                    <p className="flex items-center font-bold text-[#052759] mt-2">
                      <img
                        src={Tag}
                        alt="Tipo de conta"
                        className="w-4 h-4 mr-1"
                      />
                      {creator.account_type}
                    </p>
                  )) || (
                    <p className="flex items-center font-bold text-[#052759] mt-2">
                      <img
                        src={Tag}
                        alt="Tipo de conta"
                        className="w-4 h-4 mr-1"
                      />
                      {t("Não informado")}
                    </p>
                  )}
                  {(creator.city && creator.state && creator.country && (
                    <p className="flex items-center text-[#E34105] mt-2 font-bold">
                      <img
                        src={LocationPin}
                        alt="Localização"
                        className="w-4 h-4 mr-1"
                      />
                      {creator.city}, {creator.state}, {creator.country}
                    </p>
                  )) || (
                    <p className="flex items-center text-[#E34105] mt-2 font-bold">
                      <img
                        src={LocationPin}
                        alt="Localização"
                        className="w-4 h-4 mr-1"
                      />
                      {t("Localização não informada")}
                    </p>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[60px]">
                  {creator.bio || t("Biografia não informada.")}
                </p>

                {deliverablesData.map((item) => {
                  const creatorInState = selectedCreators.find(
                    (sc) => sc.creator.id === creator.id
                  );
                  const deliverableInState = creatorInState?.deliverables.find(
                    (d) => d.product === item.product
                  );

                  return (
                    <div key={item.product} className="flex flex-col mb-2">
                      <label className="inline-flex items-center">
                        {item.price > 0 && (
                          <input
                            type="checkbox"
                            checked={!!deliverableInState}
                            onChange={() => {
                              setSelectedCreators((prev: any) => {
                                const exists = prev.find(
                                  (sc: { creator: Influencer }) =>
                                    sc.creator.id === creator.id
                                );
                                if (!exists) {
                                  const newDeliverables = [
                                    {
                                      product: item.product,
                                      price: item.price,
                                      quantity: 1,
                                    },
                                  ];
                                  const total = newDeliverables.reduce(
                                    (acc, d) => acc + d.price * d.quantity,
                                    0
                                  );
                                  return [
                                    ...prev,
                                    {
                                      creator: creator,
                                      deliverables: newDeliverables,
                                      totalPrice: total,
                                    },
                                  ];
                                }
                                return prev.map(
                                  (sc: {
                                    creator: Influencer;
                                    deliverables: SelectedDeliverable[];
                                  }) => {
                                    if (sc.creator.id === creator.id) {
                                      const alreadySelected =
                                        sc.deliverables.find(
                                          (d) => d.product === item.product
                                        );
                                      let newDeliverables;
                                      if (alreadySelected) {
                                        newDeliverables =
                                          sc.deliverables.filter(
                                            (d) => d.product !== item.product
                                          );
                                      } else {
                                        newDeliverables = [
                                          ...sc.deliverables,
                                          {
                                            product: item.product,
                                            price: item.price,
                                            quantity: 1,
                                          },
                                        ];
                                      }
                                      const total = newDeliverables.reduce(
                                        (acc, d) => acc + d.price * d.quantity,
                                        0
                                      );
                                      return {
                                        ...sc,
                                        deliverables: newDeliverables,
                                        totalPrice: total,
                                      };
                                    }
                                    return sc;
                                  }
                                );
                              });
                            }}
                            className="h-4 w-4"
                          />
                        )}
                        <span className="ml-2 text-sm">
                          <strong>{item.product}:</strong>{" "}
                          {(item.price / 100).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </label>

                      {deliverableInState && (
                        <input
                          type="number"
                          value={deliverableInState.quantity}
                          onChange={(e) => {
                            setSelectedCreators((prev) => {
                              return prev.map((sc) => {
                                if (sc.creator.id === creator.id) {
                                  const newDeliverables = sc.deliverables.map(
                                    (d) => {
                                      if (d.product === item.product) {
                                        return {
                                          ...d,
                                          quantity: parseInt(
                                            e.target.value,
                                            10
                                          ),
                                        };
                                      }
                                      return d;
                                    }
                                  );
                                  const total = newDeliverables.reduce(
                                    (acc, d) => acc + d.price * d.quantity,
                                    0
                                  );
                                  return {
                                    ...sc,
                                    deliverables: newDeliverables,
                                    totalPrice: total,
                                  };
                                }
                                return sc;
                              });
                            });
                          }}
                          className="mt-1 w-16 border border-gray-300 rounded px-2 py-1 text-center appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      )}
                    </div>
                  );
                })}

                <div className="flex flex-wrap space-x-2 mb-4">
                  {socialLinks.length > 0 ? (
                    socialLinks.map((link) => {
                      const Icon =
                        channelIcons[link.name as keyof typeof channelIcons];
                      const processedLink = getSocialLink(link.name, link.url);

                      // Se o link processado for válido, renderize o link
                      if (processedLink) {
                        return (
                          <a
                            key={link.name}
                            href={processedLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <img
                              src={Icon}
                              className="w-5 h-5"
                              alt={link.name}
                            />
                          </a>
                        );
                      }

                      // Se o link não for válido, não renderize nada
                      return null;
                    })
                  ) : (
                    <p className="text-gray-600 min-h-[20px]"></p>
                  )}
                </div>

                <div className="flex items-center justify-between w-full">
                  <button
                    className="bg-[#FF672F] text-white px-4 py-2 rounded hover:bg-[#FF672F]/90 font-bold mt-auto disabled:cursor-not-allowed"
                    onClick={() =>
                      handleStartChat(creator.id, pb.authStore.model?.id)
                    }
                    disabled={
                      loadingChatId === creator.id ||
                      creator.id === pb.authStore.model?.id ||
                      loadingChatId !== null
                    }
                  >
                    {loadingChatId === creator.id ? (
                      <SpinnerPhosphor className="animate-spin w-6 h-6" />
                    ) : (
                      t("Enviar mensagem")
                    )}
                  </button>

                  {hasDeliverables ? (
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded font-bold mt-2 disabled:cursor-not-allowed"
                      disabled={!hasDeliverables}
                      onClick={() => {
                        const emptyQty = creatorSelected.deliverables.some(
                          (d) => !d.quantity || d.quantity < 1
                        );
                        if (emptyQty) {
                          toast.warning("A quantidade deve ser preenchida");
                          return;
                        }
                        setModalCreator(creatorSelected);
                        setShowSuccess(false);
                        setOpenModal(true);
                      }}
                    >
                      Continuar
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 items-center">
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1 || loadingPage}
            className="px-4 py-2 rounded disabled:opacity-50 bg-[#093474] text-white font-semibold w-24 flex justify-center items-center"
          >
            {loadingPage ? (
              <SpinnerPhosphor className="animate-spin w-6 h-6" />
            ) : (
              t("Anterior")
            )}
          </button>
          <span className="text-gray-600">
            {t("Página")} <span className="font-bold">{page}</span>
            {t(" de")} <span className="font-bold">{totalPages}</span>
          </span>
          <button
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages || loadingPage}
            className="px-4 py-2  rounded disabled:opacity-50 bg-[disabled:opacity-50] bg-[#093474] text-white font-semibold w-24 flex justify-center items-center"
          >
            {loadingPage ? (
              <SpinnerPhosphor className="animate-spin w-6 h-6" />
            ) : (
              t("Próxima")
            )}
          </button>
        </div>
      )}

      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          {!showSuccess && modalCreator && (
            <div className="p-4 w-full">
              <h2 className="text-xl font-bold mb-4">
                {t("Enviar Proposta de Entregável para")}{" "}
                <span className="text-[#10438F]">
                  {modalCreator.creator.name &&
                  modalCreator.creator.name.length > 25
                    ? `${modalCreator.creator.name.slice(0, 25)}...`
                    : modalCreator.creator.name}
                </span>
              </h2>
              <p className="font-semibold mb-2">
                {t(
                  "Envie propostas diretamente para os creators que você deseja!"
                )}
              </p>
              <p className="font-semibold mb-2">
                {t(
                  "Na vitrine de Creators da Conecte Publi, você pode navegar pelos perfis e selecionar aquele que melhor se conecta com a sua marca. Envie uma proposta exclusiva para um Creator específico e garanta uma parceria personalizada e assertiva."
                )}
              </p>
              <div className="mb-4">
                {modalCreator.deliverables.map((d) => (
                  <div key={d.product} className="flex justify-between mb-2">
                    <span>
                      {d.product}{" "}
                      <span className="text-[#10438F] font-semibold">
                        x {d.quantity}
                      </span>
                    </span>
                    <span>
                      {((d.quantity * d.price) / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-300 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    {(modalCreator.totalPrice / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-base font-semibold text-gray-700 mb-1"
                >
                  {t("Detalhes da Proposta de Entregável")}*
                </label>
                <p className="text-sm text-gray-700 mb-2">
                  {t(
                    "Informe ao Creator exatamente o que você espera deste entregável. Quanto mais claro e específico for, melhor será o resultado!"
                  )}
                </p>
                <textarea
                  id="description"
                  rows={4}
                  placeholder={t("Descreva aqui")}
                  className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  onChange={(e) => {
                    setModalCreator({
                      ...modalCreator,
                      description: e.target.value,
                    });
                  }}
                ></textarea>
              </div>
              <button
                onClick={() => {
                  if (!loadingProposal) {
                    handleSendProposal();
                  }
                }}
                disabled={!modalCreator.description}
                className="bg-[#FF672F] text-white px-4 py-2 rounded hover:bg-[#FF672F]/90 font-bold disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-white"
                value={modalCreator.description}
              >
                {loadingProposal ? t("Enviando...") : t("Enviar Proposta")}
              </button>
            </div>
          )}

          {showSuccess && (
            <div className="p-4 text-left w-full">
              <h2 className="text-xl font-bold mb-4">
                🎉 {t("Proposta Enviada com Sucesso")}!
              </h2>
              <p className="mb-4">
                {t(
                  "Agora é só aguardar a aprovação. Assim que o Creator avaliar e aceitar, você será notificado para dar sequência. Enquanto isso, qualquer dúvida ou ajuste, estamos aqui para ajudar."
                )}{" "}
                🚀
              </p>
              <p className="text-sm text-gray-700 mb-4">
                {t("Equipe")} Conecte Publi
              </p>
              <div className="flex justify-center">
                <Button
                  variant={"orange"}
                  onClick={() => {
                    setOpenModal(false);
                  }}
                  className=" text-white px-4 py-2 rounded font-bold"
                >
                  {t("Voltar para a Vitrine")}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
