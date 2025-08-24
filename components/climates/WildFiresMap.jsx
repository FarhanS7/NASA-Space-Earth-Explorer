// components/climate/WildfiresMap.jsx
"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

export default function WildfiresMap() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/climate/wildfires");
        const json = await res.json();
        setPoints(json.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="w-full h-[420px] rounded-xl overflow-hidden">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {points.map((p) => (
          <CircleMarker
            key={`${p.id}-${p.date}`}
            center={p.coords}
            radius={6}
            pathOptions={{ color: "#ef4444" }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{p.title}</div>
                <div>{new Date(p.date).toUTCString()}</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      {loading && (
        <div className="-mt-[420px] h-[420px] grid place-items-center text-gray-300 bg-black/30">
          Loading wildfires…
        </div>
      )}
    </div>
  );
}
