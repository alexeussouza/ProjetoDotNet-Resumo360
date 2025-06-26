import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Exporta um elemento HTML como PDF usando html2canvas e jsPDF.
 * @param elementoId ID do elemento que será capturado (ex: 'relatorio-graficos')
 * @param nomeArquivo Nome final do arquivo PDF (ex: 'relatorio.pdf')
 */
export async function exportarElementoParaPDF(elementoId: string, nomeArquivo: string = "documento.pdf") {
  const elemento = document.getElementById(elementoId);
  if (!elemento) {
    console.error(`Elemento com ID '${elementoId}' não encontrado.`);
    return;
  }

  const canvas = await html2canvas(elemento);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF();
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(nomeArquivo);
}
export {};