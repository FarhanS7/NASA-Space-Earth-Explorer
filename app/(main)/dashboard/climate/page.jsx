// app/(main)/dashboard/climate/page.jsx
"use client";

import ClimateChart from "@/components/climate/ClimateChart";
import DataSourceInfo from "@/components/climate/DataSourceInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, Globe, LineChart, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ClimateDataPage() {
  const [selectedDataset, setSelectedDataset] = useState("co2");
  const [selectedCountry, setSelectedCountry] = useState("global");
  const [timeRange, setTimeRange] = useState("10");
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [predictionEnabled, setPredictionEnabled] = useState(true);

  // Available datasets
  const datasets = [
    { id: "co2", name: "CO₂ Concentration", unit: "ppm", color: "#ef4444" },
    {
      id: "temperature",
      name: "Global Temperature",
      unit: "°C",
      color: "#f97316",
    },
    { id: "rainfall", name: "Rainfall Patterns", unit: "mm", color: "#0ea5e9" },
    { id: "sealevel", name: "Sea Level Rise", unit: "mm", color: "#06b6d4" },
  ];

  // Sample countries for selection
  const countries = [
    { id: "global", name: "Global" },
    { id: "us", name: "United States" },
    { id: "cn", name: "China" },
    { id: "in", name: "India" },
    { id: "eu", name: "European Union" },
    { id: "br", name: "Brazil" },
  ];

  // Time ranges
  const timeRanges = [
    { id: "5", name: "5 years" },
    { id: "10", name: "10 years" },
    { id: "20", name: "20 years" },
    { id: "30", name: "30 years" },
  ];

  // Fetch climate data
  useEffect(() => {
    const fetchClimateData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/nasa-climate?dataset=${selectedDataset}&country=${selectedCountry}&years=${timeRange}`
        );
        const data = await response.json();

        if (data) {
          setChartData(data);
        }
      } catch (error) {
        console.error("Failed to fetch climate data:", error);
        // Load sample data if API fails
        setChartData(generateSampleData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchClimateData();
  }, [selectedDataset, selectedCountry, timeRange]);

  // Generate sample data for demonstration
  const generateSampleData = () => {
    const data = [];
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - parseInt(timeRange);

    let baseValue;
    switch (selectedDataset) {
      case "co2":
        baseValue = selectedCountry === "global" ? 350 : 300;
        break;
      case "temperature":
        baseValue = selectedCountry === "global" ? 14.0 : 12.0;
        break;
      case "rainfall":
        baseValue = selectedCountry === "global" ? 1000 : 800;
        break;
      case "sealevel":
        baseValue = selectedCountry === "global" ? 0 : -50;
        break;
      default:
        baseValue = 100;
    }

    for (let year = startYear; year <= currentYear; year++) {
      const trend =
        selectedDataset === "co2"
          ? 2.5
          : selectedDataset === "temperature"
          ? 0.03
          : selectedDataset === "sealevel"
          ? 3.2
          : 0;

      const variability = Math.random() * 10 - 5;
      const value = baseValue + (year - startYear) * trend + variability;

      data.push({ year, value });
    }

    // Add predictions if enabled
    if (predictionEnabled) {
      for (let year = currentYear + 1; year <= currentYear + 10; year++) {
        const trend =
          selectedDataset === "co2"
            ? 2.8
            : selectedDataset === "temperature"
            ? 0.035
            : selectedDataset === "sealevel"
            ? 3.5
            : 0;

        const lastValue = data[data.length - 1].value;
        const value = lastValue + trend;

        data.push({ year, value, isPrediction: true });
      }
    }

    return data;
  };

  // Download data as CSV
  const downloadData = () => {
    if (!chartData) return;

    const csvContent = [
      ["Year", "Value", "Dataset", "Region"],
      ...chartData.map((item) => [
        item.year,
        item.value.toFixed(2),
        datasets.find((d) => d.id === selectedDataset)?.name || selectedDataset,
        countries.find((c) => c.id === selectedCountry)?.name ||
          selectedCountry,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `climate-data-${selectedDataset}-${selectedCountry}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 min-h-screen">
      <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              📊 Climate Change Data Visualizer
            </span>
          </CardTitle>
          <Button
            onClick={downloadData}
            variant="outline"
            className="bg-blue-500/10 border-blue-400/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </CardHeader>
        <CardContent className="text-blue-100">
          <p>
            Explore historical climate data and trends from NASA's Earth science
            data. Visualize CO₂ levels, temperature changes, rainfall patterns,
            and sea level rise with interactive charts and predictive modeling.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Data Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200 flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Dataset
              </label>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="w-full p-2 rounded-md bg-blue-800/50 border border-blue-600/50 text-white"
              >
                {datasets.map((dataset) => (
                  <option key={dataset.id} value={dataset.id}>
                    {dataset.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200 flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Region
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2 rounded-md bg-blue-800/50 border border-blue-600/50 text-white"
              >
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full p-2 rounded-md bg-blue-800/50 border border-blue-600/50 text-white"
              >
                {timeRanges.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-4 border-t border-blue-500/30">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={predictionEnabled}
                  onChange={(e) => setPredictionEnabled(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-blue-200 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Show 10-year prediction
                </span>
              </label>
            </div>

            <DataSourceInfo dataset={selectedDataset} />
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                {datasets.find((d) => d.id === selectedDataset)?.name} Data
                {selectedCountry !== "global" &&
                  ` for ${
                    countries.find((c) => c.id === selectedCountry)?.name
                  }`}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ClimateChart
                data={chartData}
                dataset={selectedDataset}
                unit={datasets.find((d) => d.id === selectedDataset)?.unit}
                color={datasets.find((d) => d.id === selectedDataset)?.color}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Climate Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-800/30 rounded-lg">
                  <h3 className="font-semibold text-blue-300 mb-2">
                    Historical Trend
                  </h3>
                  <p className="text-sm text-blue-100">
                    {chartData && chartData.length > 0
                      ? `Average increase: ${calculateTrend(
                          chartData.filter((d) => !d.isPrediction)
                        )}% per year`
                      : "Loading data..."}
                  </p>
                </div>
                <div className="p-4 bg-blue-800/30 rounded-lg">
                  <h3 className="font-semibold text-blue-300 mb-2">
                    Current Status
                  </h3>
                  <p className="text-sm text-blue-100">
                    {chartData && chartData.length > 0
                      ? `Current value: ${chartData
                          .filter((d) => !d.isPrediction)
                          .slice(-1)[0]
                          ?.value.toFixed(2)} ${
                          datasets.find((d) => d.id === selectedDataset)?.unit
                        }`
                      : "Loading data..."}
                  </p>
                </div>
                <div className="p-4 bg-blue-800/30 rounded-lg">
                  <h3 className="font-semibold text-blue-300 mb-2">
                    Predicted Impact
                  </h3>
                  <p className="text-sm text-blue-100">
                    {predictionEnabled &&
                    chartData &&
                    chartData.some((d) => d.isPrediction)
                      ? `Projected increase: ${calculateTrend(
                          chartData.filter((d) => d.isPrediction)
                        )}% in next decade`
                      : "Enable predictions to see impact"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

// Helper function to calculate trend
function calculateTrend(data) {
  if (!data || data.length < 2) return 0;

  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;
  const years = data[data.length - 1].year - data[0].year;

  return ((((lastValue - firstValue) / firstValue) * 100) / years).toFixed(2);
}
