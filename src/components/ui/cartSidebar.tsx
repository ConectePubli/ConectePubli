import { CampaignParticipation } from "@/types/Campaign_Participations";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignName: string;
  unitAmount: number;
  token: string;
  participations: CampaignParticipation[];
  onRemoveFromCart: (participationId: string) => void;
  onClearCart: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  campaignId,
  campaignName,
  unitAmount,
  token,
  participations,
  onRemoveFromCart,
  onClearCart,
}: CartSidebarProps) {
  const totalValue = (unitAmount / 100) * participations.length;

  async function handleCheckout() {
    try {
      const body = {
        campaign_id: campaignId,
        campaign_name: `${campaignName}`,
        unit_amount: unitAmount * participations.length,
        campaign_participations: participations.map((p) => p.id),
      };
      const response = await fetch(
        "https://conecte-publi.pockethost.io/api/checkout_campaign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao criar checkout");
      }
      const data = await response.json();
      if (data.link) {
        window.location.href = data.link;
      } else {
        throw new Error("Link de pagamento não encontrado");
      }
    } catch (error) {
      alert("Falha ao finalizar pagamento.");
      console.error(error);
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Creators selecionados</h2>
          <button
            className="text-red-500"
            onClick={() => {
              onClearCart();
              onClose();
            }}
          >
            Limpar Tudo
          </button>
        </div>

        <div className="p-4 flex-1 overflow-auto">
          {participations.map((item) => {
            const influencerName = item.expand?.influencer?.name ?? "Sem nome";
            return (
              <div
                key={item.id}
                className="flex justify-between items-center mb-4"
              >
                <div>
                  <p className="font-semibold">{influencerName}</p>
                </div>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => onRemoveFromCart(item.id!)}
                >
                  Remover
                </button>
              </div>
            );
          })}
          {participations.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              Nenhum creator selecionado
            </p>
          )}
        </div>

        <div className="p-4 border-t">
          <p className="mb-2">
            Total:{" "}
            <strong>
              R${" "}
              {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </strong>
          </p>
          <button
            className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            onClick={handleCheckout}
            disabled={participations.length === 0}
          >
            Finalizar Pagamento
          </button>
        </div>
      </div>
    </>
  );
}
