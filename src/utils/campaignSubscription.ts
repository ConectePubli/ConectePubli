import { Campaign } from "@/types/Campaign";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface SubscriptionStatus {
  status: boolean;
  message: string;
}

export const isEnableSubscription = (
  campaign: Campaign
): SubscriptionStatus => {
  // "Agora" no fuso de São Paulo
  const now = dayjs().tz("America/Sao_Paulo");

  // Se sua data vier do PocketBase como string no formato "YYYY-MM-DD HH:mm:ss",
  // dayjs.tz(...) vai interpretar como horário local de São Paulo.
  const subStart = campaign.subscription_start_date
    ? dayjs.tz(campaign.subscription_start_date, "YYYY-MM-DD HH:mm:ss", "America/Sao_Paulo")
    : null;

  const subEnd = campaign.subscription_end_date
    ? dayjs.tz(campaign.subscription_end_date, "YYYY-MM-DD HH:mm:ss", "America/Sao_Paulo")
    : null;

  // Verifica se ainda não iniciou
  if (subStart && now.isBefore(subStart)) {
    return {
      status: false,
      message: "not_started",
    };
  }

  // Se você quer que o 'subEnd' seja até o fim do dia (23:59:59), use .endOf('day')
  // Assim, se no BD estiver 2025-01-18 00:00:00, a inscrição acaba em 18/01 às 23:59:59
  const subEndEndOfDay = subEnd ? subEnd.endOf("day") : null;

  // Verifica se já passou do prazo (depois do fim do dia definido)
  if (subEndEndOfDay && now.isAfter(subEndEndOfDay)) {
    return {
      status: false,
      message: "time_out",
    };
  }

  // Se estiver dentro do período
  return {
    status: true,
    message: "started",
  };
};
