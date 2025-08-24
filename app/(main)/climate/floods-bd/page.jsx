// app/climate/floods-bd/page.jsx
import BDFloodMonitor from "../../../../components/climates/BDFloodMonitor";

export default function FloodsBDPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 text-white p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">🌊 Bangladesh Flood Monitor</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Check flood-prone regions in Bangladesh with real-time data. Circle
          markers indicate recent water level events.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        <BDFloodMonitor />
      </main>
    </div>
  );
}
