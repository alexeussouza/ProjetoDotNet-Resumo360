// src/components/GraficoPizza.tsx
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  titulo: string;
  dadosPizza: { [categoria: string]: number };
}

const GraficoPizza = ({ titulo, dadosPizza }: Props) => {
  const data = {
    labels: Object.keys(dadosPizza),
    datasets: [
      {
        data: Object.values(dadosPizza),
        backgroundColor: ["#f87171", "#60a5fa", "#34d399", "#facc15", "#a78bfa"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h3>{titulo}</h3>
      <Pie data={data} />
    </div>
  );
};

export default GraficoPizza;
