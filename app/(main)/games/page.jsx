"use client";
import { useEffect, useRef, useState } from "react";

export default function Rover() {
  const canvasRef = useRef(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rows = 10,
      cols = 10,
      tile = 50;
    canvas.width = cols * tile;
    canvas.height = rows * tile;

    const rover = { x: 0, y: rows - 1 };
    const pois = new Set();
    while (pois.size < 5)
      pois.add(
        `${Math.floor(Math.random() * cols)},${Math.floor(
          Math.random() * rows
        )}`
      );

    function draw() {
      ctx.fillStyle = "#1b2335";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * tile, 0);
        ctx.lineTo(c * tile, rows * tile);
        ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * tile);
        ctx.lineTo(cols * tile, r * tile);
        ctx.stroke();
      }

      ctx.fillStyle = "#fbbf24";
      [...pois].forEach((p) => {
        const [cx, cy] = p.split(",").map(Number);
        ctx.beginPath();
        ctx.arc(cx * tile + tile / 2, cy * tile + tile / 2, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(
        rover.x * tile + 10,
        rover.y * tile + 10,
        tile - 20,
        tile - 20
      );
    }

    async function unlock() {
      try {
        let photo = null;
        for (let i = 0; i < 3; i++) {
          const res = await fetch("/api/mars-latest/route.js");
          const data = await res.json();
          if (data.photo) {
            photo = data.photo;
            break;
          }
        }
        if (photo) setModal(photo);
      } catch (e) {
        console.error("NASA API error:", e);
      }
    }

    function move(e) {
      const prev = { ...rover };
      if (e.key === "ArrowUp" && rover.y > 0) rover.y--;
      if (e.key === "ArrowDown" && rover.y < rows - 1) rover.y++;
      if (e.key === "ArrowLeft" && rover.x > 0) rover.x--;
      if (e.key === "ArrowRight" && rover.x < cols - 1) rover.x++;
      if (prev.x !== rover.x || prev.y !== rover.y) {
        const key = `${rover.x},${rover.y}`;
        if (pois.has(key)) {
          pois.delete(key);
          unlock();
        }
        draw();
      }
    }

    draw();
    window.addEventListener("keydown", move);
    return () => window.removeEventListener("keydown", move);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Mars Rover Explorer</h1>
      <canvas ref={canvasRef} className="bg-black rounded-xl shadow-lg" />
      {modal && (
        <div className="mt-4 bg-white/10 p-4 rounded-xl text-center">
          <img
            src={modal.img_src}
            alt="Mars Rover"
            className="rounded-lg w-full max-w-[360px]"
          />
          <p className="text-gray-300 mt-2">
            {modal.earth_date} • {modal.camera}
          </p>
          <button
            onClick={() => setModal(null)}
            className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
