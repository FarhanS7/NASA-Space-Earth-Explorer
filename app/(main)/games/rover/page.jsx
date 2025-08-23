"use client";

// pages/games/rover.js
import { useEffect, useRef, useState } from "react";

export default function Rover() {
  const canvasRef = useRef(null);
  const [modal, setModal] = useState(null); // {img, date, camera}

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    const cols = 10,
      rows = 10,
      tile = 56;
    canvas.width = cols * tile;
    canvas.height = rows * tile;

    const rover = { x: 0, y: rows - 1 };
    const pois = new Set();
    while (pois.size < 6)
      pois.add(
        `${Math.floor(Math.random() * cols)},${Math.floor(
          Math.random() * rows
        )}`
      );

    function draw() {
      // ground
      ctx.fillStyle = "#1b2335";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // grid
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
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
      // POIs
      ctx.fillStyle = "#fbbf24";
      [...pois].forEach((p) => {
        const [cx, cy] = p.split(",").map(Number);
        ctx.beginPath();
        ctx.arc(cx * tile + tile / 2, cy * tile + tile / 2, 8, 0, Math.PI * 2);
        ctx.fill();
      });
      // rover
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.roundRect(
        rover.x * tile + 10,
        rover.y * tile + 10,
        tile - 20,
        tile - 20,
        10
      );
      ctx.fill();
      // HUD
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.font = "12px system-ui";
      ctx.fillText(
        "Use arrows to drive the rover. Hit yellow markers to unlock a real photo.",
        12,
        18
      );
    }
    draw();

    async function onUnlock() {
      try {
        const r = await fetch("/api/mars-latest");
        const j = await r.json();
        if (j.photo)
          setModal({
            img: j.photo.img_src,
            date: j.photo.earth_date,
            camera: j.photo.camera,
          });
      } catch {}
    }

    const keys = new Set();
    const handler = async (e) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        return;
      e.preventDefault();
      const prev = { ...rover };
      if (e.key === "ArrowUp" && rover.y > 0) rover.y--;
      if (e.key === "ArrowDown" && rover.y < rows - 1) rover.y++;
      if (e.key === "ArrowLeft" && rover.x > 0) rover.x--;
      if (e.key === "ArrowRight" && rover.x < cols - 1) rover.x++;
      if (prev.x !== rover.x || prev.y !== rover.y) {
        draw();
        const key = `${rover.x},${rover.y}`;
        if (pois.has(key)) {
          pois.delete(key);
          draw();
          await onUnlock();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Mars Rover Explorer</h1>
      <canvas
        ref={canvasRef}
        className="rounded-2xl shadow-lg bg-black w-full max-w-[560px]"
      />
      {modal && (
        <div className="mt-4 bg-white/10 p-4 rounded-xl">
          <div className="font-semibold mb-2">Unlocked Rover Photo 📷</div>
          <div className="text-sm text-gray-300 mb-2">
            {modal.camera} • {modal.date}
          </div>
          <img
            src={modal.img}
            alt="Mars rover"
            className="rounded-lg max-h-[360px] w-auto"
          />
          <button
            onClick={() => setModal(null)}
            className="mt-3 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      )}
    </section>
  );
}
