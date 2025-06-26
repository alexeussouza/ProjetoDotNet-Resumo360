import { ReactNode } from "react";
import Menu from "../components/Menu";
import "./AuthenticatedLayout.css";

interface Props {
  children: ReactNode;
}

const AuthenticatedLayout = ({ children }: Props) => {
  return (
    <div className="layout-container">
      <Menu />
      <main className="layout-content">{children}</main>
    </div>
  );
};

export default AuthenticatedLayout;
