export const formatCentsToCurrency = (cents: number) => {
  const amount = cents / 100;
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};
