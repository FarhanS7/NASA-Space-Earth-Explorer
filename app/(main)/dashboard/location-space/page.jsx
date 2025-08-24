// app/(main)/dashboard/location-space/page.jsx
"use client";

import ClimateLayers from "@/components/location/ClimateLayer";
import ImageComparison from "@/components/location/ImageComparison";
import LocationMap from "@/components/location/LocationMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calendar, GitCompare, Layers, MapPin, Search } from "lucide-react";
import { useState } from "react";

export default function LocationSpacePage() {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageryData, setImageryData] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState("natural");
  const [yearRange, setYearRange] = useState([2010, new Date().getFullYear()]);
  const [compareMode, setCompareMode] = useState(false);

  // Available imagery layers
  const imageryLayers = [
    { id: "natural", name: "Natural Color", description: "True-color imagery" },
    {
      id: "urban",
      name: "Urban Development",
      description: "Urban areas and infrastructure",
    },
    {
      id: "vegetation",
      name: "Vegetation Index",
      description: "Plant health and density",
    },
    {
      id: "temperature",
      name: "Temperature",
      description: "Surface temperature data",
    },
    {
      id: "pollution",
      name: "Air Quality",
      description: "Atmospheric composition",
    },
  ];

  // Handle location search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsLoading(true);
    try {
      // First, geocode the location to get coordinates
      const geocodeResponse = await fetch(
        `/api/geocode?location=${encodeURIComponent(location)}`
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData && geocodeData.lat && geocodeData.lon) {
        setCoordinates({ lat: geocodeData.lat, lon: geocodeData.lon });

        // Then fetch satellite imagery
        const imageryResponse = await fetch(
          `/api/nasa-imagery?lat=${geocodeData.lat}&lon=${geocodeData.lon}&layer=${selectedLayer}`
        );
        const imageryResult = await imageryResponse.json();
        setImageryData(imageryResult);
      }
    } catch (error) {
      console.error("Failed to fetch location data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use current location
  // app/(main)/dashboard/location-space/page.jsx - Updated current location function
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setCoordinates(coords);
          setLocation("Current Location");

          // Reverse geocode to get location name
          reverseGeocode(coords.lat, coords.lon);

          // Fetch imagery data
          fetchImageryData(coords);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoading(false);
          alert(
            "Unable to get your location. Please make sure location services are enabled."
          );
        },
        { timeout: 10000 } // 10 second timeout
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `/api/reverse-geocode?lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      if (data.display_name) {
        setLocation(data.display_name);
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  const fetchImageryData = async (coords) => {
    try {
      const response = await fetch(
        `/api/nasa-imagery?lat=${coords.lat}&lon=${coords.lon}&layer=${selectedLayer}`
      );
      const data = await response.json();
      setImageryData(data);
    } catch (error) {
      console.error("Failed to fetch imagery:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 min-h-screen">
      <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🛰️ Your Location from Space
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-100">
          <p>
            See satellite imagery of your location with NASA's Earth observation
            data. Explore climate layers, compare changes over time, and
            visualize environmental factors.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Location Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Enter Your Location
              </label>
              <form onSubmit={handleSearch} className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="City, address, or coordinates"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-blue-800/50 border-blue-600/50 text-white"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <Button
                onClick={useCurrentLocation}
                variant="outline"
                className="w-full bg-blue-500/10 border-blue-400/30 text-blue-200"
              >
                Use My Current Location
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200 flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                Imagery Layer
              </label>
              <select
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(e.target.value)}
                className="w-full p-2 rounded-md bg-blue-800/50 border border-blue-600/50 text-white"
              >
                {imageryLayers.map((layer) => (
                  <option key={layer.id} value={layer.id}>
                    {layer.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-blue-300">
                {imageryLayers.find((l) => l.id === selectedLayer)?.description}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Year Range: {yearRange[0]} - {yearRange[1]}
              </label>
              <Slider
                value={yearRange}
                onValueChange={setYearRange}
                min={2000}
                max={new Date().getFullYear()}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-2 pt-4 border-t border-blue-500/30">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={compareMode}
                  onChange={(e) => setCompareMode(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-blue-200 flex items-center">
                  <GitCompare className="h-4 w-4 mr-2" />
                  Before & After Comparison
                </span>
              </label>
            </div>

            {coordinates && (
              <div className="pt-4 border-t border-blue-500/30">
                <h3 className="font-medium text-blue-200 mb-2">Coordinates</h3>
                <div className="text-sm text-blue-100 space-y-1">
                  <p>Latitude: {coordinates.lat.toFixed(4)}°</p>
                  <p>Longitude: {coordinates.lon.toFixed(4)}°</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {!coordinates ? (
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm h-96 flex items-center justify-center">
              <div className="text-center text-blue-200 p-8">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">
                  Explore Your World from Space
                </h3>
                <p className="mb-4">
                  Enter a location above to see satellite imagery from NASA's
                  Earth observation satellites.
                </p>
                <Button
                  onClick={useCurrentLocation}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Use My Current Location
                </Button>
              </div>
            </Card>
          ) : compareMode ? (
            <ImageComparison
              coordinates={coordinates}
              layer={selectedLayer}
              year1={yearRange[0]}
              year2={yearRange[1]}
              isLoading={isLoading}
            />
          ) : (
            <LocationMap
              coordinates={coordinates}
              layer={selectedLayer}
              isLoading={isLoading}
              imageryData={imageryData}
            />
          )}

          {coordinates && (
            <ClimateLayers
              coordinates={coordinates}
              selectedLayer={selectedLayer}
            />
          )}
        </div>
      </div>
    </main>
  );
}
