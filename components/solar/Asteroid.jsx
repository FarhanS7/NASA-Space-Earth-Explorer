// components/Asteroid.jsx
"use client";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * hint: { id, name, pha, scenePosition: {x,y,z}, relVelKmS, approachDate }
 * scaleFactor: how many km == 1 unit in scene
 */
export default function Asteroid({ hint, scaleFactor = 1e6, onClick }) {
  const ref = useRef();
  const base = useRef({
    angle: Math.atan2(hint.scenePosition.y, hint.scenePosition.x),
  });

  // store radius in scene units
  const radius = Math.sqrt(
    hint.scenePosition.x ** 2 +
      hint.scenePosition.y ** 2 +
      (hint.scenePosition.z || 0) ** 2
  );

  useEffect(() => {
    // place initially
    if (ref.current) {
      ref.current.position.set(
        hint.scenePosition.x,
        hint.scenePosition.y,
        hint.scenePosition.z
      );
    }
  }, [hint]);

  // animate: slow angular motion + bobbing
  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // visual speed factor scaled from relVelKmS (arbitrary mapping)
    const speedFactor = (hint.relVelKmS || 0.01) * 0.02; // tweak as needed
    base.current.angle += speedFactor * delta;
    const x = Math.cos(base.current.angle) * radius;
    const y = Math.sin(base.current.angle) * radius;
    const z = Math.sin(t * 2 + radius * 10) * (0.02 + (hint.pha ? 0.02 : 0.01));
    ref.current.position.set(x, y, z);
    // subtle pulse on PHA
    const s =
      0.4 +
      (hint.pha
        ? 0.6 * Math.abs(Math.sin(t * 4))
        : 0.2 + 0.1 * Math.abs(Math.sin(t * 2)));
    ref.current.scale.setScalar(s);
    if (ref.current.material) {
      ref.current.material.emissiveIntensity = hint.pha ? 2.5 : 0.8;
    }
  });

  return (
    <mesh
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(hint);
      }}
      castShadow
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={hint.pha ? new THREE.Color(0xff6b6b) : new THREE.Color(0xffd27f)}
        emissive={
          hint.pha ? new THREE.Color(0xff3b3b) : new THREE.Color(0xffea9a)
        }
        emissiveIntensity={1}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}
