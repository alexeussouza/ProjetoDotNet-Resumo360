import { useEffect, useState } from "react";
import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "./Relatorios.css";
import { Pie } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    LinearScale,
    CategoryScale,
    PointElement,
    LineElement
} from "chart.js";

// Registro dos componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Tooltip, Legend);


// Tipagem para a resposta da API
type RelatorioCategoria = {
    categoria: string;
    total: number;
};

type RelatorioSaldo = {
    mes: string;
    saldo: number;
};


const Relatorios = () => {
    const [dadosDespesas, setDadosDespesas] = useState<any>(null);
    const [dadosReceitas, setDadosReceitas] = useState<any>(null);
    const [dadosSaldo, setDadosSaldo] = useState<any>(null);
    const [periodo, setPeriodo] = useState<string>("3m");



    const carregarDespesas = async (periodo: string) => {
        try {
            const res = await api.get<RelatorioCategoria[]>(`/relatorios/despesas-por-categoria?periodo=${periodo}`);

            const labels = res.data.map((item) => item.categoria);
            const valores = res.data.map((item) => item.total);

            setDadosDespesas({
                labels,
                datasets: [
                    {
                        data: valores,
                        backgroundColor: ["#F87171", "#60A5FA", "#34D399", "#FBBF24"],
                    },
                ],
            });
        } catch (err) {
            console.error("Erro ao buscar despesas:", err);
        }
    };

    const carregarReceitas = async (periodo: string) => {
        try {
            const res = await api.get<RelatorioCategoria[]>(`/relatorios/receitas-por-categoria?periodo=${periodo}`);
            const labels = res.data.map((item) => item.categoria);
            const valores = res.data.map((item) => item.total);

            setDadosReceitas({
                labels,
                datasets: [
                    {
                        data: valores,
                        backgroundColor: ["#4ADE80", "#FBBF24", "#60A5FA", "#A78BFA"],
                    },
                ],
            });
        } catch (err) {
            console.error("Erro ao buscar receitas:", err);
        }
    };

    const carregarSaldo = async (periodo: string) => {
        try {
            const res = await api.get<RelatorioSaldo[]>(`/relatorios/saldo-historico?periodo=${periodo}`);
            const labels = res.data.map(item => item.mes);
            const valores = res.data.map(item => item.saldo);

            setDadosSaldo({
                labels,
                datasets: [
                    {
                        label: "Saldo Mensal",
                        data: valores,
                        fill: false,
                        borderColor: "#3B82F6",
                        backgroundColor: "#3B82F6",
                        tension: 0.3
                    }
                ]
            });
        } catch (err) {
            console.error("Erro ao buscar saldo histórico:", err);
        }
    };

    useEffect(() => {
        carregarDespesas(periodo);
        carregarReceitas(periodo);
        carregarSaldo(periodo);
    }, [periodo]);

    return (
        <AuthenticatedLayout>
            <div className="relatorios-container">
                <h2>Relatórios Financeiros</h2>

                <section className="filtros">
                    <label>Período:</label>
                    <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                        <option value="3m">Últimos 3 meses</option>
                        <option value="6m">Últimos 6 meses</option>
                        <option value="1a">Este ano</option>
                        <option value="personalizado">Personalizado</option>
                    </select>

                </section>

                <section className="graficos">
                    <div className="grafico">
                        <h3>Despesas por Categoria</h3>
                        {dadosDespesas ? (
                            <Pie data={dadosDespesas} />
                        ) : (
                            <p>Carregando gráfico...</p>
                        )}
                    </div>

                    <div className="grafico">
                        <h3>Receitas por Categoria</h3>
                        {dadosReceitas ? (
                            <Pie data={dadosReceitas} />
                        ) : (
                            <p>Carregando gráfico...</p>
                        )}
                    </div>

                    <div className="grafico">
                        <h3>Evolução do Saldo</h3>
                        {dadosSaldo ? (
                            <Line data={dadosSaldo} />
                        ) : (
                            <p>Carregando gráfico...</p>
                        )}
                    </div>
                    <div className="relatorio-link" style={{ marginTop: "2rem" }}>
                        <h3>📄 Exportações</h3>
                        <Link to="/relatorios/mensal" style={{ fontSize: "1.1rem", textDecoration: "underline" }}>
                            ➡️ Acessar Relatório Mensal (PDF)
                        </Link>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
};

export default Relatorios;
