// pages/live-earth.js (Live Earth Page)
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Info, Pause, Play, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import the LiveGlobe component with no SSR
const LiveGlobe = dynamic(() => import("@/components/climates/LiveGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 md:h-[500px] rounded-lg overflow-hidden border border-blue-500/30 flex items-center justify-center bg-blue-900">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
        <p>Loading 3D globe...</p>
      </div>
    </div>
  ),
});

export default function LiveEarthPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [showInfo, setShowInfo] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 min-h-screen">
      <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              🌍 Live Earth Dashboard
            </span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInfo(!showInfo)}
            className="bg-blue-500/10 border-blue-400/30"
          >
            <Info className="h-4 w-4 mr-2" />
            {showInfo ? "Hide Info" : "Show Info"}
          </Button>
        </CardHeader>

        {showInfo && (
          <CardContent className="text-blue-100">
            <p>
              Daily Earth imagery mapped onto a 3D globe from NASA's EPIC
              instrument (DSCOVR). Use the date picker to rewind and see
              changes. Toggle rotation and speed for a smooth demo.
            </p>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full p-2 rounded-md bg-blue-800/50 border border-blue-600/50 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200">
                Rotation Speed
              </label>
              <Slider
                value={[rotationSpeed * 100]}
                onValueChange={(value) => setRotationSpeed(value[0] / 100)}
                max={100}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-blue-200">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={togglePlayPause}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                onClick={() => setRotationSpeed(0.5)}
                variant="outline"
                className="bg-blue-500/10 border-blue-400/30"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <LiveGlobe
            date={selectedDate}
            isPlaying={isPlaying}
            rotationSpeed={rotationSpeed}
          />
        </div>
      </div>

      <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Why this is special</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-800/30 rounded-lg">
            <h3 className="font-semibold text-blue-300 mb-2">
              Real Satellite Imagery
            </h3>
            <p className="text-sm text-blue-100">
              No fake textures - all imagery comes directly from NASA's DSCOVR
              satellite.
            </p>
          </div>
          <div className="p-4 bg-blue-800/30 rounded-lg">
            <h3 className="font-semibold text-blue-300 mb-2">Time Travel</h3>
            <p className="text-sm text-blue-100">
              Explore day-by-day changes in cloud patterns and weather systems.
            </p>
          </div>
          <div className="p-4 bg-blue-800/30 rounded-lg">
            <h3 className="font-semibold text-blue-300 mb-2">
              Interactive 3D Globe
            </h3>
            <p className="text-sm text-blue-100">
              Fully interactive with atmospheric glow effects for maximum visual
              impact.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
