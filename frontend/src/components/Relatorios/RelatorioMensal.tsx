import { exportarElementoParaPDF } from "../../utils/ExportarPDF";
import api from "../../services/api"; // já deve estar no topo do arquivo
import type { RelatorioMensal as RelatorioMensalTipo } from "../../types/RelatorioMensal";
import GraficoLinha from "./GraficoLinha";
import GraficoPizza from "./GraficoPizza";
import html2canvas from "html2canvas";
import "./RelatorioMensal.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

const RelatorioMensal = () => {
    const [dadosLinha, setDadosLinha] = useState<{ mes: string; saldo: number }[]>([]);
    const [dadosPizza, setDadosPizza] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const carregarDados = async () => {
           const { data } = await api.get<RelatorioMensalTipo[]>("/dashboard/resumo-mensal-todos")

            const linha = data.map((item: any) => ({
                mes: new Date(item.mes).toLocaleString("default", { month: "short" }),
                saldo: item.saldo,
            }));

            const pizza = data.reduce((acc: any, item: any) => {
                acc["Receitas"] = (acc["Receitas"] || 0) + item.totalReceitas;
                acc["Despesas"] = (acc["Despesas"] || 0) + item.totalDespesas;
                return acc;
            }, {});

            setDadosLinha(linha);
            setDadosPizza(pizza);
        };

        carregarDados();
    }, []);

    const exportarParaPDF = async () => {
        const elemento = document.getElementById("relatorio-graficos");
        if (!elemento) return;

        // Aguarda um curto tempo para garantir que tudo foi renderizado
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(elemento, {
            scale: 2, // qualidade melhor
            useCORS: true // se usar imagens externas ou fontes
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const margin = 10;
        const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight);
        pdf.save("relatorio-financeiro.pdf");
    };

    return (
        <div className="relatorio-container">
            <h2>📈 Relatório Financeiro Mensal</h2>

            <div id="relatorio-graficos">
                <GraficoLinha titulo="Evolução mensal de receitas" dadosLinha={dadosLinha} />
                <GraficoPizza titulo="Distribuição de categorias" dadosPizza={dadosPizza} />
            </div>
            <button onClick={exportarParaPDF}>📄 Exportar como PDF</button>
            <button className="botao-voltar-dashboard" onClick={() => navigate("/")}>
                ⬅️ Voltar para o Dashboard
            </button>
        </div>
    );
};

export default RelatorioMensal;

