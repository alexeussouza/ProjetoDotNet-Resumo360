import { useEffect, useState } from "react";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import api from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
    const [receitas, setReceitas] = useState(0);
    const [despesas, setDespesas] = useState(0);
    const [saldo, setSaldo] = useState(0);
    const [contasVencidas, setContasVencidas] = useState(0);
    const [contasAVencer, setContasAVencer] = useState(0);

    useEffect(() => {
        const carregarResumo = async () => {
            try {
                type TotalResposta = { total: number };
                type SaldoResposta = { saldo: number };

                const [resReceitas, resDespesas, resSaldo, resVencidas, resAVencer] = await Promise.all([
                    api.get<TotalResposta>("/dashboard/receitas-do-mes"),
                    api.get<TotalResposta>("/dashboard/despesas-do-mes"),
                    api.get<SaldoResposta>("/dashboard/saldo-do-mes"),
                    api.get<TotalResposta>("/dashboard/contas-vencidas"),
                    api.get<TotalResposta>("/dashboard/contas-a-vencer")
                ]);

                setReceitas(resReceitas.data.total || 0);
                setDespesas(resDespesas.data.total || 0);
                setSaldo(resSaldo.data.saldo || 0);
                setContasVencidas(resVencidas.data.total || 0);
                setContasAVencer(resAVencer.data.total || 0);
            } catch (err) {
                console.error("Erro ao carregar dados do dashboard:", err);
            }
        };

        carregarResumo();
    }, []);

    return (
        <AuthenticatedLayout>
            <div className="dashboard-container">
                <h1>Bem-vindo ao painel financeiro 🧮</h1>

                <section className="resumo-mensal">
                    <h2>Resumo do Mês</h2>
                    <ul>
                        <li>Receitas: R$ {receitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</li>
                        <li>Despesas: R$ {despesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</li>
                        <li>Saldo: R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</li>
                    </ul>
                </section>

                <section className="avisos">
                    <h2>Alertas</h2>
                    <p>💡 {contasVencidas} {contasVencidas === 1 ? "conta vencida" : "contas vencidas"}</p>
                    <p>📅 {contasAVencer} vencem nos próximos 5 dias</p>
                </section>

                <section className="graficos">
                    <h2>Gráficos e Relatórios</h2>
                    <p>Para mais detalhes, acesse a aba “Relatórios” 📊</p>

                    
                </section>
            </div>
        </AuthenticatedLayout>
    );
};

export default Dashboard;