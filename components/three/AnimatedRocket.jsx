"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const AnimatedRocket = () => {
  const rocketRef = useRef();

  useFrame((state) => {
    if (rocketRef.current) {
      rocketRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={rocketRef} scale={0.5}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 1.5, 32]} />
        <meshStandardMaterial color="#f87171" />
      </mesh>
      {/* Nose Cone */}
      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.2, 0.4, 32]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
      {/* Window */}
      <mesh position={[0, 0.2, 0.21]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Fins */}
      <mesh position={[0.3, -0.5, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.05, 0.5, 0.2]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.3, -0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.05, 0.5, 0.2]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    </group>
  );
};

export default AnimatedRocket;
