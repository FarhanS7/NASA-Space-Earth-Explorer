"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  WMSTileLayer,
} from "react-leaflet";

export default function BangladeshFloodMonitor() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/climate/floods-bd");
        const json = await res.json();
        setPoints(json.data || []);
      } catch (e) {
        console.error("Failed to fetch Bangladesh flood data", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="w-full h-[480px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[23.685, 90.3563]} // Bangladesh center
        zoom={6}
        className="w-full h-full"
      >
        {/* Base layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* NASA GIBS IMERG Precipitation Layer */}
        <WMSTileLayer
          url="https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"
          layers="IMERG_Precipitation_Rate"
          format="image/png"
          transparent={true}
          version="1.1.1"
          opacity={0.5}
        />

        {/* Flood points */}
        {!loading &&
          points.map((p, i) => (
            <CircleMarker
              key={i}
              center={[p.lat, p.lon]}
              radius={6}
              pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.7 }}
            >
              <Popup>
                <div>
                  <strong>{p.title}</strong>
                  <p>{p.description || "Flood event"}</p>
                  {p.date && (
                    <p>Date: {new Date(p.date).toLocaleDateString()}</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>

      {loading && (
        <p className="text-center mt-4 text-gray-500">
          Loading Bangladesh flood data...
        </p>
      )}
    </div>
  );
}
