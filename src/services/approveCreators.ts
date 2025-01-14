import axios, { AxiosResponse } from "axios";
import pb from "@/lib/pb";
import { toast, ToastOptions } from "react-toastify";

interface PaymentResponsePagseguro {
  link?: string;
  // Adicione outros campos conforme necessário
}

interface PaymentResponseStripe {
  url?: string;
  // Adicione outros campos conforme necessário
}

interface PaymentBody {
  campaign_id: string;
  campaign_name: string;
  unit_amount: number;
  campaign_participations: string[];
}

export const paymentCreatorsByPagseguro = async (
  campaignId: string,
  campaignName: string,
  unit_amount: number,
  campaign_participations: string[],
  toastOptions?: ToastOptions
): Promise<void> => {
  try {
    const body: PaymentBody = {
      campaign_id: campaignId,
      campaign_name: campaignName,
      unit_amount: unit_amount,
      campaign_participations: campaign_participations,
    };
    console.log(body);

    const response: AxiosResponse<PaymentResponsePagseguro> = await axios.post(
      "https://conecte-publi.pockethost.io/api/checkout_campaign",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      }
    );

    if (response.data.link) {
      window.location.href = response.data.link;
    } else {
      throw new Error("Link de pagamento não encontrado");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erro ao criar checkout com PagSeguro:",
        error.response?.data || error.message
      );
    } else {
      console.error("Erro ao criar checkout com PagSeguro:", error);
    }
    toast.error("Falha ao finalizar pagamento.", toastOptions);
  }
};

export const paymentCreatorsByStripe = async (
  campaignId: string,
  campaignName: string,
  unit_amount: number,
  campaign_participations: string[],
  toastOptions?: ToastOptions
): Promise<void> => {
  try {
    const body: PaymentBody = {
      campaign_id: campaignId,
      campaign_name: campaignName,
      unit_amount: unit_amount,
      campaign_participations: campaign_participations,
    };

    const response: AxiosResponse<PaymentResponseStripe> = await axios.post(
      "https://conecte-publi.pockethost.io/api/stripe/checkout_campaign",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      }
    );

    if (response.data.url) {
      window.location.href = response.data.url;
    } else {
      throw new Error("Link de pagamento não encontrado");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erro ao criar checkout com Stripe:",
        error.response?.data || error.message
      );
    } else {
      console.error("Erro ao criar checkout com Stripe:", error);
    }
    toast.error("Falha ao finalizar pagamento.", toastOptions);
  }
};
