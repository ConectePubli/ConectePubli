import { jsPDF } from "jspdf";

export const generateReceiptCompletedCampaign = (data: {
  campaignName: string;
  creators: { name: string; date: string; value: number }[];
  totalAmount: number;
  campaignDate: string;
}) => {
  const doc = new jsPDF();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(0, 61, 121);
  doc.text("RECIBO", 20, 20);
  doc.setFontSize(12);
  doc.text("CONECTE PUBLI", 145, 20);

  doc.setDrawColor(255, 81, 0);
  doc.setLineWidth(1);
  doc.line(20, 25, 190, 25);

  // Nome da campanha
  doc.setFontSize(12);
  doc.setTextColor(0, 61, 121);
  doc.setFont("helvetica", "bold");
  doc.text("Nome da Campanha:", 20, 40);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(data.campaignName, 120);
  doc.text(lines, 20, 48);

  // Mês e ano
  const campaignDate = new Date(data.campaignDate);
  const monthYear = campaignDate
    .toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
  doc.setFont("helvetica", "bold");
  doc.text(monthYear, 190, 40, { align: "right" });

  // Tabela
  const startY = 55;
  const rowHeight = 10;
  const colPositions = {
    name: 22,
    date: 100,
    value: 188,
  };

  doc.setDrawColor(0, 61, 121);
  doc.setLineWidth(0.5);
  doc.rect(20, startY, 170, rowHeight, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Nome dos Creators", colPositions.name, startY + 7);
  doc.text("Data de Finalização", colPositions.date, startY + 7);
  doc.text("Valor por Creator", colPositions.value, startY + 7, {
    align: "right",
  });

  // Linhas da tabela
  let y = startY + rowHeight;
  doc.setFont("helvetica", "normal");
  data.creators.forEach((creator) => {
    doc.rect(20, y, 170, rowHeight, "S");
    doc.text(creator.name, colPositions.name, y + 7);
    doc.text(creator.date, colPositions.date, y + 7);
    doc.text(`R$${creator.value.toFixed(2)}`, colPositions.value, y + 7, {
      align: "right",
    });
    y += rowHeight;
  });

  // Caixa de subtotal
  doc.setDrawColor(0, 61, 121);
  doc.setLineWidth(0.5);
  doc.rect(140, y + 10, 50, 12);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", 145, y + 18);
  doc.setFont("helvetica", "bold");
  doc.text(`R$${data.totalAmount.toFixed(2)}`, 185, y + 18, {
    align: "right",
  });

  // Logo no rodapé (dinâmico)
  const logoY = y + 30;
  doc.addImage("/src/assets/logo.png", "PNG", 20, logoY, 44, 10);

  return doc;
};
