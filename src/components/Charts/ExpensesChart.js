import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

const ExpensesChart = ({ groupedExpenses }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Expense Amount",
        data: [],
        backgroundColor: [
          "#FF5733",
          "#33FF57",
          "#3357FF",
          "#FF33A1",
          "#F1C40F",
        ],
        borderColor: "rgba(255, 255, 255, 0.7)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (groupedExpenses) {
      const categories = Object.keys(groupedExpenses);
      const amounts = Object.values(groupedExpenses);

      setChartData({
        labels: categories,
        datasets: [
          {
            ...chartData.datasets[0],
            data: amounts,
          },
        ],
      });
    }
  }, [groupedExpenses]);

  return (
    <div
      className="w-full h-72 mx-auto"
      style={{ maxWidth: "300px", maxHeight: "300px" }}
    >
      <Pie
        data={chartData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top" },
          },
        }}
      />
    </div>
  );
};

export default ExpensesChart;
