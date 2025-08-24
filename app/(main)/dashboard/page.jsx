// pages/index.js (Dashboard)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Dashboard() {
  const features = [
    {
      title: "🌍 Live Earth (3D)",
      description: "3D spinning globe with real EPIC imagery + time slider.",
      href: "/live-earth",
      color: "from-blue-500/20 to-blue-700/20",
    },
    {
      title: "🛰️ Satellite Tracker",
      description: "Real-time position of NASA satellites with orbital paths.",
      href: "#",
      color: "from-purple-500/20 to-purple-700/20",
      comingSoon: true,
    },
    {
      title: "🔥 Wildfire Monitor",
      description: "Active fire detection using MODIS and VIIRS data.",
      href: "#",
      color: "from-orange-500/20 to-orange-700/20",
      comingSoon: true,
    },
    {
      title: "🌡️ Climate Indicators",
      description: "Global temperature, CO2 levels, and sea ice extent data.",
      href: "#",
      color: "from-green-500/20 to-green-700/20",
      comingSoon: true,
    },
  ];

  return (
    <main className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-900 via-blue-800 to-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Earth & Climate Dashboard
          </h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Explore our planet through NASA's eyes. Interactive visualizations
            powered by real satellite data and scientific measurements.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Card
                className={`cursor-pointer h-full bg-gradient-to-br ${feature.color} border-blue-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {feature.title}
                    {feature.comingSoon && (
                      <span className="text-xs bg-blue-500/30 px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-100">
                  {feature.description}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center text-blue-200 text-sm">
          <p>
            Data provided by NASA's open APIs. This project is part of the NASA
            Space Apps Challenge 2025.
          </p>
        </div>
      </div>
    </main>
  );
}
