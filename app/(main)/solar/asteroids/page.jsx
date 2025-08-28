// app/asteroids/page.js
"use client";
import AsteroidScene from "@/components/solar/AsteroidScene";
import InfoPanel from "@/components/solar/InfoPanel";
import NeoTracker from "@/components/solar/NeoTracker";
import { useEffect, useState } from "react";

export default function AsteroidsPage() {
  const [asteroids, setAsteroids] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Listener from NeoTracker -> receive hints for initial scene creation
    function onLoaded(e) {
      const list = e.detail?.asteroids || [];
      setAsteroids(list);
    }
    function onHighlight(e) {
      const hint = e.detail;
      setSelected(hint);
      // Optionally: center camera on hint via custom event for the scene
      window.dispatchEvent(new CustomEvent("neo:focus", { detail: hint }));
    }
    window.addEventListener("neo:loaded", onLoaded);
    window.addEventListener("neo:highlight", onHighlight);
    return () => {
      window.removeEventListener("neo:loaded", onLoaded);
      window.removeEventListener("neo:highlight", onHighlight);
    };
  }, []);

  return (
    <main className="min-h-screen p-6 text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_420px] gap-6">
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold">
            Near-Earth Objects — Asteroid Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Data from NASA NeoWs. Use the list to highlight asteroids in the 3D
            scene.
          </p>

          <AsteroidScene
            asteroids={asteroids}
            onAsteroidClick={(a) => setSelected(a)}
          />
        </section>

        <aside className="space-y-4 sticky top-6">
          <NeoTracker
            onHighlight={(hint) => {
              // highlights & set selected
              setSelected(hint);
            }}
          />
          <InfoPanel
            asteroid={selected}
            onOpenJpl={(url) => url && window.open(url, "_blank")}
          />
        </aside>
      </div>
    </main>
  );
}
