// app/climate/wildfires/page.jsx
import WildFiresMap from "../../../../components/climates/WildFiresMap";

export default function WildfiresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-red-900 text-white p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">🔥 Global Wildfires Tracker</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Monitor ongoing wildfires worldwide. Markers indicate open wildfire
          events reported by NASA.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        <WildFiresMap />
      </main>
    </div>
  );
}
