export const getStatusColor = (type: string) => {
  switch (type) {
    case "completed":
      return "#28A745"; // Concluído
    case "approved":
      return "#2881A7"; // Aprovado
    case "waiting":
      return "#FFC107"; // Aguardando
    case "sold_out":
      return "#DC3545"; // Vagas esgotadas
    case "analysing":
      return "#DC3545"; // Bloqueada
    default:
      return "#000000"; // Cor padrão (preto)
  }
};
