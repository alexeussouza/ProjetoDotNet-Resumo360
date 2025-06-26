// src/pages/Receitas.tsx

import { useEffect, useState } from "react";
import api from "../services/api";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import "./Receitas.css";

interface Receita {
  id: string;
  descricao: string;
  valor: number;
  dataRecebimento: string;
  categoria: string;
  status: "Pendente" | "Recebida";
  recorrente: boolean;
}


const Receitas = () => {
  const [receitas, setReceitas] = useState<Receita[]>([]);

  const [novaReceita, setNovaReceita] = useState<Partial<Receita>>({
    descricao: "",
    valor: 0,
    dataRecebimento: "",
    categoria: "",
    status: "Pendente",
    recorrente: false,
  });

  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEditando, setIdEditando] = useState<string | null>(null);

  useEffect(() => {
    carregarReceitas();
  }, []);

  const carregarReceitas = async () => {
    try {
      const response = await api.get<Receita[]>("/receitas");
      setReceitas(response.data);
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...novaReceita,
      dataRecebimento: new Date(novaReceita.dataRecebimento!).toISOString()
    };

    if (modoEdicao && idEditando) {
      payload.id = idEditando;
    }

    try {
      if (modoEdicao && idEditando) {
        await api.put(`/receitas/${idEditando}`, payload);
      } else {
        await api.post("/receitas", payload);
      }

      setNovaReceita({
        descricao: "",
        valor: 0,
        dataRecebimento: "",
        categoria: "",
        status: "Pendente",
        recorrente: false,
      });
      setModoEdicao(false);
      setIdEditando(null);
      carregarReceitas();
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
    }
  };

  const editarReceita = (receita: Receita) => {
    setModoEdicao(true);
    setIdEditando(receita.id);
    setNovaReceita({
      descricao: receita.descricao,
      valor: receita.valor,
      dataRecebimento: receita.dataRecebimento.split("T")[0],
      categoria: receita.categoria,
      status: receita.status,
      recorrente: receita.recorrente,
    });
  };

  const excluirReceita = async (id: string) => {
    const confirmar = window.confirm("Deseja realmente excluir esta receita?");
    if (!confirmar) return;

    try {
      await api.delete(`/receitas/${id}`);
      carregarReceitas();
    } catch (error) {
      console.error("Erro ao excluir receita:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="receitas-container">
        <h2>Contas a Receber</h2>

        <form className="formulario" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Descrição"
            value={novaReceita.descricao}
            onChange={(e) =>
              setNovaReceita({ ...novaReceita, descricao: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Valor"
            value={novaReceita.valor}
            onChange={(e) =>
              setNovaReceita({
                ...novaReceita,
                valor: parseFloat(e.target.value),
              })
            }
            required
          />
          <input
            type="date"
            value={novaReceita.dataRecebimento}
            onChange={(e) =>
              setNovaReceita({
                ...novaReceita,
                dataRecebimento: e.target.value,
              })
            }
            required
          />
          <input
            type="text"
            placeholder="Categoria"
            value={novaReceita.categoria}
            onChange={(e) =>
              setNovaReceita({ ...novaReceita, categoria: e.target.value })
            }
            required
          />
          <select
            value={novaReceita.status}
            onChange={(e) =>
              setNovaReceita({
                ...novaReceita,
                status: e.target.value as Receita["status"],
              })
            }
            required
          >
            <option value="Pendente">Pendente</option>
            <option value="Recebida">Recebida</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={novaReceita.recorrente}
              onChange={(e) =>
                setNovaReceita({
                  ...novaReceita,
                  recorrente: e.target.checked,
                })
              }
            />{" "}
            Receita Recorrente
          </label>

          <button type="submit">
            {modoEdicao ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Recebimento</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Recorrente</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {receitas.map((receita) => (
              <tr key={receita.id}>
                <td>{receita.descricao}</td>
                R$ {typeof receita.valor === "number" ? receita.valor.toFixed(2) : "0,00"}
                <td>
                  {new Date(receita.dataRecebimento).toLocaleDateString()}
                </td>
                <td>{receita.categoria}</td>
                <td>{receita.status}</td>
                <td>{receita.recorrente ? "Sim" : "Não"}</td>
                <td>
                  <button onClick={() => editarReceita(receita)}>Editar</button>
                  <button onClick={() => excluirReceita(receita.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
};

export default Receitas;
