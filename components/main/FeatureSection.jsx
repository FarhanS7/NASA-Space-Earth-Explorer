"use client";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { GamepadIcon, GlobeIcon, RocketIcon, SunIcon } from "lucide-react";

const defaultFeatures = [
  {
    Icon: RocketIcon,
    name: "Solar System Model 3D",
    description:
      "Explore planets, moons, and orbits in a realistic 3D solar system model.",
    href: "/solar-system",
    cta: "Explore",
    background: (
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/images/solar-system.jpg')" }}
      />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Earth & Climate Dashboard",
    description:
      "Visualize climate data, track changes, and learn about environmental impact.",
    href: "/earth-climate",
    cta: "Discover",
    background: (
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/images/environment.jpg')" }}
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GamepadIcon,
    name: "Interactive Space Games",
    description:
      "Play fun educational games like Asteroid Dodger and Mars Rover Explorer.",
    href: "/games",
    cta: "Play",
    background: (
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/images/space-game.jpg')" }}
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: SunIcon,
    name: "Astronomy Facts",
    description:
      "Learn interesting facts about planets, stars, asteroids, and more.",
    href: "/astronomy-facts",
    cta: "Learn",
    background: (
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/images/astronomy.jpg')" }}
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: GlobeIcon,
    name: "Real-time Space Data",
    description:
      "Access real NASA datasets like APOD, Mars Rover images, and asteroid info.",
    href: "/space-data",
    cta: "Explore",
    background: (
      <div
        className="bg-transparent absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/images/space-data.jpg')" }}
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export const FeatureSection = ({ features = defaultFeatures }) => {
  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Features
        </h2>

        <BentoGrid className="lg:grid-rows-3 gap-6">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};
