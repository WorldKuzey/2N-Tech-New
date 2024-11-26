import React, { useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // DataLabels plugin'ini import ettik
import jsPDF from "jspdf"; // jsPDF importu
import { format, parseISO, getYear, getMonth } from "date-fns"; // date-fns imports

// Chart.js bileşenini ayarlıyoruz
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ExpensesChart = ({ data }) => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("monthly"); // Başlangıçta aylık
  const chartRef = useRef(null); // Chart.js referansını alıyoruz

  // Verinin geçerli olup olmadığını kontrol et
  if (!data || Object.keys(data).length === 0) {
    return <div>No expense data available</div>; // Eğer veri yoksa, kullanıcıya mesaj göster
  }

  // Aylık veya yıllık gruplama seçeneğine göre veri işleme
  const getChartData = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Aylık gruplama
    if (selectedTimePeriod === "monthly") {
      const monthlyData = {};

      Object.keys(data).forEach((yearMonth) => {
        const [year, month] = yearMonth.split("-"); // Yıl ve ayı ayırıyoruz
        const expense = Object.values(data[yearMonth]).reduce(
          (total, category) => total + category,
          0
        ); // Kategorilerdeki giderleri topluyoruz

        if (!monthlyData[year]) monthlyData[year] = [];
        monthlyData[year][parseInt(month, 10) - 1] = expense;
      });

      // Veriyi grafiğe uygun hale getiriyoruz
      const labels = [];
      const dataset = [];
      Object.keys(monthlyData).forEach((year) => {
        monthlyData[year].forEach((expense, index) => {
          const monthLabel = `${monthNames[index]} ${year}`;
          labels.push(monthLabel);
          dataset.push(expense);
        });
      });

      return {
        labels,
        datasets: [
          {
            data: dataset,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF5733",
              "#8E44AD",
              "#FF9F40",
              "#4BC0C0",
              "#9966FF",
            ], // Renkler
            hoverOffset: 4,
          },
        ],
      };
    } else if (selectedTimePeriod === "yearly") {
      // Yıllık gruplama
      const yearlyData = {};

      Object.keys(data).forEach((yearMonth) => {
        const year = yearMonth.split("-")[0]; // Yıl bilgisini al
        const expense = Object.values(data[yearMonth]).reduce(
          (total, category) => total + category,
          0
        ); // Kategorilerdeki giderleri topluyoruz

        if (!yearlyData[year]) yearlyData[year] = 0;
        yearlyData[year] += expense; // Yıllık toplamı hesaplıyoruz
      });

      // Veriyi grafiğe uygun hale getiriyoruz
      return {
        labels: Object.keys(yearlyData), // Yıl etiketleri
        datasets: [
          {
            data: Object.values(yearlyData), // Yıllık toplam gider
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF5733",
              "#8E44AD",
            ], // Renkler
            hoverOffset: 4,
          },
        ],
      };
    }
  };

  const chartData = getChartData();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          title: (tooltipItem) => {
            return `${
              tooltipItem[0].label
            }: ${tooltipItem[0].raw.toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}`; // Tooltip'te gider miktarını Türk Lirası olarak formatla
          },
          label: (tooltipItem) => {
            return tooltipItem.raw.toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            }); // Yıllık ve aylık gideri Türk Lirası olarak göster
          },
        },
      },
      datalabels: {
        display: true,
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          const expense = value.toLocaleString("tr-TR", {
            style: "currency",
            currency: "TRY",
          }); // Format the expense value as currency
          return `${label}\n${expense}`; // Display month and expense
        },
        color: "white", // Label rengi
        font: {
          weight: "bold",
          size: 14, // Etiket font boyutu
        },
        anchor: "center", // Etiketi merkezde göster
        align: "center",
      },
    },
    // Disable grid lines and axes for a cleaner chart
    scales: {
      x: {
        display: false, // x eksenini gizle
      },
      y: {
        display: false, // y eksenini gizle
      },
    },
  };

  const downloadChartAsPDF = () => {
    if (chartRef.current) {
      const chartCanvas = chartRef.current.canvas; // Directly access the canvas here
      const chartImage = chartCanvas.toDataURL("image/png");

      const doc = new jsPDF();
      doc.addImage(chartImage, "PNG", 10, 10, 180, 180); // Adjust the size here as needed
      doc.save("expense_chart.pdf");
    }
  };

  return (
    <div className="chart-container">
      {/* Seçim için butonlar */}
      <div className="mb-4 text-center">
        <button
          onClick={() => setSelectedTimePeriod("monthly")}
          className={`px-4 py-2 mr-2 ${
            selectedTimePeriod === "monthly"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setSelectedTimePeriod("yearly")}
          className={`px-4 py-2 ${
            selectedTimePeriod === "yearly"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Yearly
        </button>
      </div>

      <h3 className="text-xl font-bold text-center mb-4">
        {selectedTimePeriod === "monthly"
          ? "Monthly Expense Overview"
          : "Yearly Expense Overview"}
      </h3>

      {/* Render Chart */}
      <Pie ref={chartRef} data={chartData} options={options} />

      {/* Download button */}
      <div className="text-center mt-4">
        <button
          onClick={downloadChartAsPDF}
          className="px-4 py-2 bg-green-500 text-white"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default ExpensesChart;
