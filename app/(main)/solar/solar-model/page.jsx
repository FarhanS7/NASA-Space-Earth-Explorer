"use client";

const SolarSystem = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center">
      {/* Page Heading */}
      <header className="text-center py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Explore Solar System in 3D
        </h1>
        <p className="text-gray-300 mt-2 text-lg md:text-xl">
          Interactive solar system simulation by NASA Eyes
        </p>
      </header>

      {/* Responsive iframe container */}
      <div className="relative w-full max-w-7xl aspect-[16/9] px-4">
        <iframe
          src="https://eyes.nasa.gov/apps/solar-system/#/uranus"
          title="Uranus 3D Simulation"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0 rounded-xl shadow-lg"
        />
      </div>

      {/* Footer or extra info */}
      <footer className="text-center text-gray-500 mt-8 mb-4">
        &copy; {new Date().getFullYear()} NASA Eyes Embedded
      </footer>
    </div>
  );
};

export default SolarSystem;
