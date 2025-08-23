"use client";
import {
  Float,
  OrbitControls,
  PointMaterial,
  Points,
  Sphere,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ArrowRight,
  Globe,
  Play,
  Rocket,
  Satellite,
  Telescope,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Animated Stars Component
const AnimatedStars = () => {
  const ref = useRef();
  const [sphere] = useState(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  });

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = -state.clock.elapsedTime / 20;
      ref.current.rotation.y = -state.clock.elapsedTime / 30;
    }
  });

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8B5CF6"
        size={0.003}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
};

// Floating Planet Component
const FloatingPlanet = ({ position, color, size, speed = 1 }) => {
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2;
      ringRef.current.rotation.z += 0.02 * speed;
    }
  });

  return (
    <Float
      speed={speed}
      rotationIntensity={0.3}
      floatIntensity={0.5}
      floatingRange={[0, 0.5]}
    >
      <group position={position}>
        <Sphere ref={meshRef} args={[size, 32, 32]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            roughness={0.7}
            metalness={0.3}
          />
        </Sphere>
        <mesh ref={ringRef}>
          <ringGeometry args={[size * 1.3, size * 1.5, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Particle System Component
const ParticleSystem = () => {
  const pointsRef = useRef();
  const particleCount = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      const positions = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#00D9FF"
        size={0.002}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
};

// Animated Rocket Component
const AnimatedRocket = () => {
  const rocketRef = useRef();

  useFrame((state) => {
    if (rocketRef.current) {
      rocketRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 2) * 0.3;
      rocketRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={rocketRef} position={[0, 0, 0]}>
        {/* Rocket Body */}
        <mesh>
          <cylinderGeometry args={[0.1, 0.15, 0.8, 8]} />
          <meshStandardMaterial
            color="#E5E5E5"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Rocket Nose */}
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshStandardMaterial color="#FF4444" />
        </mesh>
        {/* Rocket Fins */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 2) * 0.15,
              -0.3,
              Math.sin((i * Math.PI) / 2) * 0.15,
            ]}
            rotation={[0, (i * Math.PI) / 2, 0]}
          >
            <boxGeometry args={[0.05, 0.2, 0.15]} />
            <meshStandardMaterial color="#4444FF" />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

// Main 3D Scene Component
const SpaceScene = () => {
  const { viewport } = useThree();

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8B5CF6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D9FF" />

      <AnimatedStars />
      <ParticleSystem />

      {/* Planets */}
      <FloatingPlanet
        position={[-2, 1, -3]}
        color="#4F46E5"
        size={0.3}
        speed={1.2}
      />
      <FloatingPlanet
        position={[2, -1, -4]}
        color="#06B6D4"
        size={0.4}
        speed={0.8}
      />
      <FloatingPlanet
        position={[0, 2, -5]}
        color="#8B5CF6"
        size={0.25}
        speed={1.5}
      />
      <FloatingPlanet
        position={[-1, -2, -2]}
        color="#EC4899"
        size={0.35}
        speed={0.9}
      />

      {/* Animated Rocket */}
      <group position={[1, 0, -1]}>
        <AnimatedRocket />
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
};

// Main Hero Component
const SpaceHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: Globe, title: "Earth Climate", desc: "Real-time weather data" },
    { icon: Telescope, title: "Space Explorer", desc: "Discover the cosmos" },
    {
      icon: Satellite,
      title: "Mars Rover",
      desc: "Latest from the Red Planet",
    },
  ];

  return (
    <div className="relative min-h-screen  overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96  rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8 h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div
            className={`space-y-8 transform transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full Welcome-box animate-bounce-gentle">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-300">
                Welcome to the Future
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="Welcome-text block">Explore</span>
                <span className="text-white block">Earth & Space</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
            </div>

            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Discover the wonders of our planet and the infinite mysteries of
              space through
              <span className="text-cyan-400 font-semibold">
                {" "}
                interactive visualizations
              </span>{" "}
              and
              <span className="text-purple-400 font-semibold">
                {" "}
                real-time data
              </span>
              .
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 transform ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-cyan-600/20 group-hover:from-purple-600/40 group-hover:to-cyan-600/40 transition-all duration-300">
                        <IconComponent className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-gray-400">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              <button className="group button-primary px-8 py-4 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                <span>Start Exploring</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="group px-8 py-4 rounded-xl text-white font-medium border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 hover:bg-white/5 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div
              className={`flex items-center space-x-8 pt-8 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "1000ms" }}
            >
              {[
                { number: "15K+", label: "Active Users" },
                { number: "50+", label: "Data Sources" },
                { number: "24/7", label: "Real-time Updates" },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold Welcome-text">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 3D Animation */}
          <div
            className={`relative h-[600px] lg:h-[700px] transform transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {/* Canvas Container */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                style={{ background: "transparent" }}
              >
                <SpaceScene />
              </Canvas>
            </div>

            {/* Floating UI Elements */}
            <div className="absolute top-8 right-8 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white font-medium">
                  Live Data
                </span>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-sm text-gray-300">
                <div className="text-cyan-400 font-semibold">
                  Mars Rover Status
                </div>
                <div>Exploring • Sol 3847</div>
              </div>
            </div>

            {/* Orbital Decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 border border-purple-500/20 rounded-full animate-spin"
                style={{ animationDuration: "20s" }}
              />
              <div
                className="absolute top-1/2 left-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2 border border-cyan-500/20 rounded-full animate-spin"
                style={{
                  animationDuration: "15s",
                  animationDirection: "reverse",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes bounce-gentle {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SpaceHeroSection;
