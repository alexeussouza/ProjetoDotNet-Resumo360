import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard"; // Página protegida
import Despesas from "../pages/Despesas";
import Receitas from "../pages/Receitas";
import Cartoes from "../pages/Cartoes";
import Relatorios from "../components/Relatorios/Relatorios";
import RelatorioMensal from "../components/Relatorios/RelatorioMensal";

// Componente de rota protegida: verifica se há token antes de liberar o acesso
const PrivateRoute = () => {
    const token = localStorage.getItem("token");
    // Se houver token, renderiza a rota protegida; caso contrário, redireciona para login
    return token ? <Outlet/> : <Navigate to="/login" />;
};

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Rota pública acessível sem autenticação */}
                <Route path="/login" element={<Login />} />

                {/* Rota protegida: só acessível com token JWT */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/despesas" element={<Despesas />} />
                    <Route path="/receitas" element={<Receitas />} />
                    <Route path="/cartoes" element={<Cartoes />} />
                    <Route path="/relatorios" element={<Relatorios />} />
                    <Route path="/relatorios/mensal" element={<RelatorioMensal />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;

