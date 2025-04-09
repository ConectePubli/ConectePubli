import { jsPDF } from "jspdf";
import logo from "@/assets/logo.png";

export const generateReceiptBrand = (data: {
  campaignName: string;
  brandName: string;
  jobValue: number;
  conecteFee: number;
  netValue: number;
  paymentDate: string;
}) => {
  const doc = new jsPDF();

  const dateObj = new Date(data.paymentDate.split("/").reverse().join("-"));
  const formattedMonthYear = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  })
    .format(dateObj)
    .toUpperCase();

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
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 61, 121);
  doc.setFontSize(12);
  doc.text("Nome da Campanha:", 20, 40);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(data.campaignName, 140);
  doc.text(lines, 65, 40);

  doc.setFont("helvetica", "bold");
  doc.text(formattedMonthYear, 190, 40, { align: "right" });

  // Tabela
  const startY = 60;
  const rowHeight = 10;
  doc.setDrawColor(0, 61, 121);
  doc.setLineWidth(0.5);

  // Cabeçalho da tabela
  const headers = [
    "Nome da Marca",
    "Valor total do Job",
    "Taxa da Conecte",
    "Valor líquido",
    "Data Pagamento",
  ];

  const colWidths = [40, 35, 30, 35, 30];
  const colStartX = 20;

  let x = colStartX;
  headers.forEach((header, i) => {
    doc.rect(x, startY, colWidths[i], rowHeight, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(header, x + colWidths[i] / 2, startY + 7, { align: "center" });
    x += colWidths[i];
  });

  // Linha de dados
  const y = startY + rowHeight;
  x = colStartX;
  const values = [
    data.brandName,
    `R$${data.jobValue.toFixed(2)}`,
    `${data.conecteFee}%`,
    `R$${data.netValue.toFixed(2)}`,
    data.paymentDate,
  ];

  doc.setFont("helvetica", "normal");
  values.forEach((val, i) => {
    doc.rect(x, y, colWidths[i], rowHeight, "S");
    doc.text(val, x + colWidths[i] / 2, y + 7, { align: "center" });
    x += colWidths[i];
  });

  // Caixa de subtotal
  const subtotalY = y + 20;
  doc.rect(120, subtotalY, 70, 15);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", 125, subtotalY + 10);
  doc.setFont("helvetica", "bold");
  doc.text(`R$${data.netValue.toFixed(2)}`, 185, subtotalY + 10, {
    align: "right",
  });

  // Logo final
  const logoY = subtotalY + 25;
  doc.addImage(logo, "PNG", 20, logoY, 44, 10);

  return doc;
};
