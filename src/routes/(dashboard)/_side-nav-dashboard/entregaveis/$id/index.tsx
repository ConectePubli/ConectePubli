import axios from "axios";
import {
  createFileRoute,
  Link,
  redirect,
  useLoaderData,
} from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { t } from "i18next";
import { ClientResponseError } from "pocketbase";
import { toast, ToastContainer } from "react-toastify";
import { LinkIcon } from "lucide-react";

import BackgroundPlaceholder from "@/assets/background-placeholder.webp";
import ProfilePlaceholder from "@/assets/profile-placeholder.webp";
import GoBack from "@/assets/icons/go-back.svg";
import LocationPin from "@/assets/icons/location-pin.svg";

import { Deliverables } from "@/types/Deliverables";
import SocialNetworks from "@/types/SocialNetworks";

import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

import pb from "@/lib/pb";
import { getUserType } from "@/lib/auth";
import { formatLocation } from "@/utils/formatLocation";
import FormattedText from "@/utils/FormattedText";
import { formatCentsToCurrency } from "@/utils/formatCentsToCurrency";
import GatewayPaymentModal from "@/components/ui/GatewayPaymentModal";
import ModalSendDeliverable from "@/components/ui/ModalSendDeliverable";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/entregaveis/$id/"
)({
  loader: async ({ params: { id } }) => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login",
      });
    }

    try {
      const deliverableData = await pb
        .collection("deliverable_proposals")
        .getOne(id, {
          expand: "brand, influencer",
        });

      console.log(deliverableData);

      return { deliverableData, userTypeData: userType };
    } catch (error) {
      if (error instanceof ClientResponseError) {
        if (error.status === 404) {
          return { error: "not_found" };
        }
      }
      console.error("Error fetching data:", error);
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
    <div className="p-4">
      {t(
        "Aconteceu um erro ao carregar essa página, não se preocupe o erro é do nosso lado e vamos trabalhar para resolve-lo!"
      )}
    </div>
  ),
  notFoundComponent: () => <div>{t("Entregável não encontrado")}</div>,
});

function Page() {
  const navigate = useNavigate();

  const { deliverableData, userTypeData } = useLoaderData({ from: Route.id });

  const deliverable = deliverableData as Deliverables;
  const userType = userTypeData as "Brands" | "Influencers";

  // creator
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false);
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingRefuse, setIsLoadingRefuse] = useState(false);
  const [refuseReason, setRefuseReason] = useState("");
  const [isContractChecked, setIsContractChecked] = useState(false);
  const [proposalStatus, setProposalStatus] = useState<
    "waiting" | "approved" | "completed" | "refused"
  >(deliverable.status);

  // brand
  const [isAcceptBrandModalOpen, setIsAcceptBrandModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [isLoadingSupport, setIsLoadingSupport] = useState(false);

  // payment
  const [paymentModal, setPaymentModal] = useState(false);
  const [setLoadingPayment] = useState<boolean>(false);

  // CREATOR
  const handleAcceptProposal = async () => {
    setIsLoadingAccept(true);
    try {
      await pb.collection("deliverable_proposals").update(deliverable.id, {
        status: "approved",
        contract_checked: true,
      });
      setProposalStatus("approved");
      setIsAcceptModalOpen(false);
    } catch (error) {
      console.error("Erro ao aceitar proposta:", error);
    } finally {
      setIsLoadingAccept(false);
    }
  };

  // CREATOR
  const handleRefuseProposal = async () => {
    setIsLoadingRefuse(true);
    try {
      await pb.collection("deliverable_proposals").update(deliverable.id, {
        status: "refused",
        refused_text: refuseReason,
      });
      setProposalStatus("refused");
      setIsRefuseModalOpen(false);
    } catch (error) {
      console.error("Erro ao recusar proposta:", error);
    } finally {
      setIsLoadingRefuse(false);
    }
  };

  // BRAND
  const handleCompleteCollaboration = async () => {
    setIsLoadingComplete(true);
    try {
      await pb.collection("deliverable_proposals").update(deliverable.id, {
        status: "completed",
      });
      setProposalStatus("completed");
      setIsCompleteModalOpen(false);
    } catch (error) {
      console.error("Erro ao concluir colaboração:", error);
    } finally {
      setIsLoadingComplete(false);
    }
  };

  // BRAND
  const handleSendSupportMessage = async () => {
    setIsLoadingSupport(true);

    try {
      const message = `
        **Detalhes da Marca:**
        - Nome da Marca: ${deliverable.expand.brand?.name || "Não informado"}
        - Email da Marca: ${deliverable.expand.brand.email || "Não informado"}
        - Número de telefone: ${deliverable.expand.brand.cell_phone}
     
        **Detalhes do Entregável:**
        - Nome do creator: ${deliverable.expand.influencer?.name || "Não informado"}
        - Email do creator: ${deliverable.expand.influencer.email || "Não informado"} 
        - Preço Total: ${formatCentsToCurrency(deliverable.total_price)}
        - Descrição do entregável: ${deliverable.description || "Não informado"}   
  
        **Mensagem de suporte:**
        ${supportMessage.trim() || "Nenhuma mensagem adicional."}
      `;

      await axios.post(
        "https://conecte-publi.pockethost.io/api/support_email",
        {
          title: `Solicitação de Suporte - Entregável`,
          email: deliverable.expand.brand?.email || "sem-email@dominio.com",
          message: message,
        }
      );
      setSupportMessage("");
      toast.info(
        "Mensagem enviada com sucesso, responderemos o mais breve possivel"
      );
      setIsSupportModalOpen(false);
    } catch (error) {
      console.error("Erro ao enviar mensagem de suporte:", error);
    } finally {
      setIsLoadingSupport(false);
    }
  };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <div
        className="flex items-center gap-1 self-start"
        onClick={() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            navigate({ to: "/dashboard" });
          }
        }}
      >
        <button className="bg-white p-2 rounded-full">
          <img src={GoBack} alt="Go Back" className="w-5 h-5" />
        </button>
        <button className="text-black/75 font-semibold">{t("Voltar")}</button>
      </div>

      <h2 className="text-2xl font-semibold my-4 text-left">
        {t(
          userType === "Brands"
            ? "Proposta de Entregável para o Creator"
            : "Proposta de Entregável da Marca"
        )}
        :{" "}
        <span className="text-[#10438F]">
          {userType === "Brands"
            ? deliverable.expand.influencer.name
            : deliverable.expand.brand.name}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        <div className="bg-white rounded-lg border p-6 max-sm:p-1">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3">{t("Detalhes")}</h3>
            <p className="text-gray-700 mb-4">
              {FormattedText({ text: deliverable.description, maxLength: 500 })}
            </p>

            <hr />

            <h3 className="text-lg font-semibold mt-3">{t("Entregáveis")}</h3>
            <div className="mb-4">
              {deliverable.reels_qty >= 1 && (
                <div className="flex justify-between mb-2">
                  <span>
                    1 Reels{" "}
                    <span className="text-[#10438F] font-semibold">
                      x {deliverable.reels_qty}
                    </span>
                  </span>
                  <span>
                    {(
                      (deliverable.reels_qty *
                        deliverable.expand.influencer.reels_price) /
                      100
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              )}

              {deliverable.ugc_qty >= 1 && (
                <div className="flex justify-between mb-2">
                  <span>
                    {t("1 Video + UGC Photos Combo")}{" "}
                    <span className="text-[#10438F] font-semibold">
                      x {deliverable.ugc_qty}
                    </span>
                  </span>
                  <span>
                    {(
                      (deliverable.ugc_qty *
                        deliverable.expand.influencer.ugc_price) /
                      100
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              )}

              {deliverable.stories_qty >= 1 && (
                <div className="flex justify-between mb-2">
                  <span>
                    Stories IGC{" "}
                    <span className="text-[#10438F] font-semibold">
                      x {deliverable.stories_qty}
                    </span>
                  </span>
                  <span>
                    {(
                      (deliverable.stories_qty *
                        deliverable.expand.influencer.stories_price) /
                      100
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              )}

              {deliverable.feed_qty >= 1 && (
                <div className="flex justify-between mb-2">
                  <span>
                    {t("Posts no Feed")}{" "}
                    <span className="text-[#10438F] font-semibold">
                      x {deliverable.feed_qty}
                    </span>
                  </span>
                  <span>
                    {(
                      (deliverable.feed_qty *
                        deliverable.expand.influencer.feed_price) /
                      100
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              )}

              {deliverable.combo_ugc_qty >= 1 && (
                <div className="flex justify-between mb-2">
                  <span>
                    {t("Combo UGC")}{" "}
                    <span className="text-[#10438F] font-semibold">
                      x {deliverable.combo_ugc_qty}
                    </span>
                  </span>
                  <span>
                    {(
                      (deliverable.combo_ugc_qty *
                        deliverable.expand.influencer.combo_ugc_price) /
                      100
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              )}

              {deliverable.combo_recommend_qty >= 1 && (
                <div className="flex justify-between mb-2">
                  <span>
                    {t("Combo Recomendo")}{" "}
                    <span className="text-[#10438F] font-semibold">
                      x {deliverable.combo_recommend_qty}
                    </span>
                  </span>
                  <span>
                    {(
                      (deliverable.combo_recommend_qty *
                        deliverable.expand.influencer.combo_recommend_price) /
                      100
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-300 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>
                  {(deliverable.total_price / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap lg:flex-nowrap justify-between items-center mt-6 space-y-3 lg:space-y-0 lg:space-x-4">
            {userType === "Influencers" &&
              (proposalStatus === "waiting" ||
                proposalStatus === "approved" ||
                proposalStatus === "refused") && (
                <>
                  {proposalStatus === "approved" ? (
                    <div
                      className={`flex flex-wrap lg:flex-nowrap justify-between items-center px-4 mt-6 w-full ${deliverable.paid === false ? "flex flex-col" : ""}`}
                    >
                      <button className="bg-green-500 text-white px-4 py-2 rounded font-semibold cursor-default w-full lg:w-auto mb-3 lg:mb-0 lg:flex-1 lg:mr-3">
                        {t("Proposta aceita")}
                      </button>

                      {!deliverable.paid && (
                        <p className="pt-2 text-gray-700">
                          A Marca será comunicada que você aceitou a proposta,
                          aguarde a confirmação para iniciar os Entregáveis.
                        </p>
                      )}

                      {deliverable.paid === true && (
                        <ModalSendDeliverable
                          creatorId={pb.authStore.model?.id}
                          brandId={deliverable.expand.brand.id}
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      {proposalStatus !== "refused" && (
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600 w-full max-sm:w-full"
                          onClick={() => setIsAcceptModalOpen(true)}
                        >
                          {t("Aceitar Proposta")}
                        </button>
                      )}
                    </>
                  )}

                  {proposalStatus === "refused" ? (
                    <div className="w-full flex justify-center">
                      <Button
                        variant={"brown"}
                        className="w-full max-sm:w-full"
                      >
                        {t("Proposta recusada")}
                      </Button>
                    </div>
                  ) : (
                    <>
                      {proposalStatus !== "approved" && (
                        <Button
                          variant={"brown"}
                          className="text-white px-4 py-2 rounded font-semibold w-full max-sm:w-full"
                          onClick={() => setIsRefuseModalOpen(true)}
                        >
                          {t("Recusar Proposta")}
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}

            {userType === "Brands" && (
              <>
                {proposalStatus === "waiting" && (
                  <div className="w-full flex justify-center">
                    <button className="bg-green-500 text-white px-4 py-2 rounded font-semibold cursor-default w-full max-sm:w-full">
                      {t("Aguardando aprovação do Creator")}
                    </button>
                  </div>
                )}

                {proposalStatus === "approved" && !deliverable.paid && (
                  <div className="w-full flex justify-center">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded font-semibold cursor-pointer hover:bg-green-600 w-full max-sm:w-full"
                      onClick={() => {
                        setIsAcceptBrandModalOpen(true);
                      }}
                    >
                      {t("Realizar pagamento")}
                    </button>
                  </div>
                )}

                {proposalStatus === "refused" && (
                  <div className="w-full flex justify-center">
                    <Button variant={"brown"} className="w-full max-sm:w-full">
                      {t("Proposta recusada pelo Creator")}
                    </Button>
                  </div>
                )}

                {proposalStatus === "approved" && deliverable.paid && (
                  <div className="flex flex-wrap lg:flex-nowrap justify-between items-center mt-6 space-y-3 lg:space-y-0 lg:space-x-4 w-full">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600 w-full lg:flex-1"
                      onClick={() => setIsCompleteModalOpen(true)}
                    >
                      {t("Concluir Colaboração")}
                    </button>
                    <Button
                      variant={"brown"}
                      className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600 w-full lg:flex-1"
                      onClick={() => setIsSupportModalOpen(true)}
                    >
                      {t("Suporte")}
                    </Button>
                  </div>
                )}
              </>
            )}

            {proposalStatus === "completed" && (
              <div className="flex justify-center w-full">
                <button className="bg-green-500 text-white px-4 py-2 rounded font-semibold cursor-pointer hover:bg-green-600 w-full max-sm:w-full">
                  {t("Colaboração concluída")}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="bg-white rounded-lg shadow-lg border relative">
            {/* Imagem de Capa */}
            <img
              src={
                deliverable.expand.brand.cover_img
                  ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${deliverable.expand.brand.collectionName}/${deliverable.expand.brand.id}/${deliverable.expand.brand.cover_img}`
                  : BackgroundPlaceholder
              }
              alt="Capa da Marca"
              className="w-full h-28 object-cover rounded-t-lg"
            />

            {/* Imagem de Perfil */}
            <div className="absolute left-16 transform -translate-x-1/2 -translate-y-1/2">
              <img
                src={
                  deliverable.expand.brand.profile_img
                    ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${deliverable.expand.brand.collectionName}/${deliverable.expand.brand.id}/${deliverable.expand.brand.profile_img}`
                    : ProfilePlaceholder
                }
                alt="Perfil da Marca"
                className="w-16 h-16 rounded-full border-4 border-white object-cover cursor-pointer"
                onClick={() =>
                  navigate({
                    to: `/marca/${deliverable.expand.brand.username}`,
                  })
                }
              />
            </div>

            {/* Conteúdo da Marca */}
            <div className="p-4 mt-8">
              {/* Nome da Marca */}
              {deliverable.expand.brand.name && (
                <h2
                  className="font-bold break-words break-all cursor-pointer"
                  onClick={() =>
                    navigate({
                      to: `/marca/${deliverable.expand.brand.username}`,
                    })
                  }
                >
                  {deliverable.expand.brand.name}
                </h2>
              )}

              {/* Localização */}
              {deliverable.expand.brand &&
                formatLocation(deliverable.expand.brand) && (
                  <div className="flex flex-row items-center mt-3">
                    <img
                      src={LocationPin}
                      alt="Localização"
                      className="w-5 h-5 mr-1"
                    />
                    <p
                      className="text-orange-600 font-bold text-md truncate max-w-xs"
                      title={formatLocation(deliverable.expand.brand)}
                    >
                      {formatLocation(deliverable.expand.brand)}
                    </p>
                  </div>
                )}

              {/* Website */}
              {deliverable.expand.brand.web_site && (
                <div className="mt-3 flex flex-row items-center">
                  <LinkIcon className="text-black mr-2" size={16} />
                  <a
                    className="text-[#10438F] font-semibold text-md hover:underline"
                    href={deliverable.expand.brand.web_site}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {deliverable.expand.brand.web_site}
                  </a>
                </div>
              )}

              {/* Bio da Empresa */}
              <p className="text-black mt-3 font-bold">
                {t("Sobre a empresa")}
              </p>
              <p className="text-black text-md mt-2 break-words line-clamp-6">
                {deliverable.expand.brand.bio || "Biografia não informada."}
              </p>

              {/* Redes Sociais */}
              {SocialNetworks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 sm-medium:gap-2">
                  {SocialNetworks.map((network) => {
                    const url = network.url(deliverable.expand.brand);
                    if (!url) return null;

                    return (
                      <a
                        key={network.name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center border border-[#10438F] text-[#10438F] px-2 py-1 text-sm sm-medium:text-base rounded-md font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200 sm-medium:px-3 sm-medium:py-2 sm-medium:text-md"
                      >
                        <img
                          src={network.icon}
                          alt={`Ícone do ${network.name}`}
                          className="w-4 h-4 mr-1 sm-medium:w-5 sm-medium:h-5 sm-medium:mr-2"
                        />
                        {network.name}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isAcceptModalOpen && (
        <Modal onClose={() => setIsAcceptModalOpen(false)}>
          <div className="p-6 max-sm:p-1">
            <h2 className="text-xl font-semibold mb-4">
              {t("Confirme sua participação")}{" "}
            </h2>
            <p className="text-gray-700 mb-6"></p>
            <label className="flex items-center mb-6">
              <input
                type="checkbox"
                className="w-4 h-4 mr-2"
                checked={isContractChecked}
                onChange={(e) => setIsContractChecked(e.target.checked)}
                required
              />
              <span className="text-sm text-gray-700">
                {t("Li e concordo com o ")}{" "}
                <Link
                  to={"/entregaveis/contrato"}
                  target="_blank"
                  className="text-[#10438F] font-semibold hover:underline"
                >
                  {t("Contrato da campanha")}
                </Link>
              </span>
            </label>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsAcceptModalOpen(false)}
              >
                {t("Cancelar")}
              </Button>
              <Button
                variant="orange"
                onClick={handleAcceptProposal}
                disabled={isLoadingAccept || !isContractChecked}
                className="disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed"
              >
                {isLoadingAccept
                  ? t("Aguarde...")
                  : t("Confirmar participação")}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isAcceptBrandModalOpen && (
        <Modal onClose={() => setIsAcceptBrandModalOpen(false)}>
          <div className="p-6 max-sm:p-1">
            <h2 className="text-xl font-semibold mb-4">
              {t(
                "Para continuar o trabalho com o Creator, aceite o contrato abaixo"
              )}
              :{" "}
            </h2>
            <p className="text-gray-700 mb-6"></p>
            <label className="flex items-center mb-6">
              <input
                type="checkbox"
                className="w-4 h-4 mr-2"
                checked={isContractChecked}
                onChange={(e) => setIsContractChecked(e.target.checked)}
                required
              />
              <span className="text-sm text-gray-700">
                {t("Li e concordo com o ")}{" "}
                <Link
                  to={"/entregaveis/contrato"}
                  target="_blank"
                  className="text-[#10438F] font-semibold hover:underline"
                >
                  {t("Contrato da campanha")}
                </Link>
              </span>
            </label>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsAcceptBrandModalOpen(false)}
              >
                {t("Cancelar")}
              </Button>
              <Button
                variant="orange"
                onClick={() => {
                  setIsAcceptBrandModalOpen(false);
                  setPaymentModal(true);
                }}
                disabled={isLoadingAccept || !isContractChecked}
                className="disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed"
              >
                {t("Realizar Pagamento")}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isRefuseModalOpen && (
        <Modal onClose={() => setIsRefuseModalOpen(false)}>
          <div className="p-6 max-sm:p-1">
            <h2 className="text-xl font-bold mb-4">{t("Recusar Proposta")}</h2>
            <p className="text-gray-700 mb-6">
              {t("Por favor, informe o motivo da recusa abaixo.")}
            </p>
            <textarea
              className="w-full border border-gray-400 resize-none rounded-lg p-2 text-gray-700"
              rows={5}
              placeholder={t("Digite aqui o motivo da recusa...")}
              value={refuseReason}
              onChange={(e) => setRefuseReason(e.target.value)}
            />
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsRefuseModalOpen(false)}
              >
                {t("Cancelar")}
              </Button>
              <Button
                variant="brown"
                onClick={handleRefuseProposal}
                disabled={isLoadingRefuse || !refuseReason.trim()}
              >
                {isLoadingRefuse ? t("Aguarde...") : t("Recusar Proposta")}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isCompleteModalOpen && (
        <Modal onClose={() => setIsCompleteModalOpen(false)}>
          <div className="p-6 max-sm:p-1">
            <h2 className="text-xl font-bold mb-4">
              {t("Concluir Colaboração")}
            </h2>
            <p className="text-gray-700 mb-6">
              {t(
                "Tem certeza de que deseja marcar esta colaboração como concluída?"
              )}
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsCompleteModalOpen(false)}
              >
                {t("Cancelar")}
              </Button>
              <Button
                variant={"blue"}
                onClick={handleCompleteCollaboration}
                disabled={isLoadingComplete}
              >
                {isLoadingComplete ? t("Aguarde...") : t("Concluir")}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isSupportModalOpen && (
        <Modal onClose={() => setIsSupportModalOpen(false)}>
          <div className="p-6 max-sm:p-1">
            <h2 className="text-xl font-bold mb-4">{t("Suporte")}</h2>
            <p className="text-gray-700 mb-6">
              {t(
                "Por favor, descreva o problema ou dúvida abaixo para que possamos ajudá-lo."
              )}
            </p>
            <textarea
              className="w-full border border-gray-400 resize-none rounded-lg p-2 text-gray-700"
              rows={5}
              placeholder={t("Digite sua mensagem aqui...")}
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
            />
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsSupportModalOpen(false)}
              >
                {t("Cancelar")}
              </Button>
              <Button
                variant={"blue"}
                onClick={handleSendSupportMessage}
                disabled={isLoadingSupport || !supportMessage.trim()}
              >
                {isLoadingSupport ? t("Aguarde...") : t("Enviar")}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {paymentModal && (
        <Modal onClose={() => setPaymentModal(false)}>
          <GatewayPaymentModal
            type={"deliverable"}
            deliverable={deliverable}
            toast={toast}
            setLoadingPayment={setLoadingPayment}
          />
        </Modal>
      )}

      <ToastContainer />
    </div>
  );
}

export default Page;
