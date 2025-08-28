// components/AsteroidScene.jsx
"use client";
import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Asteroid from "./Asteroid";

function Sun({ radius = 2 }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial
        emissive={0xffffaa}
        color={0xffcc33}
        toneMapped={false}
      />
    </mesh>
  );
}

function Earth({ distanceUnit = 10 }) {
  // For demo: Earth placed at +distanceUnit on x
  return (
    <group position={[distanceUnit, 0, 0]}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={0x2a6fdb}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}

export default function AsteroidScene({ asteroids = [], onAsteroidClick }) {
  // convert asteroids into scene positions: we will compute scenePosition on client side if not provided
  // The NeoTracker already computes positions; here we just render them.
  // camera initial
  return (
    <div className="w-full h-[70vh] rounded-2xl overflow-hidden bg-black">
      <Canvas shadows camera={{ position: [0, 20, 30], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={2} />
        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={4}
          saturation={0}
          fade
        />

        {/* Sun at center */}
        <Sun radius={3} />

        {/* Earth placed at some arbitrary radius (for visuals) */}
        <Earth distanceUnit={12} />

        {/* render asteroids */}
        <group>
          {asteroids.map((a) => (
            <Asteroid key={a.id} hint={a} onClick={onAsteroidClick} />
          ))}
        </group>

        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}
