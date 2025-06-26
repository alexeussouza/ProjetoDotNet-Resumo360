import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

interface LoginResponse {
    token: string;
}

const Login = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setCarregando(true);

        try {
            const response = await api.post<LoginResponse>("/auth/login", { email, senha });
            localStorage.setItem("token", response.data.token);
            navigate("/");
        } catch (err: unknown) {
            setErro("Email ou senha inválidos.");
        } finally {
            setCarregando(false);
        }
    };

    return (

        <div className="login-container">
            <h1>💸 Resumo360</h1>
            <p>Simplifique suas finanças. Domine seus números.</p>


            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (erro) setErro("");
                    }}
                    required
                />

                <label>Senha:</label>
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => {
                        setSenha(e.target.value);
                        if (erro) setErro("");
                    }}
                    required
                />

                {erro && <p className="erro">{erro}</p>}

                <button type="submit" disabled={carregando}>
                    {carregando ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
};

export default Login;

