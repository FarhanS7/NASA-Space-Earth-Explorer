"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

const AnimatedStars = ({ count = 1000 }) => {
  const points = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" />
    </points>
  );
};

export default AnimatedStars;
