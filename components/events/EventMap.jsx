// components/events/EventMap.jsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function EventMap({ events, isLoading }) {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    // Load Leaflet dynamically only on client side
    if (typeof window === "undefined") return;

    const loadMap = async () => {
      try {
        // Check if Leaflet is already loaded
        if (window.L) {
          initializeMap();
          return;
        }

        // Load Leaflet CSS
        const leafletCss = document.createElement("link");
        leafletCss.rel = "stylesheet";
        leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        leafletCss.integrity =
          "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
        leafletCss.crossOrigin = "";
        document.head.appendChild(leafletCss);

        // Load Leaflet JS
        const leafletScript = document.createElement("script");
        leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        leafletScript.integrity =
          "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
        leafletScript.crossOrigin = "";
        leafletScript.onload = initializeMap;
        leafletScript.onerror = () => {
          setMapError("Failed to load map library");
          console.error("Failed to load Leaflet");
        };
        document.head.appendChild(leafletScript);
      } catch (error) {
        console.error("Error loading map:", error);
        setMapError("Failed to initialize map");
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;

      try {
        // Clear any existing map
        if (window.currentMap) {
          window.currentMap.remove();
        }

        // Initialize map
        const map = window.L.map(mapRef.current).setView([20, 0], 2);
        window.currentMap = map;

        // Add tile layer
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
          }
        ).addTo(map);

        // Add markers for each event
        events.forEach((event) => {
          if (event.geometry && event.geometry.length > 0) {
            const [lng, lat] = event.geometry[0].coordinates;

            // Custom icon based on event type
            const iconColor = getColorForCategory(event.categories[0].id);
            const customIcon = window.L.divIcon({
              html: `<div style="background-color: ${iconColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
              className: "custom-marker",
              iconSize: [12, 12],
              iconAnchor: [6, 6],
            });

            const marker = window.L.marker([lat, lng], {
              icon: customIcon,
            }).addTo(map);

            // Add popup with event info
            marker.bindPopup(`
              <div class="p-2">
                <h3 class="font-bold">${event.title}</h3>
                <p class="text-sm">${event.categories[0].title}</p>
                <p class="text-xs">${new Date(
                  event.geometry[0].date
                ).toLocaleDateString()}</p>
                ${
                  event.sources && event.sources[0]
                    ? `<a href="${event.sources[0].url}" target="_blank" class="text-blue-500 text-xs">More info</a>`
                    : ""
                }
              </div>
            `);
          }
        });

        // Fit map to show all markers if there are events
        if (events.length > 0) {
          const bounds = window.L.latLngBounds(
            events
              .filter((event) => event.geometry && event.geometry.length > 0)
              .map((event) => {
                const [lng, lat] = event.geometry[0].coordinates;
                return [lat, lng];
              })
          );
          map.fitBounds(bounds.pad(0.1));
        }

        setMapError(null);
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError("Failed to create map");
      }
    };

    loadMap();

    return () => {
      // Cleanup
      if (window.currentMap) {
        window.currentMap.remove();
        window.currentMap = null;
      }
    };
  }, [events]);

  const getColorForCategory = (categoryId) => {
    switch (categoryId) {
      case "wildfires":
        return "#f97316"; // orange
      case "severeStorms":
        return "#0ea5e9"; // blue
      case "floods":
        return "#06b6d4"; // cyan
      case "volcanoes":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
          <p>Loading event map...</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-400">Map Error: {mapError}</p>
          <p className="text-sm text-blue-300 mt-2">Showing event list only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      <div className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded text-xs z-10">
        {events.length} events displayed
      </div>
    </div>
  );
}
