import { t } from "i18next";

// utils/timeAgo.ts
export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    ano: 31536000,
    mês: 2592000,
    semana: 604800,
    dia: 86400,
    hora: 3600,
    minuto: 60,
    segundo: 1,
  };

  for (const interval in intervals) {
    const intervalSeconds = intervals[interval];
    const count = Math.floor(seconds / intervalSeconds);
    if (count >= 1) {
      return count === 1
        ? `${count} ${t(interval)}`
        : `${count} ${t(interval)}s`;
    }
  }

  return t("agora mesmo");
}
