import { CampaignParticipation } from "@/types/Campaign_Participations";
import { Button } from "./button";
import { Trash, User, X, XCircle } from "lucide-react";
import { Influencer } from "@/types/Influencer";
import pb from "@/lib/pb";
import { getStatusColor } from "@/utils/getColorStatusInfluencer";
import { useState } from "react";
import GatewayPaymentModal from "./GatewayPaymentModal";
import Modal from "./Modal";
import { Campaign } from "@/types/Campaign";
import { toast } from "react-toastify";

import { t } from "i18next";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  unitAmount: number;
  token: string;
  participations: CampaignParticipation[];
  onRemoveFromCart: (participationId: string) => void;
  onClearCart: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  campaign,
  unitAmount,
  participations,
  onRemoveFromCart,
  onClearCart,
}: CartSidebarProps) {
  const totalValue = (unitAmount / 100) * participations.length;

  const [paymentModal, setPaymentModal] = useState(false);
  const [setLoadingPayment] = useState<boolean>(false);

  function getInfluencerData(item: CampaignParticipation): Influencer | null {
    const influencer = item.expand?.influencer ?? null;
    return influencer as Influencer;
  }

  return (
    <>
      {paymentModal && (
        <Modal onClose={() => setPaymentModal(false)}>
          <GatewayPaymentModal
            type="buy_creators"
            participations={participations}
            unit_amount={unitAmount * participations.length}
            toast={toast}
            campaign={campaign}
            setLoadingPayment={setLoadingPayment}
          />
        </Modal>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        style={{ zIndex: 9999 }}
      >
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">
            {t("Creators Selecionados")}
          </h2>
          <button
            className="flex items-center p-2 rounded-md gap-2 text-red-500 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X size={24} color="#777" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <div className="flex justify-end">
            <button
              className="flex items-center bg-red-100 p-2 rounded-md gap-2 text-red-500 hover:text-red-600 hover:bg-red-200"
              onClick={(e) => {
                e.stopPropagation();
                onClearCart();
                onClose();
              }}
            >
              <Trash size={15} />
              <span className="text-sm">{t("Limpar Tudo")}</span>
            </button>
          </div>

          {participations.map((item) => {
            const influencer = getInfluencerData(item);
            const influencerName = influencer?.name || t("Sem nome");
            const influencerProfileImg = influencer?.profile_img || "";
            const valorPorCreator = unitAmount / 100;

            return (
              <div
                key={item.id}
                className="border rounded-md p-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    {influencerProfileImg ? (
                      <img
                        src={pb.files.getUrl(
                          influencer || {},
                          influencerProfileImg
                        )}
                        alt={influencerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                        <User size={24} color="#fff" />
                      </div>
                    )}
                  </div>

                  <div className="ml-3">
                    <p className="text-base font-semibold">{influencerName}</p>
                    <p
                      className="text-sm"
                      style={{
                        color: getStatusColor(item.status),
                      }}
                    >
                      {t("Pagamento Pendente")}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {t("Valor por creator")}:{" "}
                      <span className="font-semibold">
                        R$
                        {valorPorCreator.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  className="text-gray-500 hover:text-red-500 transition"
                  onClick={(e) => {
                    e.stopPropagation(); // Evita fechar o carrinho ao clicar no botão
                    onRemoveFromCart(item.id!);
                  }}
                >
                  <XCircle size={20} />
                </button>
              </div>
            );
          })}

          {participations.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              {t("Nenhum creator selecionado")}
            </p>
          )}
        </div>

        <div className="p-4 border-t flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-700">
              Total:{" "}
              <strong className="font-semibold">
                R${" "}
                {totalValue.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </strong>
            </p>
          </div>
          <Button
            variant={"blue"}
            className="w-full py-2 text-white rounded disabled:opacity-60"
            onClick={() => {
              onClose();
              setPaymentModal(true);
            }}
            disabled={participations.length === 0}
          >
            {t("Finalizar Pagamento")}
          </Button>
        </div>
      </div>
    </>
  );
}
