import jsPDF from "jspdf";
import logo from "@/assets/logo.png";

interface ReceiptData {
  campaignName: string;
  creatorName: string;
  totalAmount: number;
  completionDate: string;
}

export const generateReceiptCompletedCreator = (data: ReceiptData) => {
  const doc = new jsPDF();
  const dateObj = new Date(data.completionDate.split("/").reverse().join("-"));
  const formattedMonthYear = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  })
    .format(dateObj)
    .toUpperCase();

  // Fontes e estilos principais
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(0, 61, 121); // azul escuro

  // Cabeçalho
  doc.text("RECIBO", 20, 20);
  doc.setFontSize(12);
  doc.text("CONECTE PUBLI", 145, 20); // topo direito

  // Linha laranja
  doc.setDrawColor(255, 81, 0);
  doc.setLineWidth(1);
  doc.line(20, 25, 190, 25);

  // Nome da campanha
  doc.setFontSize(12);
  doc.setTextColor(0, 61, 121);
  doc.setFont("helvetica", "bold");
  doc.text("Nome da Campanha:", 20, 40);
  doc.setFont("helvetica", "normal");
  doc.text(data.campaignName, 20, 48);

  doc.setFont("helvetica", "bold");
  doc.text(formattedMonthYear, 153, 40); // canto superior direito

  // Tabela
  const startY = 50;
  doc.setDrawColor(0, 61, 121); // azul
  doc.setLineWidth(0.5);
  doc.rect(20, startY, 170, 10); // header
  doc.setFontSize(11);
  doc.text("Descrição", 22, startY + 7);
  doc.text("Total", 175, startY + 7, { align: "right" });

  // Linhas da tabela
  doc.rect(20, startY + 10, 170, 10);
  doc.setFont("helvetica", "normal");
  doc.text("Nome do Creator:", 22, startY + 17);
  doc.setFont("helvetica", "bold");
  doc.text(data.creatorName, 55, startY + 17);

  doc.setFont("helvetica", "normal");
  doc.rect(20, startY + 20, 170, 10);
  doc.text("Data da conclusão do trabalho:", 22, startY + 27);
  doc.setFont("helvetica", "bold");
  doc.text(data.completionDate, 78, startY + 27);

  doc.setFont("helvetica", "normal");
  doc.rect(20, startY + 30, 170, 10);
  doc.text("Valor total pago por Creator", 2e2, startY + 37);
  doc.setFont("helvetica", "bold");
  doc.text(`R$${data.totalAmount.toFixed(2)}`, 178, startY + 37, {
    align: "right",
  });

  // Caixa de subtotal
  doc.setDrawColor(0, 61, 121);
  doc.rect(140, startY + 50, 50, 20);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", 145, startY + 58);
  doc.setFont("helvetica", "bold");
  doc.text(`R$${data.totalAmount.toFixed(2)}`, 145, startY + 67);

  // Logo (simulação — ajuste o caminho correto se usar Vite/webpack)
  doc.addImage(logo, "PNG", 20, 140, 44, 10);

  return doc;
};
