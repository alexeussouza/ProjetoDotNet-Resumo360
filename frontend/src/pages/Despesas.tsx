import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Despesas.css";

interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
  status: "Pendente" | "Paga";
  categoria: string;
}

const Despesas = () => {
  const [despesas, setDespesas] = useState<Despesa[]>([]);

  const [novaDespesa, setNovaDespesa] = useState<Partial<Despesa>>({
    descricao: "",
    valor: 0,
    dataVencimento: "",
    categoria: "",
    status: "Pendente",
  });

  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEditando, setIdEditando] = useState<string | null>(null);

  useEffect(() => {
    buscarDespesas();
  }, []);

  const buscarDespesas = async () => {
    try {
      const response = await api.get<Despesa[]>("/despesas");
      setDespesas(response.data);
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
    }
  };

  const editarDespesa = (despesa: Despesa) => {
    setModoEdicao(true);
    setIdEditando(despesa.id);
    setNovaDespesa({
      descricao: despesa.descricao,
      valor: despesa.valor,
      dataVencimento: despesa.dataVencimento.split("T")[0],
      categoria: despesa.categoria,
      status: despesa.status,
    });
  };

  const excluirDespesa = async (id: string) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta despesa?");
    if (!confirmar) return;
    try {
      await api.delete(`/despesas/${id}`);
      buscarDespesas();
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...novaDespesa,
      dataVencimento: new Date(novaDespesa.dataVencimento!).toISOString()
    };

    if (modoEdicao && idEditando) {
      payload.id = idEditando;
    }

    console.log("Payload enviado:", payload); // 👈 aqui!

    try {
      if (modoEdicao && idEditando) {
        await api.put(`/despesas/${idEditando}`, payload);
      } else {
        await api.post("/despesas", payload);
      }

      setNovaDespesa({
        descricao: "",
        valor: 0,
        dataVencimento: "",
        categoria: "",
        status: "Pendente",
      });
      setModoEdicao(false);
      setIdEditando(null);
      buscarDespesas();
    } catch (error) {
      console.error("Erro ao cadastrar despesa:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="despesas-container">
        <h2>Contas a Pagar</h2>

        <form className="formulario" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Descrição"
            value={novaDespesa.descricao}
            onChange={(e) =>
              setNovaDespesa({ ...novaDespesa, descricao: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Valor"
            value={novaDespesa.valor}
            onChange={(e) =>
              setNovaDespesa({
                ...novaDespesa,
                valor: parseFloat(e.target.value),
              })
            }
            required
          />
          <input
            type="date"
            value={novaDespesa.dataVencimento}
            onChange={(e) =>
              setNovaDespesa({
                ...novaDespesa,
                dataVencimento: e.target.value,
              })
            }
            required
          />
          <input
            type="text"
            placeholder="Categoria"
            value={novaDespesa.categoria}
            onChange={(e) =>
              setNovaDespesa({ ...novaDespesa, categoria: e.target.value })
            }
          />
          <select
            value={novaDespesa.status}
            onChange={(e) =>
              setNovaDespesa({
                ...novaDespesa,
                status: e.target.value as Despesa["status"],
              })
            }
            required
          >
            <option value="Pendente">Pendente</option>
            <option value="Paga">Paga</option>
          </select>

          <button type="submit">
            {modoEdicao ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {despesas.map((despesa) => (
              <tr key={despesa.id}>
                <td>{despesa.descricao}</td>
                R$ {typeof despesa.valor === "number" ? despesa.valor.toFixed(2) : "0,00"}
                <td>{new Date(despesa.dataVencimento).toLocaleDateString()}</td>
                <td>{despesa.categoria}</td>
                <td>{despesa.status}</td>
                <td>
                  <button onClick={() => editarDespesa(despesa)}>Editar</button>
                  <button onClick={() => excluirDespesa(despesa.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
};

export default Despesas;
