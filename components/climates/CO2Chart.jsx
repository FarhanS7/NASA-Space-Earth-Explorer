// components/climate/CO2Chart.jsx
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

export default function CO2Chart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/climate/co2");
        const json = await res.json();
        setData(json.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="w-full h-[360px] rounded-xl bg-gray-900/60 p-4">
      {loading ? (
        <div className="h-full grid place-items-center text-gray-300">
          Loading CO₂…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#bbb" hide={false} />
            <YAxis stroke="#bbb" domain={["dataMin-5", "dataMax+5"]} />
            <Tooltip
              contentStyle={{ background: "#111", border: "1px solid #333" }}
            />
            <Area
              type="monotone"
              dataKey="ppm"
              stroke="#60a5fa"
              fill="#60a5fa33"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
