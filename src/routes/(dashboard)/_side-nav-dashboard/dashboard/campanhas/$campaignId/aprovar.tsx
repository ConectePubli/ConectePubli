/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  createFileRoute,
  notFound,
  useLoaderData,
  redirect,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import pb from "@/lib/pb";
import { t } from "i18next";
import { ClientResponseError } from "pocketbase";
import { useNavigate } from "@tanstack/react-router";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { Info, MessageCircle, ThumbsUp, User } from "lucide-react";
import { getStatusColor } from "@/utils/getColorStatusInfluencer";
import { Flag, Headset, MagnifyingGlassPlus, Warning } from "phosphor-react";
import "react-toastify/ReactToastify.css";

import GoBack from "@/assets/icons/go-back.svg";

import { Campaign } from "@/types/Campaign";
import { Niche } from "@/types/Niche";

import { Button } from "@/components/ui/button";
import SupportModal from "@/components/ui/supportModal";
import { Influencer } from "@/types/Influencer";
import ConcludeModalParticipant from "@/components/ui/concludeParticipantModal";
import InfoParticipantModal from "@/components/ui/infoParticipantModal";
import { states } from "@/utils/states";
import ModalCancelCampaign from "@/components/ui/ModalCancelCampaign";
import ChooseParticipantModal from "@/components/ui/chooseParticipantModal";
import RateParticipantModal from "@/components/ui/rateParticipantModal";
import { toast, ToastContainer } from "react-toastify";
import { createOrGetChat } from "@/services/chatService";
import RatePlatformModal from "@/components/ui/RatePlatformModal";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import GatewayPaymentModal from "@/components/ui/GatewayPaymentModal";
import {
  addToCart,
  clearCart,
  getCartItems,
  removeFromCart,
} from "@/services/carCreators";
import CartSidebar from "@/components/ui/cartSidebar";
import { isEnableSubscription } from "@/utils/campaignSubscription";

type LoaderData = {
  campaignData: Campaign | null;
  campaignParticipations: CampaignParticipation[];
  error?: string;
};

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/aprovar"
)({
  loader: async ({ params: { campaignId } }): Promise<LoaderData> => {
    try {
      const currentBrandId = pb.authStore.model?.id;

      if (!currentBrandId) {
        throw redirect({ to: "/login" });
      }

      const campaignData = await pb
        .collection("Campaigns")
        .getFirstListItem<Campaign>(`id="${campaignId}"`);

      if (!campaignData) {
        throw notFound();
      }

      const campaignParticipations = await pb
        .collection("Campaigns_Participations")
        .getFullList<CampaignParticipation>({
          filter: `campaign="${campaignData.id}"`,
          expand: "campaign,influencer",
        });

      if (campaignData.brand !== currentBrandId) {
        throw redirect({ to: "/dashboard" });
      }

      return { campaignData, campaignParticipations };
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        return {
          error: "not_found",
          campaignData: null,
          campaignParticipations: [],
        };
      }
      throw error;
    }
  },
  pendingComponent: () => (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  ),
  component: Page,
  errorComponent: () => (
    <div className="px-4 py-4 h-full min-w-100 flex items-center justify-center text-center">
      {t(
        "Ocorreu um erro ao carregar essa página. Não se preocupe, estamos trabalhando para resolvê-lo!"
      )}
    </div>
  ),
  notFoundComponent: () => <div className="p-10">Campanha não encontrada</div>,
});

function Page() {
  const router = useRouter();

  const { rateConecte } = useSearch({
    from: "/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/aprovar",
  });
  const hasRateParam = rateConecte === true;
  const loaderData = useLoaderData({
    from: Route.id,
  }) as LoaderData;

  const { campaignData, error } = loaderData;
  const [campaignParticipations, setCampaignParticipations] = useState<
    CampaignParticipation[]
  >(loaderData.campaignParticipations);

  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);
  const [showModalMinParticipant, setShowModalMinParticipant] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  const navigate = useNavigate();
  const [selectedParticipation, setSelectedParticipation] =
    useState<CampaignParticipation | null>(null);
  const [modalType, setModalType] = useState<
    | "choose"
    | "conclude"
    | "contactSupport"
    | "viewProposal"
    | "cancelCampaign"
    | "rateParticipant"
    | "ratePlatform"
    | null
  >(null);
  const [hasRatedPlatform, setHasRatedPlatform] = useState(true);

  // shop cart
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartParticipations, setCartParticipations] = useState<
    CampaignParticipation[]
  >([]);

  // Controla se o modal "Escolher Influencer" está aberto ou não
  const [chooseModalOpen, setChooseModalOpen] = useState(false);

  const subscriptionDate = isEnableSubscription(campaignData as Campaign);

  let subscriptionStatusFeedback = "";

  if (!subscriptionDate.status) {
    if (subscriptionDate.message === "not_started") {
      subscriptionStatusFeedback =
        "O período de inscrição para essa campanha ainda não iniciou.";
    } else if (subscriptionDate.message === "time_out") {
      subscriptionStatusFeedback =
        "O período de inscrições para essa campanha foi encerrado.";
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const participations = await pb
          .collection("Campaigns_Participations")
          .getFullList<CampaignParticipation>({
            filter: `campaign="${campaignData?.id || ""}"`,
            expand: "campaign,influencer",
          });
        setCampaignParticipations(participations);

        const localIds = getCartItems(campaignData?.id || "");
        const filtered = participations.filter((p) => localIds.includes(p.id!));
        setCartParticipations(filtered);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!campaignData) return;

    const localIds = getCartItems(campaignData.id || "");
    if (!localIds.length) return;

    let removido = false;

    campaignParticipations.forEach((p) => {
      if (p.status === "approved" && localIds.includes(p.id!)) {
        removeFromCart(campaignData.id, p.id!);
        removido = true;
      }
    });

    if (removido) {
      const novosIds = getCartItems(campaignData.id || "");
      const filtrados = campaignParticipations.filter((p) =>
        novosIds.includes(p.id!)
      );
      setCartParticipations(filtrados);
    }
  }, [campaignParticipations]);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  function handleAddToCart(participationId: string) {
    if (!campaignData) return;
    addToCart(campaignData.id, participationId);
    const newIds = getCartItems(campaignData.id);
    const updatedParticipations = campaignParticipations.filter((p) =>
      newIds.includes(p.id!)
    );
    setCartParticipations(updatedParticipations);

    toast.success(t("Creator foi selecionado"));

    setChooseModalOpen(true);
  }

  function handleRemoveFromCart(participationId: string) {
    if (!campaignData) return;
    removeFromCart(campaignData.id, participationId);
    const localIds = getCartItems(campaignData.id);
    const filtered = campaignParticipations.filter((p) =>
      localIds.includes(p.id!)
    );
    setCartParticipations(filtered);
    toast.info(t("Creator foi removido"));
  }

  function handleClearCart() {
    if (!campaignData) return;
    clearCart(campaignData.id);
    setCartParticipations([]);
    toast.info(t("Todos os creators foram removidos"));
  }

  useEffect(() => {
    const checkRating = async () => {
      const userId = pb.authStore.model?.id;
      if (!userId) return;

      try {
        const hasRating = await pb
          .collection("ratings")
          .getFirstListItem(
            `(from_influencer="${userId}" || from_brand="${userId}") && to_influencer=NULL && to_brand=NULL && campaign="${campaignData?.id}"`
          );

        if (hasRating) {
          setHasRatedPlatform(true);
        }
      } catch (error) {
        if (error instanceof ClientResponseError && error.status === 404) {
          // Nenhum rating encontrado, o usuário nunca avaliou a plataforma
          setHasRatedPlatform(false);
        } else {
          console.error("Erro ao verificar avaliação da plataforma:", error);
          toast.error(
            t("Ocorreu um erro ao verificar sua avaliação da plataforma.")
          );
        }
      }
    };

    if (hasRateParam) {
      checkRating();
    }
  }, [hasRateParam]);

  useEffect(() => {
    if (hasRateParam && !hasRatedPlatform) {
      setModalType("ratePlatform");
    }
  }, [hasRateParam, hasRatedPlatform, campaignParticipations]);

  // State variables for filters
  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterNiche, setFilterNiche] = useState("");
  const [filterState, setFilterState] = useState("");

  // State for niches
  const [niches, setNiches] = useState<Niche[]>([]);

  // chat
  const [loadingChat, setLoadingChat] = useState<boolean>(false);

  const handleStartChat = async (influencerId: string, brandId: string) => {
    setLoadingChat(true);

    try {
      const chat = await createOrGetChat(
        campaignData?.id as string,
        influencerId,
        brandId
      );

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
      toast(t("Não foi possível iniciar o chat"), {
        type: "error",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  async function updateParticipationStatus(
    participationId: string,
    newStatus: string
  ) {
    try {
      await pb.collection("Campaigns_Participations").update(participationId, {
        status: newStatus,
      });

      setCampaignParticipations((prevParticipations) =>
        prevParticipations.map((participation) => {
          if (participation.id === participationId) {
            return {
              ...participation,
              status: newStatus,
            } as CampaignParticipation;
          }
          return participation;
        })
      );
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
      toast(t("Não foi possível atualizar o status"), {
        type: "error",
      });
    }
  }

  useEffect(() => {
    setCampaignParticipations(loaderData.campaignParticipations);
  }, [loaderData.campaignParticipations]);

  useEffect(() => {
    const fetchNiches = async () => {
      try {
        const nichesData = await pb.collection("niches").getFullList();
        setNiches(nichesData as unknown as Niche[]);
      } catch (e) {
        console.error(e);
      }
    };

    fetchNiches();
  }, []);

  const filteredParticipations = campaignParticipations.filter(
    (participation) => {
      const influencer = participation.expand?.influencer;
      if (!influencer) return false;

      // Filter by name
      if (
        searchName &&
        !influencer.name.toLowerCase().includes(searchName.toLowerCase())
      ) {
        return false;
      }

      // Filter by status
      if (filterStatus && participation.status !== filterStatus) {
        return false;
      }

      // Filter by niche
      if (filterNiche) {
        const influencerNiches: string[] =
          (influencer.niche as unknown as string[]) || [];
        const nicheIds = Array.isArray(influencerNiches)
          ? influencerNiches
          : [influencerNiches];

        if (!nicheIds.includes(filterNiche)) {
          return false;
        }
      }

      // Filter by state (locality)
      if (filterState) {
        const influencerLocalities = influencer.state || [];

        console.log(influencerLocalities);
        const localitiesArray = Array.isArray(influencerLocalities)
          ? influencerLocalities
          : [influencerLocalities];

        if (!localitiesArray.includes(filterState)) {
          return false;
        }
      }

      return true;
    }
  );

  // DEFINIR PREÇO DA CAMPANHA
  const approvedParticipationsCount = campaignParticipations.filter(
    (participation) => participation.status === "approved"
  ).length;

  if (error === "not_found" || !campaignData) {
    return <div>{t("Campanha não encontrada")}</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-sm:p-0">
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        campaign={campaignData}
        unitAmount={campaignData?.price}
        token={pb.authStore.token}
        participations={cartParticipations}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {paymentModal && (
        <Modal onClose={() => setPaymentModal(false)}>
          <GatewayPaymentModal
            type="create_campaign"
            campaignData={campaignData}
            approvedParticipationsCount={approvedParticipationsCount}
            toast={toast}
            setLoadingPayment={setLoadingPayment}
          />
        </Modal>
      )}
      {showModalMinParticipant && (
        <Modal onClose={() => setShowModalMinParticipant(false)}>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Warning className="w-5 h-5 mr-1" weight="bold" />{" "}
              {t("Importante")}
            </h2>

            <p className="text-gray-900">
              {t(
                "Antes de prosseguir com o pagamento, aguarde os creators se candidatarem à sua campanha. Assim que os candidatos estiverem disponíveis, você poderá selecioná-los e finalizar o pagamento com o valor correto."
              )}
            </p>

            <p className="text-gray-900">
              {t(
                "Sua campanha já está na vitrine, agora é só esperar os creators certos se inscreverem!"
              )}
            </p>
          </div>
        </Modal>
      )}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <button
            className="bg-white pr-1 rounded-full"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigate({ to: "/dashboard" });
              }
            }}
          >
            <img src={GoBack} alt="Go Back" className="w-5 h-5" />
          </button>
          <button
            className="text-black/75 font-semibold"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigate({ to: "/dashboard" });
              }
            }}
          >
            Voltar
          </button>
        </div>

        <h1 className="text-2xl font-bold">{campaignData.name}</h1>
        <p className="text-gray-600">
          {t("Visualize todos os inscritos dessa campanha.")}
        </p>

        {subscriptionStatusFeedback && (
          <div className="mt-4 bg-red-200 py-2 px-4 rounded-md w-fit flex items-center">
            <Info className="w-4 h-4 min-w-[1rem] mr-2" />
            <span>{subscriptionStatusFeedback}</span>
          </div>
        )}

        {campaignData.status === "ended" && (
          <p className="flex items-center text-red-500 mt-3">
            <Info size={18} color="#e61919" className="mr-1" />{" "}
            {t("Esta campanha terminou, então você pode apenas visualizá-la!")}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-start justify-between mt-4 max-sm:space-y-2">
          <Button
            variant={"blue"}
            onClick={() =>
              navigate({
                to: `/dashboard/campanhas/${campaignData.unique_name}`,
              })
            }
          >
            {t("Visualizar Campanha")}
          </Button>

          <div className="flex flex-col space-y-2 justify-end items-end max-sm:justify-start max-sm:items-start">
            <Button
              variant={"orange"}
              className="font-semibold text-white sm:mt-0 sm:ml-4"
              disabled={loadingPayment}
              onClick={() => {
                setIsCartOpen(true);
              }}
            >
              {loadingPayment ? (
                t("Aguarde...")
              ) : (
                <>{t("Creators selecionados")}</>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          <input
            type="text"
            placeholder={t("Pesquisar pelo nome do influencer")}
            className="w-full border border-gray-300 rounded p-2 md:col-span-4"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          <select
            className="w-full border border-gray-300 rounded p-2 md:col-span-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">{t("Status")}</option>
            <option value="waiting">{t("Pendente")}</option>
            <option value="approved">{t("Em Progresso")}</option>
            <option value="completed">{t("Concluído")}</option>
            <option value="sold_out">{t("Esgotado")}</option>
          </select>

          <select
            className="w-full border border-gray-300 rounded p-2 md:col-span-3"
            value={filterNiche}
            onChange={(e) => setFilterNiche(e.target.value)}
          >
            <option value="">{t("Nicho")}</option>
            {niches.map((niche) => (
              <option key={niche.id} value={niche.id}>
                {niche.niche}
              </option>
            ))}
          </select>

          <select
            className="w-full border border-gray-300 rounded p-2 md:col-span-3"
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          >
            <option value="">{t("Estado")}</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-lg">
            {campaignParticipations.length}{" "}
            <span className="text-base text-gray-700">
              {campaignParticipations.length === 1
                ? t("Inscrito")
                : t("Inscritos")}
            </span>
          </h3>
        </div>

        {campaignParticipations.length === 0 ? (
          <div className="mt-10 w-full flex flex-col items-center justify-center">
            <p className="mb-4 text-center">
              {t(
                "Você só poderá editar esta campanha enquanto não tiverem inscritos"
              )}
            </p>
            <Button
              variant={"blue"}
              onClick={() =>
                navigate({
                  to: `/dashboard/campanhas/${campaignData.id}/editar`,
                })
              }
            >
              {t("Editar Campanha")}
            </Button>
          </div>
        ) : filteredParticipations.length === 0 ? (
          <div className="mt-10 w-full flex flex-col items-center justify-center">
            <p className="mb-4">
              {t("Nenhum resultado para os filtros aplicados.")}
            </p>
            <Button
              onClick={() => {
                setSearchName("");
                setFilterStatus("");
                setFilterNiche("");
                setFilterState("");
              }}
            >
              {t("Limpar Filtros")}
            </Button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {filteredParticipations.map((participation) => {
              const influencer = participation.expand?.influencer;
              if (!influencer) return null;

              const createdAt = new Date(participation.created as Date);
              createdAt.setHours(createdAt.getHours() - 3);

              const dateString = createdAt.toLocaleDateString();
              const timeString = createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              const status = participation.status;
              const proposalText = participation.description || "";
              const isTextLong = proposalText.length > 100;
              const displayedText = isTextLong
                ? proposalText.slice(0, 100) + "..."
                : proposalText;

              return (
                <div
                  key={participation.id}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm flex flex-col gap-4"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex md:border-r border-gray-300 md:pr-2">
                      {influencer.profile_img ? (
                        <img
                          src={pb.files.getUrl(
                            influencer,
                            influencer.profile_img
                          )}
                          alt="Foto do Creator"
                          className="w-16 h-16 min-w-[4rem] rounded-full object-cover mr-2"
                        />
                      ) : (
                        <div className="w-16 h-16 min-w-[4rem] rounded-full object-cover mr-2 flex items-center justify-center bg-gray-300">
                          <User size={20} color="#fff" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm">
                          {dateString} {timeString} / {influencer.state}
                        </p>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {influencer.name}
                        </h3>
                        {cartParticipations.some(
                          (cartItem) => cartItem.id === participation.id
                        ) ? (
                          <>
                            <p
                              className="text-sm mt-1 font-semibold"
                              style={{
                                color: getStatusColor(status),
                              }}
                            >
                              {t("Status: Pagamento pendente")}
                            </p>
                          </>
                        ) : (
                          <p
                            className="text-sm mt-1 font-semibold"
                            style={{
                              color: getStatusColor(status),
                            }}
                          >
                            Status:{" "}
                            {status === "waiting"
                              ? t("Proposta Pendente")
                              : status === "approved"
                                ? t("Trabalho em Progresso")
                                : status === "completed"
                                  ? t("Trabalho Concluído")
                                  : ""}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p
                        className="text-base"
                        style={!displayedText ? { color: "#777" } : {}}
                      >
                        {displayedText || t("Sem texto de proposta")}
                      </p>
                      {isTextLong && (
                        <button
                          className="text-blue-500"
                          onClick={() => {
                            setSelectedParticipation(participation);
                            setModalType("viewProposal");
                          }}
                        >
                          {t("Ver mais")}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:justify-between border-t-2 pt-5 gap-2">
                    <div>
                      {(status === "approved" || status === "completed") &&
                        campaignData.status !== "ended" &&
                        campaignData.paid === true && (
                          <button
                            className="px-4 py-2 text-gray-900 rounded transition flex items-center hover:underline"
                            onClick={() => {
                              handleStartChat(
                                participation.expand?.influencer?.id || "",
                                participation.expand?.campaign?.brand || ""
                              );
                            }}
                          >
                            {loadingChat ? (
                              t("Aguarde...")
                            ) : (
                              <>
                                <MessageCircle size={18} className="mr-1" />
                                {t("Enviar Mensagem")}
                              </>
                            )}
                          </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={"blue"}
                        className="text-base"
                        onClick={() => {
                          setSelectedParticipation(participation);
                          setModalType("viewProposal");
                        }}
                      >
                        <MagnifyingGlassPlus size={19} className="mr-1" />{" "}
                        {t("Visualizar")}
                      </Button>

                      {status === "waiting" &&
                        campaignData.status !== "ended" &&
                        (cartParticipations.some(
                          (cartItem) => cartItem.id === participation.id
                        ) ? (
                          <Button
                            disabled
                            className="cursor-not-allowed px-4 py-2 text-base flex items-center"
                          >
                            <ThumbsUp size={19} className="mr-1" />
                            {t("Selecionado")}
                          </Button>
                        ) : (
                          <Button
                            variant={"blue"}
                            className="px-4 py-2 text-base flex items-center"
                            onClick={() => {
                              handleAddToCart(participation.id!);
                            }}
                          >
                            <ThumbsUp size={19} className="mr-1" />
                            {t("Escolher para a Campanha")}
                          </Button>
                        ))}

                      {status === "approved" && (
                        <>
                          <Button
                            variant={"brown"}
                            className="px-4 py-2 rounded flex items-center text-base"
                            onClick={() => {
                              setSelectedParticipation(participation);
                              setModalType("contactSupport");
                            }}
                          >
                            <Headset size={18} className="mr-1" />
                            {t("Contatar Suporte")}
                          </Button>

                          {campaignData.status !== "ended" && (
                            <button
                              className="px-4 py-2 bg-[#338B13] text-white rounded hover:bg-[#25670d] transition flex items-center"
                              onClick={() => {
                                setSelectedParticipation(participation);
                                setModalType("conclude");
                              }}
                            >
                              <Flag size={18} className="mr-1" />
                              {t("Trabalho concluído")}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Modals */}
      {modalType === "choose" && selectedParticipation && (
        <ChooseParticipantModal
          setModalType={setModalType}
          participant={selectedParticipation.expand?.influencer as Influencer}
          selectedParticipantion={selectedParticipation}
          updateParticipationStatus={updateParticipationStatus}
        />
      )}
      {modalType === "conclude" && selectedParticipation && (
        <ConcludeModalParticipant
          participant={selectedParticipation.expand?.influencer as Influencer}
          selectedParticipation={selectedParticipation}
          setModalType={setModalType}
          updateParticipationStatus={updateParticipationStatus}
        />
      )}
      {modalType === "contactSupport" && selectedParticipation && (
        <SupportModal
          campaignData={campaignData}
          participant={selectedParticipation.expand?.influencer as Influencer}
          setModalType={setModalType}
        />
      )}
      {modalType === "viewProposal" && selectedParticipation && (
        <InfoParticipantModal
          campaignData={campaignData}
          selectedParticipation={selectedParticipation}
          setSelectedParticipation={setSelectedParticipation}
          participant={selectedParticipation.expand?.influencer as Influencer}
          setModalType={setModalType}
          cartParticipations={cartParticipations}
        />
      )}
      {modalType === "cancelCampaign" && (
        <ModalCancelCampaign
          setModalType={setModalType}
          campaignData={campaignData}
        />
      )}
      {modalType === "rateParticipant" && selectedParticipation && (
        <RateParticipantModal
          selectedParticipation={selectedParticipation}
          participant={selectedParticipation.expand?.influencer as Influencer}
          setModalType={setModalType}
        />
      )}
      {modalType === "ratePlatform" && (
        <RatePlatformModal
          setModalType={setModalType}
          campaign={campaignData}
        />
      )}
      {chooseModalOpen && (
        <Modal onClose={() => {}} hideX={true}>
          <div className="flex flex-col p-2 w-full">
            <p>
              {t(
                `Finalize a seleção e efetue o pagamento do creator no topo desta página, clicando no botão: "Creators Selecionados"`
              )}
            </p>

            <div className="mt-4 flex justify-end">
              <Button variant="blue" onClick={() => setChooseModalOpen(false)}>
                {t("OK")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
}
