import { useEffect, useState } from "react";
import {
  createFileRoute,
  notFound,
  useLoaderData,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import pb from "@/lib/pb";
import { ClientResponseError } from "pocketbase";
import { useNavigate } from "@tanstack/react-router";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { Info, MessageCircle, ThumbsUp, User } from "lucide-react";
import { getStatusColor } from "@/utils/getColorStatusInfluencer";
import { Flag, Headset, MagnifyingGlassPlus } from "phosphor-react";
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
        throw redirect({ to: "/login123new" });
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
  component: Page,
  errorComponent: () => (
    <div>
      Ocorreu um erro ao carregar essa página. Não se preocupe, estamos
      trabalhando para resolvê-lo!
    </div>
  ),
  notFoundComponent: () => <div>Campanha não encontrada</div>,
});

function Page() {
  const router = useRouter();

  const loaderData = useLoaderData({
    from: Route.id,
  }) as LoaderData;

  const { campaignData, error } = loaderData;
  const [campaignParticipations, setCampaignParticipations] = useState<
    CampaignParticipation[]
  >(loaderData.campaignParticipations);

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
    | null
  >(null);

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
      toast("Não foi possível iniciar o chat", {
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
      toast("Não foi possível atualizar o status", {
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

  const approvedParticipations = campaignParticipations.filter(
    (participation) => participation.status !== "waiting"
  );

  const openJobs = Math.max(
    0,
    (campaignData?.open_jobs || 0) - approvedParticipations.length
  );

  if (error === "not_found" || !campaignData) {
    return <div>Campanha não encontrada</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-sm:p-0">
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
          Visualize todos os inscritos dessa campanha.
        </p>

        {campaignData.status === "ended" && (
          <p className="flex items-center text-red-500 mt-3">
            <Info size={18} color="#e61919" className="mr-1" /> Essa campanha
            terminou, então você pode apenas
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4">
          <div className="flex items-center gap-1 mb-4 sm:mb-0">
            <User size={20} color="#222" />
            <span className="text-gray-900">{openJobs} vagas abertas</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {/* {campaignData.status !== "ended" && (
              <Button
                variant="brown"
                className="bg-transparent text-[#942A2A] border-2 border-[#942A2A] hover:text-white"
                onClick={() => setModalType("cancelCampaign")}
              >
                Cancelar Campanha
              </Button>
            )} */}
            <Button
              variant={"blue"}
              onClick={() =>
                navigate({
                  to: `/dashboard/campanhas/${campaignData.unique_name}`,
                })
              }
            >
              Visualizar Campanha
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          <input
            type="text"
            placeholder="Pesquisar pelo nome do influencer"
            className="w-full border border-gray-300 rounded p-2 md:col-span-4"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          <select
            className="w-full border border-gray-300 rounded p-2 md:col-span-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Status</option>
            <option value="waiting">Pendente</option>
            <option value="approved">Em Progresso</option>
            <option value="completed">Concluído</option>
            <option value="sold_out">Esgotado</option>
          </select>

          <select
            className="w-full border border-gray-300 rounded p-2 md:col-span-3"
            value={filterNiche}
            onChange={(e) => setFilterNiche(e.target.value)}
          >
            <option value="">Nicho</option>
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
            <option value="">Estado</option>
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
            {campaignParticipations.length === 1 ? "Inscrito" : "Inscritos"}
          </h3>
        </div>

        {campaignParticipations.length === 0 ? (
          <div className="mt-10 w-full flex flex-col items-center justify-center">
            <p className="mb-4">
              Não há influenciadores inscritos nessa campanha no momento.
            </p>
            <Button
              variant={"blue"}
              onClick={() =>
                navigate({
                  to: `/dashboard/campanhas/${campaignData.id}/editar`,
                })
              }
            >
              Editar Campanha
            </Button>
          </div>
        ) : filteredParticipations.length === 0 ? (
          <div className="mt-10 w-full flex flex-col items-center justify-center">
            <p className="mb-4">Nenhum resultado para os filtros aplicados.</p>
            <Button
              onClick={() => {
                setSearchName("");
                setFilterStatus("");
                setFilterNiche("");
                setFilterState("");
              }}
            >
              Limpar Filtros
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
                        <p
                          className="text-sm mt-1 font-semibold"
                          style={{
                            color: getStatusColor(status),
                          }}
                        >
                          Status:{" "}
                          {status === "waiting"
                            ? "Proposta Pendente"
                            : status === "approved"
                              ? "Trabalho em Progresso"
                              : status === "completed"
                                ? "Trabalho Concluído"
                                : ""}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p
                        className="text-base"
                        style={!displayedText ? { color: "#777" } : {}}
                      >
                        {displayedText || "Sem texto de proposta"}
                      </p>
                      {isTextLong && (
                        <button
                          className="text-blue-500"
                          onClick={() => {
                            setSelectedParticipation(participation);
                            setModalType("viewProposal");
                          }}
                        >
                          Ver mais
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:justify-between border-t-2 pt-5 gap-2">
                    <div>
                      {(status === "approved" || status === "completed") &&
                        campaignData.status !== "ended" && (
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
                              "Aguarde..."
                            ) : (
                              <>
                                <MessageCircle size={18} className="mr-1" />
                                Enviar Mensagem
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
                        Visualizar
                      </Button>

                      {status === "waiting" &&
                        campaignData.status !== "ended" &&
                        openJobs >= 1 && (
                          <Button
                            variant={"blue"}
                            className="px-4 py-2 text-base flex items-center"
                            onClick={() => {
                              setSelectedParticipation(participation);
                              setModalType("choose");
                            }}
                          >
                            <ThumbsUp size={19} className="mr-1" />
                            Escolher para a Campanha
                          </Button>
                        )}

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
                            Contatar Suporte
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
                              Concluir Colaboração
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

      <ToastContainer />
    </div>
  );
}
