import { Link, useLocation } from "react-router-dom";
import "./Menu.css"; // Arquivo de estilos (pode personalizar mais depois)

const Menu = () => {
  const location = useLocation();

  return (
    <nav className="menu-container">
      <ul>
        <li className={location.pathname === "/" ? "ativo" : ""}>
          <Link to="/">Dashboard</Link>
        </li>
        <li className={location.pathname === "/despesas" ? "ativo" : ""}>
          <Link to="/despesas">Contas a Pagar</Link>
        </li>
        <li className={location.pathname === "/receitas" ? "ativo" : ""}>
          <Link to="/receitas">Contas a Receber</Link>
        </li>
        <li className={location.pathname === "/cartoes" ? "ativo" : ""}>
          <Link to="/cartoes">Cartões de Crédito</Link>
        </li>
        <li className={location.pathname === "/relatorios" ? "ativo" : ""}>
          <Link to="/relatorios">Relatórios</Link>
        </li>
        <li>
          <button onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}>Sair</button>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
