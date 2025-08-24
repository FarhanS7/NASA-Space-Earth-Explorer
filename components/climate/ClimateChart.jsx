// components/climate/ClimateChart.jsx
"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ClimateChart({
  data,
  dataset,
  unit,
  color,
  isLoading,
}) {
  if (isLoading || !data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
          <p>Loading climate data...</p>
        </div>
      </div>
    );
  }

  // Separate actual data and predictions
  const actualData = data.filter((item) => !item.isPrediction);
  const predictionData = data.filter((item) => item.isPrediction);

  const chartData = {
    labels: data.map((item) => item.year),
    datasets: [
      {
        label: "Historical Data",
        data: actualData.map((item) => item.value),
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      ...(predictionData.length > 0
        ? [
            {
              label: "Prediction",
              data: [...actualData.slice(-1), ...predictionData].map(
                (item) => item.value
              ),
              borderColor: `${color}80`,
              borderDash: [5, 5],
              backgroundColor: "transparent",
              fill: false,
              tension: 0.4,
              pointBackgroundColor: `${color}80`,
              pointBorderColor: "#fff",
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#e2e8f0",
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        color: "#e2e8f0",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#e2e8f0",
        bodyColor: "#e2e8f0",
        borderColor: "#334155",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(
              2
            )} ${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#e2e8f0",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#e2e8f0",
          callback: function (value) {
            return value + unit;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
