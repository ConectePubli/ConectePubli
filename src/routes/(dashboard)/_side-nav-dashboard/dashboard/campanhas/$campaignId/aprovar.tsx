import { useState } from "react";
import {
  createFileRoute,
  notFound,
  useLoaderData,
  redirect,
} from "@tanstack/react-router";
import pb from "@/lib/pb";
import { ClientResponseError } from "pocketbase";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Campaign } from "@/types/Campaign";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import GoBack from "@/assets/icons/go-back.svg";
import { User } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { getStatusColor } from "@/utils/getColorStatusInfluencer";

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

      const currentBrandId = pb.authStore.model?.id;
      if (!currentBrandId) {
        throw redirect({ to: "/login" });
      }

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
  const loaderData = useLoaderData({
    from: Route.id,
  }) as LoaderData;

  const { campaignData, campaignParticipations, error } = loaderData;

  const navigate = useNavigate();
  const [selectedParticipation, setSelectedParticipation] =
    useState<CampaignParticipation | null>(null);
  const [modalType, setModalType] = useState<
    "choose" | "conclude" | "contactSupport" | "viewProposal" | null
  >(null);

  if (error === "not_found" || !campaignData) {
    return <div>Campanha não encontrada</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
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

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <User size={20} color="#222" />
            <span className="text-gray-900">
              {campaignData.open_jobs} vagas abertas
            </span>
          </div>
          <div className="flex gap-4">
            <Button variant="destructive">Cancelar Campanha</Button>
            <Button
              onClick={() => navigate({ to: `/dashboard/campanhas/${campaignData.unique_name}` })}
            >
              Visualizar Campanha
            </Button>
          </div>
        </div>

        {campaignParticipations.length === 0 ? (
          <div className="mt-6">
            <p>Nenhuma proposta recebida ainda.</p>
            <Button
              onClick={() =>
                navigate({ to: `/campanhas/${campaignData.id}/editar` })
              }
            >
              Editar Campanha
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-6 flex gap-4">
              <input
                type="text"
                placeholder="Pesquisar pelo nome do influencer"
                className="w-full border border-gray-300 rounded p-2"
              />
              <select className="border border-gray-300 rounded p-2">
                <option>Status</option>
                <option>Pendente</option>
                <option>Em Progresso</option>
                <option>Concluído</option>
              </select>
              <select className="border border-gray-300 rounded p-2">
                <option>Nicho</option>
                <option>Saúde</option>
                <option>Moda</option>
              </select>
              <select className="border border-gray-300 rounded p-2">
                <option>Estado</option>
                <option>SP</option>
                <option>MG</option>
              </select>
            </div>

            <div className="mt-6">
              {campaignParticipations.map((participation) => {
                const influencer = participation.expand?.influencer;
                if (!influencer) return null;

                const status = participation.status;
                const proposalText = influencer.bio || "";
                const isTextLong = proposalText.length > 100;
                const displayedText = isTextLong
                  ? proposalText.slice(0, 100) + "..."
                  : proposalText;

                return (
                  <div
                    key={participation.id}
                    className="border border-gray-300 rounded-lg p-4 shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div className="flex gap-4 flex-grow">
                      <div className="flex border-r border-gray-300 pr-2">
                        <img
                          src={pb.files.getUrl(
                            influencer,
                            influencer.profile_img
                          )}
                          alt="Foto do Influenciador"
                          className="w-16 h-16 rounded-full object-cover mr-2"
                        />
                        <div>
                          <p className="text-sm">
                            {new Date(influencer.created).toLocaleDateString()}{" "}
                            / {influencer.state}
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
                        <p className="text-base">{displayedText}</p>
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

                    <div className="flex flex-col sm:flex-row items-center sm:items-end sm:gap-2 border-t-2 pt-5">
                      <div className="flex w-full justify-between">
                        <div>
                          {(status === "approved" ||
                            status === "completed") && (
                            <button
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                              onClick={() => {
                                // Navigate to chat
                              }}
                            >
                              Enviar Mensagem
                            </button>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                            onClick={() => {
                              setSelectedParticipation(participation);
                              setModalType("viewProposal");
                            }}
                          >
                            Visualizar
                          </button>

                          {status === "waiting" && (
                            <button
                              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                              onClick={() => {
                                setSelectedParticipation(participation);
                                setModalType("choose");
                              }}
                            >
                              Escolher para a Campanha
                            </button>
                          )}

                          {status === "approved" && (
                            <>
                              <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                onClick={() => {
                                  setSelectedParticipation(participation);
                                  setModalType("contactSupport");
                                }}
                              >
                                Contatar Suporte
                              </button>
                              <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                onClick={() => {
                                  setSelectedParticipation(participation);
                                  setModalType("conclude");
                                }}
                              >
                                Concluir Colaboração
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {modalType === "choose" && selectedParticipation && (
        <Modal onClose={() => setModalType(null)}>
          <h2>Confirmar Escolha</h2>
          <p>
            Você deseja escolher {selectedParticipation.expand?.influencer.name}{" "}
            para a campanha?
          </p>
          <button
            onClick={async () => {
              await pb
                .collection("Campaigns_Participations")
                .update(selectedParticipation.id, { status: "approved" });
              setModalType(null);
            }}
          >
            Confirmar
          </button>
          <button onClick={() => setModalType(null)}>Cancelar</button>
        </Modal>
      )}

      {modalType === "conclude" && selectedParticipation && (
        <Modal onClose={() => setModalType(null)}>
          <h2>Concluir Colaboração</h2>
          <p>
            Você confirma que {selectedParticipation.expand?.influencer.name}{" "}
            concluiu o trabalho?
          </p>
          <button
            onClick={async () => {
              await pb
                .collection("Campaigns_Participations")
                .update(selectedParticipation.id, { status: "completed" });
              await pb.collection("Notifications").create({
                type: "payment_request",
                participationId: selectedParticipation.id,
              });
              setModalType(null);
            }}
          >
            Confirmar
          </button>
          <button onClick={() => setModalType(null)}>Cancelar</button>
        </Modal>
      )}

      {modalType === "contactSupport" && selectedParticipation && (
        <Modal onClose={() => setModalType(null)}>
          <h2>Contatar Suporte</h2>
          <p>Descreva o problema que está ocorrendo.</p>
          <textarea
            id="supportMessage"
            className="w-full h-32 border border-gray-300 rounded p-2"
          ></textarea>
          <button
            onClick={async () => {
              const message = (
                document.getElementById("supportMessage") as HTMLTextAreaElement
              ).value;
              await pb.collection("SupportRequests").create({
                participationId: selectedParticipation.id,
                message: message,
              });
              setModalType(null);
            }}
          >
            Enviar
          </button>
          <button onClick={() => setModalType(null)}>Cancelar</button>
        </Modal>
      )}

      {modalType === "viewProposal" && selectedParticipation && (
        <Modal onClose={() => setModalType(null)}>
          <h2>Proposta de {selectedParticipation.expand?.influencer.name}</h2>
          <p>{selectedParticipation.proposal_text}</p>
          <button onClick={() => setModalType(null)}>Fechar</button>
        </Modal>
      )}
    </div>
  );
}
