// // components/climate/LiveGlobe.js
// "use client";

// import { format } from "date-fns";
// import { useEffect, useRef, useState } from "react";

// export default function LiveGlobe({ date, isPlaying, rotationSpeed }) {
//   const globeEl = useRef(null);
//   const globeInstance = useRef(null);
//   const [textures, setTextures] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [globeLoaded, setGlobeLoaded] = useState(false);

//   // Initialize globe
//   useEffect(() => {
//     // Only run on client side
//     if (typeof window === "undefined") return;

//     const initGlobe = async () => {
//       try {
//         // Dynamically import the library
//         const GlobeModule = await import("globe.gl");
//         const Globe = GlobeModule.default;

//         if (!globeEl.current) return;

//         // Clear any existing content
//         globeEl.current.innerHTML = "";

//         // Initialize globe
//         const world = Globe()(globeEl.current)
//           .globeImageUrl(
//             "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
//           )
//           .bumpImageUrl(
//             "//unpkg.com/three-globe/example/img/earth-topology.png"
//           )
//           .backgroundColor("rgba(0,0,0,0)")
//           .showAtmosphere(true)
//           .atmosphereColor("#3a228a")
//           .atmosphereAltitude(0.25);

//         // Add auto-rotation
//         world.controls().autoRotate = isPlaying;
//         world.controls().autoRotateSpeed = rotationSpeed;

//         // Center and position the globe properly
//         setTimeout(() => {
//           // Adjust the camera to center the globe
//           world.camera().position.z = 300;

//           // Update controls to apply the new camera position
//           world.controls().update();

//           // Force a render to update the view
//           world.renderer().render(world.scene(), world.camera());
//         }, 100);

//         globeInstance.current = world;
//         setGlobeLoaded(true);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Failed to initialize globe:", error);
//         setIsLoading(false);
//       }
//     };

//     initGlobe();

//     // Cleanup function
//     return () => {
//       if (globeInstance.current) {
//         try {
//           // Proper cleanup
//           const canvas = globeEl.current?.querySelector("canvas");
//           if (canvas) {
//             canvas.remove();
//           }
//         } catch (e) {
//           console.error("Error during cleanup:", e);
//         }
//         globeInstance.current = null;
//       }
//     };
//   }, []); // Empty dependency array - only run once on mount

//   // Handle play/pause
//   useEffect(() => {
//     if (globeInstance.current) {
//       globeInstance.current.controls().autoRotate = isPlaying;
//     }
//   }, [isPlaying]);

//   // Handle rotation speed
//   useEffect(() => {
//     if (globeInstance.current) {
//       globeInstance.current.controls().autoRotateSpeed = rotationSpeed;
//     }
//   }, [rotationSpeed]);

//   // Handle date changes and texture loading
//   useEffect(() => {
//     const fetchTextureForDate = async (date) => {
//       if (!globeInstance.current || !globeLoaded) return;

//       const dateStr = format(date, "yyyy-MM-dd");

//       // Check if we already have this texture
//       if (textures[dateStr]) {
//         globeInstance.current.globeImageUrl(textures[dateStr]);
//         return;
//       }

//       setIsLoading(true);

//       try {
//         // For demo purposes, we'll use a placeholder approach
//         // In a real implementation, you would fetch from NASA API
//         const demoTextures = {
//           "2024-01-15":
//             "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
//           "2024-01-14":
//             "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
//           "2024-01-13":
//             "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
//         };

//         const imageUrl = demoTextures[dateStr] || demoTextures["2024-01-15"];

//         // Update textures cache
//         setTextures((prev) => ({ ...prev, [dateStr]: imageUrl }));

//         // Update globe texture
//         globeInstance.current.globeImageUrl(imageUrl);
//       } catch (error) {
//         console.error("Failed to fetch texture:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (globeLoaded && date) {
//       fetchTextureForDate(date);
//     }
//   }, [date, globeLoaded, textures]);

//   return (
//     <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden border border-blue-500/30 flex items-center justify-center">
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-blue-900/70 z-10">
//           <div className="text-white text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
//             <p>Loading satellite imagery...</p>
//           </div>
//         </div>
//       )}
//       <div
//         ref={globeEl}
//         className="w-full h-full flex items-center justify-center"
//       />

//       {!globeLoaded && !isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-blue-900/70 z-10">
//           <div className="text-white text-center">
//             <p>Initializing 3D globe...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// components/climate/LiveGlobe.js
"use client";

import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

export default function LiveGlobe({ date, isPlaying, rotationSpeed }) {
  const globeEl = useRef(null);
  const globeInstance = useRef(null);
  const [textures, setTextures] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [globeLoaded, setGlobeLoaded] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  // Fetch available dates from NASA EPIC API
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await fetch("/api/nasa-epic-dates");
        if (response.ok) {
          const dates = await response.json();
          setAvailableDates(dates);
        }
      } catch (error) {
        console.error("Failed to fetch available dates:", error);
      }
    };

    fetchAvailableDates();
  }, []);

  // Initialize globe
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initGlobe = async () => {
      try {
        const GlobeModule = await import("globe.gl");
        const Globe = GlobeModule.default;

        if (!globeEl.current) return;

        globeEl.current.innerHTML = "";

        const world = Globe()(globeEl.current)
          .globeImageUrl(
            "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          )
          .bumpImageUrl(
            "//unpkg.com/three-globe/example/img/earth-topology.png"
          )
          .backgroundColor("rgba(0,0,0,0)")
          .showAtmosphere(true)
          .atmosphereColor("#3a228a")
          .atmosphereAltitude(0.25);

        world.controls().autoRotate = isPlaying;
        world.controls().autoRotateSpeed = rotationSpeed;

        // Center the globe
        setTimeout(() => {
          world.camera().position.z = 300;
          world.controls().update();
        }, 100);

        globeInstance.current = world;
        setGlobeLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize globe:", error);
        setIsLoading(false);
      }
    };

    initGlobe();

    return () => {
      if (globeInstance.current) {
        try {
          const canvas = globeEl.current?.querySelector("canvas");
          if (canvas) canvas.remove();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
        globeInstance.current = null;
      }
    };
  }, []);

  // REAL NASA API integration
  useEffect(() => {
    const fetchTextureForDate = async (date) => {
      if (!globeInstance.current || !globeLoaded) return;

      const dateStr = format(date, "yyyy-MM-dd");

      // Check if date is available
      if (availableDates.length > 0 && !availableDates.includes(dateStr)) {
        setApiError(
          `No imagery available for ${dateStr}. Try a date between 2015-06-01 and today.`
        );
        setIsLoading(false);
        return;
      }

      // Check cache first
      if (textures[dateStr]) {
        globeInstance.current.globeImageUrl(textures[dateStr]);
        return;
      }

      setIsLoading(true);
      setApiError(null);

      try {
        // Fetch available images for selected date from NASA EPIC API
        const response = await fetch(`/api/nasa-epic?date=${dateStr}`);

        if (!response.ok) {
          throw new Error(`NASA API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          throw new Error(`No imagery available for ${dateStr}`);
        }

        // Use the most recent image of the day
        const latestImage = data[0];
        const imageName = latestImage.image;

        // Construct the NASA EPIC image URL
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(5, 7);
        const day = dateStr.substring(8, 10);

        const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${imageName}.png`;

        // Update textures cache
        setTextures((prev) => ({ ...prev, [dateStr]: imageUrl }));

        // Update globe with REAL satellite imagery
        globeInstance.current.globeImageUrl(imageUrl);
      } catch (error) {
        console.error("Failed to fetch NASA imagery:", error);
        setApiError(error.message);

        // Fallback to default texture with a message
        globeInstance.current.globeImageUrl(
          "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (globeLoaded && date) {
      fetchTextureForDate(date);
    }
  }, [date, globeLoaded, textures, availableDates]);

  // Handle play/pause and rotation speed
  useEffect(() => {
    if (globeInstance.current) {
      globeInstance.current.controls().autoRotate = isPlaying;
    }
  }, [isPlaying]);

  useEffect(() => {
    if (globeInstance.current) {
      globeInstance.current.controls().autoRotateSpeed = rotationSpeed;
    }
  }, [rotationSpeed]);

  // Get the most recent available date
  const getLatestAvailableDate = () => {
    if (availableDates.length > 0) {
      return new Date(availableDates[availableDates.length - 1]);
    }
    // Default to 2 days ago if no dates available
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return twoDaysAgo;
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden border border-blue-500/30 flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900/70 z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
            <p>Loading NASA satellite imagery...</p>
            <p className="text-sm mt-2">Fetching from DSCOVR EPIC camera</p>
          </div>
        </div>
      )}

      {apiError && (
        <div className="absolute top-2 left-2 right-2 bg-yellow-500/90 text-black p-3 rounded text-sm z-10">
          <strong>Note:</strong> {apiError}
          <br />
          <span className="text-xs">
            Showing default texture. Try dates between 2015-06-01 and{" "}
            {format(getLatestAvailableDate(), "yyyy-MM-dd")}
          </span>
        </div>
      )}

      <div
        ref={globeEl}
        className="w-full h-full flex items-center justify-center"
      />

      {!globeLoaded && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900/70 z-10">
          <div className="text-white text-center">
            <p>Initializing 3D globe visualization...</p>
          </div>
        </div>
      )}

      {/* Information overlay */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white p-2 rounded text-xs z-10">
        NASA DSCOVR EPIC •{" "}
        {date ? format(date, "yyyy-MM-dd") : "Loading date..."}
      </div>
    </div>
  );
}
