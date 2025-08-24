// components/location/ImageComparison.jsx
"use client";

import { useState } from "react";

export default function ImageComparison({
  coordinates,
  layer,
  year1,
  year2,
  isLoading,
}) {
  const [sliderPosition, setSliderPosition] = useState(50);

  // In a real implementation, you would fetch actual imagery for both years
  // For demo purposes, we'll use placeholder images with different filters
  const image1Url = `/api/nasa-imagery?lat=${coordinates.lat}&lon=${coordinates.lon}&layer=${layer}&year=${year1}`;
  const image2Url = `/api/nasa-imagery?lat=${coordinates.lat}&lon=${coordinates.lon}&layer=${layer}&year=${year2}`;

  return (
    <Card className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500/30 backdrop-blur-sm h-96 md:h-[500px]">
      <CardHeader>
        <CardTitle>
          Before & After: {year1} vs {year2}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading comparison images...</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            {/* Before image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${image1Url})`,
                filter: "sepia(0.3)",
              }}
            />

            {/* After image with slider */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${image2Url})`,
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            />

            {/* Slider control */}
            <div className="absolute inset-0 cursor-ew-resize">
              <div
                className="absolute top-0 bottom-0 w-1 bg-white"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -ml-2 -mt-3 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <div className="w-1 h-3 bg-gray-400" />
                </div>
              </div>
            </div>

            {/* Drag handler */}
            <div
              className="absolute inset-0"
              onMouseDown={(e) => {
                const handleMouseMove = (moveEvent) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = moveEvent.clientX - rect.left;
                  const percentage = Math.max(
                    0,
                    Math.min(100, (x / rect.width) * 100)
                  );
                  setSliderPosition(percentage);
                };

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }}
            />

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
              {year1}
            </div>
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
              {year2}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
