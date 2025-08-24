// components/location/ClimateLayers.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ClimateLayers({ coordinates, selectedLayer }) {
  const climateData = {
    natural: [
      { name: "Vegetation Coverage", value: "78%", change: "+5% since 2010" },
      { name: "Water Bodies", value: "12%", change: "−2% since 2010" },
      { name: "Urban Area", value: "10%", change: "+7% since 2010" },
    ],
    urban: [
      {
        name: "Population Density",
        value: "2,345/km²",
        change: "+15% since 2010",
      },
      { name: "Built-up Area", value: "18.5%", change: "+8% since 2010" },
      {
        name: "Infrastructure Index",
        value: "72/100",
        change: "+12 since 2010",
      },
    ],
    vegetation: [
      { name: "NDVI Index", value: "0.68", change: "+0.12 since 2010" },
      { name: "Forest Coverage", value: "42%", change: "+3% since 2010" },
      { name: "Crop Health", value: "Good", change: "Stable" },
    ],
    temperature: [
      {
        name: "Avg. Temperature",
        value: "18.7°C",
        change: "+1.2°C since 2010",
      },
      { name: "Heat Island Effect", value: "Moderate", change: "Increasing" },
      {
        name: "Seasonal Variation",
        value: "12.4°C",
        change: "+0.8°C since 2010",
      },
    ],
    pollution: [
      { name: "Air Quality Index", value: "45", change: "−8 since 2010" },
      {
        name: "PM2.5 Levels",
        value: "12 μg/m³",
        change: "−4 μg/m³ since 2010",
      },
      {
        name: "CO2 Concentration",
        value: "415 ppm",
        change: "+35 ppm since 2010",
      },
    ],
  };

  const data = climateData[selectedLayer] || climateData.natural;

  return (
    <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Environmental Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <div key={index} className="p-4 bg-blue-800/30 rounded-lg">
              <h3 className="font-semibold text-blue-300 mb-1">{item.name}</h3>
              <p className="text-2xl font-bold text-white mb-1">{item.value}</p>
              <p className="text-sm text-blue-200">{item.change}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
