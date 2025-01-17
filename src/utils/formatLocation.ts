import { Brand } from "@/types/Brand";
import { t } from "i18next";

export const formatLocation = (brand?: Brand): string => {
  if (!brand) {
    return t("Localização não informada");
  }

  const parts = [brand.city, brand.state, brand.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : t("Localização não informada");
};
