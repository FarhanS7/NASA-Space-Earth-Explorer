// app/climate/page.jsx
"use client";
import Link from "next/link";

export default function ClimateDashboard() {
  const features = [
    {
      name: "Global Temperature",
      href: "/climate/temperature",
      emoji: "🌡️",
      description: "Visualize global temperature changes over time.",
    },
    {
      name: "CO₂ Levels",
      href: "/climate/co2",
      emoji: "🌍",
      description: "Track atmospheric CO₂ levels historically.",
    },
    {
      name: "Bangladesh Flood Monitor",
      href: "/climate/floods-bd",
      emoji: "🌊",
      description: "View flood-prone regions and monitor water levels.",
    },
    {
      name: "Wildfires Tracker",
      href: "/climate/wildfires",
      emoji: "🔥",
      description: "See open wildfire events globally.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">🌎 Climate Dashboard</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Explore climate and environmental data with interactive charts and
          maps.
        </p>
      </header>

      <main className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {features.map((f) => (
          <Link
            key={f.name}
            href={f.href}
            className="bg-gray-800/70 hover:bg-gray-700/80 p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-bold mb-2">
              {f.emoji} {f.name}
            </h2>
            <p className="text-gray-300">{f.description}</p>
          </Link>
        ))}
      </main>
    </div>
  );
}
