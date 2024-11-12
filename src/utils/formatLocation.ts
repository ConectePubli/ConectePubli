import { Brand } from "@/types/Brand";

export const formatLocation = (brand?: Brand): string => {
  if (!brand) {
    return "Localização não informada";
  }

  const parts = [brand.city, brand.state, brand.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Localização não informada";
};
