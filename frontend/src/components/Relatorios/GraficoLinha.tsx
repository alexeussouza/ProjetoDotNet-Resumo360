// src/components/GraficoLinha.tsx
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
  titulo: string;
  dadosLinha: { mes: string; saldo: number }[];
}

const GraficoLinha = ({ titulo, dadosLinha }: Props) => {
  const data = {
    labels: dadosLinha.map((d) => d.mes),
    datasets: [
      {
        label: "Saldo",
        data: dadosLinha.map((d) => d.saldo),
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  return (
    <div>
      <h3>{titulo}</h3>
      <Line data={data} />
    </div>
  );
};

export default GraficoLinha;
