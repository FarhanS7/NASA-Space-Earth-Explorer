// app/climate/co2/page.jsx
import CO2Chart from "../../../../components/climates/CO2Chart";

export default function CO2Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-teal-900 text-white p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">🌍 Atmospheric CO₂ Levels</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Visualize historical CO₂ concentration in the atmosphere. This helps
          understand long-term climate trends.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        <CO2Chart />
      </main>
    </div>
  );
}
