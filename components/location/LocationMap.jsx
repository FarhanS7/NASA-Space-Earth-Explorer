// components/location/LocationMap.jsx - Fixed
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

export default function LocationMap({
  coordinates,
  layer,
  isLoading,
  imageryData,
}) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapError, setMapError] = useState(null);

  // Validate coordinates
  const isValidCoordinates = (coords) => {
    return (
      coords &&
      typeof coords.lat === "number" &&
      typeof coords.lon === "number" &&
      !isNaN(coords.lat) &&
      !isNaN(coords.lon) &&
      coords.lat >= -90 &&
      coords.lat <= 90 &&
      coords.lon >= -180 &&
      coords.lon <= 180
    );
  };

  useEffect(() => {
    if (
      !coordinates ||
      !isValidCoordinates(coordinates) ||
      typeof window === "undefined"
    ) {
      setMapError("Invalid coordinates");
      return;
    }

    const loadMap = async () => {
      try {
        // Load Leaflet CSS if not already loaded
        if (!document.querySelector('link[href*="leaflet"]')) {
          const leafletCss = document.createElement("link");
          leafletCss.rel = "stylesheet";
          leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(leafletCss);
        }

        // Load Leaflet JS if not already loaded
        if (!window.L) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        initializeMap();
      } catch (error) {
        console.error("Failed to load map:", error);
        setMapError("Failed to load map library");
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;

      // Clear existing map
      if (window.locationMap) {
        window.locationMap.remove();
      }

      // Create map with validated coordinates
      const mapInstance = window.L.map(mapRef.current).setView(
        [coordinates.lat, coordinates.lon],
        12
      );

      window.locationMap = mapInstance;

      // Add base layer
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      // Add marker for the location
      window.L.marker([coordinates.lat, coordinates.lon])
        .addTo(mapInstance)
        .bindPopup("Your Location")
        .openPopup();

      setMap(mapInstance);
      setMapError(null);
    };

    loadMap();

    return () => {
      if (window.locationMap) {
        window.locationMap.remove();
        window.locationMap = null;
      }
    };
  }, [coordinates, imageryData]);

  if (!isValidCoordinates(coordinates)) {
    return (
      <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm h-96 md:h-[500px]">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-red-400">Invalid coordinates</p>
            <p className="text-sm text-blue-300 mt-2">
              Please enter a valid location
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm h-96 md:h-[500px]">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
            <p>Loading satellite imagery...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mapError) {
    return (
      <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm h-96 md:h-[500px]">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-red-400">Error: {mapError}</p>
            <p className="text-sm text-blue-300 mt-2">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm h-96 md:h-[500px]">
      <CardHeader>
        <CardTitle>Satellite View</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] p-0">
        <div ref={mapRef} className="w-full h-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
