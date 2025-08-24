// components/climate/TemperaturePage.jsx
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">
          Global Temperature Tracker 🌡️
        </h1>
        <p className="text-lg text-gray-300">
          Track global temperature changes over the years and understand climate
          trends.
        </p>
      </header>

      {/* Chart Section */}
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
              <XAxis dataKey="date" stroke="#bbb" />
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

      {/* Explanation Section */}
      <section className="mt-10 max-w-4xl mx-auto bg-gray-900/50 rounded-xl p-6 shadow-lg text-gray-200">
        <h2 className="text-2xl font-semibold mb-4">
          Understanding This Chart
        </h2>
        <ul className="list-disc ml-5 space-y-2">
          <li>Shows global average monthly temperatures over decades.</li>
          <li>
            Highlights trends and spikes caused by extreme weather events.
          </li>
          <li>Helps visualize the effect of climate change over time.</li>
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
