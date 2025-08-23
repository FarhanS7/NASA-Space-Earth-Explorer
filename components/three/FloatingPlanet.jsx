"use client";
import { Float, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

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

        {/* Render ring only when size > 0 */}
        {size > 0 && (
          <mesh ref={ringRef}>
            <ringGeometry args={[size * 1.3, size * 1.5, 32]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
};

export default FloatingPlanet;
