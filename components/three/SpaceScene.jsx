"use client";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

import { useGsap3DAnimations } from "@/hooks/useGsap3DAnimations";
import AnimatedRocket from "./AnimatedRocket";
import AnimatedStars from "./AnimatedStars";
import FloatingPlanet from "./FloatingPlanet";
import ParticleSystem from "./ParticleSystem";

const SpaceScene = () => {
  const planet1 = useRef();
  const planet2 = useRef();
  const planet3 = useRef();
  const planet4 = useRef();
  const rocket = useRef();

  // Register GSAP animations
  useGsap3DAnimations({
    planets: [planet1, planet2, planet3, planet4],
    rocket,
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8B5CF6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D9FF" />

      <AnimatedStars />
      <ParticleSystem />

      {/* Planets with refs */}
      <group ref={planet1}>
        <FloatingPlanet
          position={[-2, 1, -3]}
          color="#4F46E5"
          size={0.3}
          speed={1.2}
        />
      </group>
      <group ref={planet2}>
        <FloatingPlanet
          position={[2, -1, -4]}
          color="#06B6D4"
          size={0.4}
          speed={0.8}
        />
      </group>
      <group ref={planet3}>
        <FloatingPlanet
          position={[0, 2, -5]}
          color="#8B5CF6"
          size={0.25}
          speed={1.5}
        />
      </group>
      <group ref={planet4}>
        <FloatingPlanet
          position={[-1, -2, -2]}
          color="#EC4899"
          size={0.35}
          speed={0.9}
        />
      </group>

      {/* Rocket with ref */}
      <group ref={rocket} position={[1, 0, -1]}>
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

export default SpaceScene;
