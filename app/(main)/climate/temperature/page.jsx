// app/climate/temperature/page.jsx
"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function TemperaturePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/climate/temperature");
        const json = await res.json();
        setData(json.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const minTemp = Math.min(...data.map((d) => d.temperature || 0));
  const maxTemp = Math.max(...data.map((d) => d.temperature || 0));
  const latestTemp = data[data.length - 1]?.temperature ?? "N/A";
  const changeTemp =
    data.length > 1 ? (latestTemp - data[0].temperature).toFixed(2) : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white p-8">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">
          🌡️ Global Temperature Tracker
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Visualizing global temperature changes over decades. Understand
          trends, peaks, and the overall impact of climate change.
        </p>
      </header>

      {/* Summary Cards */}
      {!loading && data.length > 0 && (
        <section className="flex justify-center gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-xl text-center w-36">
            <p className="text-gray-400">Min Temp</p>
            <p className="text-xl font-bold">{minTemp}°C</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl text-center w-36">
            <p className="text-gray-400">Max Temp</p>
            <p className="text-xl font-bold">{maxTemp}°C</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl text-center w-36">
            <p className="text-gray-400">Latest</p>
            <p className="text-xl font-bold">{latestTemp}°C</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl text-center w-36">
            <p className="text-gray-400">Change</p>
            <p className="text-xl font-bold">{changeTemp}°C</p>
          </div>
        </section>
      )}

      {/* Chart */}
      <section className="bg-gray-900/70 rounded-xl p-6 shadow-xl max-w-6xl mx-auto">
        {loading ? (
          <div className="h-[500px] grid place-items-center text-gray-300">
            Loading Temperature Data…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={500}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#333" strokeDasharray="4 4" />
              <XAxis
                dataKey="date"
                stroke="#bbb"
                tickFormatter={(date) => new Date(date).getFullYear()}
              />
              <YAxis stroke="#bbb" domain={["dataMin-1", "dataMax+1"]} />
              <Tooltip
                contentStyle={{ background: "#111", border: "1px solid #333" }}
                formatter={(value) => `${value}°C`}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#f97316"
                fill="url(#tempGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* Explanation */}
      <section className="mt-10 max-w-4xl mx-auto bg-gray-900/50 rounded-xl p-6 shadow-lg text-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Understanding the Chart</h2>
        <ul className="list-disc ml-5 space-y-2">
          <li>Displays global average monthly temperatures over decades.</li>
          <li>Highlights spikes from extreme weather events.</li>
          <li>Visualizes the effect of climate change over time.</li>
          <li>Use summary cards above to quickly see key stats at a glance.</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-400">
        <p>Data Source: NASA & Global Climate APIs</p>
        <p>Hackathon Demo 🌍</p>
      </footer>
    </div>
  );
}
