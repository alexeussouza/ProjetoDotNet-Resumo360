import { useEffect, useState } from "react";
import api from "../services/api";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import "./Cartoes.css";

interface CompraCartao {
  id: string;
  descricao: string;
  valor: number;
  dataCompra: string;
  categoria: string;
  nomeCartao: string;
  numeroParcelas: number;
}

const Cartoes = () => {
  const [compras, setCompras] = useState<CompraCartao[]>([]);

  const [novaCompra, setNovaCompra] = useState<Partial<CompraCartao>>({
    descricao: "",
    valor: 0,
    dataCompra: "",
    categoria: "",
    nomeCartao: "",
    numeroParcelas: 1,
  });

  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEditando, setIdEditando] = useState<string | null>(null);

  useEffect(() => {
    buscarCompras();
  }, []);

  const buscarCompras = async () => {
    try {
      const response = await api.get<CompraCartao[]>("/cartoes/compras");
      setCompras(response.data);
    } catch (error) {
      console.error("Erro ao buscar compras:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<CompraCartao> = {
      ...novaCompra,
      dataCompra: new Date(novaCompra.dataCompra!).toISOString(),
    };

    if (modoEdicao && idEditando) {
      payload.id = idEditando;
    }

    try {
      if (modoEdicao && idEditando) {
        await api.put(`/cartoes/compras/${idEditando}`, payload);
      } else {
        await api.post("/cartoes/compras", payload);
      }

      setNovaCompra({
        descricao: "",
        valor: 0,
        dataCompra: "",
        categoria: "",
        nomeCartao: "",
        numeroParcelas: 1,
      });
      setModoEdicao(false);
      setIdEditando(null);
      buscarCompras();
    } catch (error) {
      console.error("Erro ao salvar compra:", error);
    }
  };

  const editarCompra = (compra: CompraCartao) => {
    setModoEdicao(true);
    setIdEditando(compra.id);
    setNovaCompra({
      descricao: compra.descricao,
      valor: compra.valor,
      dataCompra: compra.dataCompra.split("T")[0],
      categoria: compra.categoria,
      nomeCartao: compra.nomeCartao,
      numeroParcelas: compra.numeroParcelas,
    });
  };

  const excluirCompra = async (id: string) => {
    const confirmar = window.confirm("Deseja excluir esta compra?");
    if (!confirmar) return;

    try {
      await api.delete(`/cartoes/compras/${id}`);
      buscarCompras();
    } catch (error) {
      console.error("Erro ao excluir compra:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="cartoes-container">
        <h2>Compras no Cartão</h2>

        <form className="formulario" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Descrição"
            value={novaCompra.descricao}
            onChange={(e) =>
              setNovaCompra({ ...novaCompra, descricao: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Valor"
            value={novaCompra.valor}
            onChange={(e) =>
              setNovaCompra({
                ...novaCompra,
                valor: parseFloat(e.target.value),
              })
            }
            required
          />
          <input
            type="date"
            value={novaCompra.dataCompra}
            onChange={(e) =>
              setNovaCompra({ ...novaCompra, dataCompra: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Categoria"
            value={novaCompra.categoria}
            onChange={(e) =>
              setNovaCompra({ ...novaCompra, categoria: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Nome do Cartão"
            value={novaCompra.nomeCartao}
            onChange={(e) =>
              setNovaCompra({ ...novaCompra, nomeCartao: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Parcelas"
            value={novaCompra.numeroParcelas}
            onChange={(e) =>
              setNovaCompra({
                ...novaCompra,
                numeroParcelas: parseInt(e.target.value, 10),
              })
            }
            min={1}
            max={24}
            required
          />
          <button type="submit">
            {modoEdicao ? "Salvar Alterações" : "Registrar Compra"}
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Categoria</th>
              <th>Cartão</th>
              <th>Parcelas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra) => (
              <tr key={compra.id}>
                <td>{compra.descricao}</td>
                <td>
                  R$ {typeof compra.valor === "number" ? compra.valor.toFixed(2) : "0,00"}
                </td>
                <td>{new Date(compra.dataCompra).toLocaleDateString()}</td>
                <td>{compra.categoria}</td>
                <td>{compra.nomeCartao}</td>
                <td>{compra.numeroParcelas}</td>
                <td>
                  <button onClick={() => editarCompra(compra)}>Editar</button>
                  <button onClick={() => excluirCompra(compra.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
};

export default Cartoes;
