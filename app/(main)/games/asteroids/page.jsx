// pages/games/asteroids.js
"use client";
import { useEffect, useRef, useState } from "react";

export default function Asteroids() {
  const canvasRef = useRef(null);
  const [state, setState] = useState({
    running: false,
    gameOver: false,
    fact: "",
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    let width = (canvas.width = Math.min(900, window.innerWidth - 32));
    let height = (canvas.height = Math.min(600, window.innerHeight - 220));

    // scale for DPR
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);

    // game objects
    const player = { x: width / 2, y: height - 60, r: 14, speed: 320, ax: 0 };
    const asteroids = [];
    let spawnTimer = 0;
    let last = performance.now();
    let running = true,
      over = false;

    // input
    const keys = new Set();
    const onDown = (e) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) keys.add(e.key);
    };
    const onUp = (e) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) keys.delete(e.key);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    const onVisibility = () => {
      running = !document.hidden && !over;
    };
    document.addEventListener("visibilitychange", onVisibility);

    function spawn() {
      const size = 10 + Math.random() * 24;
      asteroids.push({
        x: Math.random() * width,
        y: -size,
        r: size,
        vy: 90 + Math.random() * 180,
      });
    }

    function reset() {
      player.x = width / 2;
      player.y = height - 60;
      asteroids.length = 0;
      spawnTimer = 0;
      over = false;
      running = true;
      setState((s) => ({ ...s, running: true, gameOver: false, fact: "" }));
    }

    async function endRound() {
      over = true;
      running = false;
      let fact = "";
      try {
        const resp = await fetch("/api/neo-fact");
        const j = await resp.json();
        fact = j.fact || "";
      } catch {}
      setState({ running: false, gameOver: true, fact });
    }

    function circleHit(ax, ay, ar, bx, by, br) {
      const dx = ax - bx,
        dy = ay - by;
      return dx * dx + dy * dy <= (ar + br) * (ar + br);
    }

    function step(dt) {
      // input
      player.ax = 0;
      if (keys.has("ArrowLeft")) player.ax = -1;
      if (keys.has("ArrowRight")) player.ax = 1;
      player.x += player.ax * player.speed * dt;
      if (player.x < player.r) player.x = player.r;
      if (player.x > width - player.r) player.x = width - player.r;

      // spawn asteroids
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawn();
        spawnTimer = Math.max(0.15, 0.6 - performance.now() / 60000); // faster over time
      }

      // move asteroids
      for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i];
        a.y += a.vy * dt;
        if (circleHit(a.x, a.y, a.r, player.x, player.y, player.r)) {
          endRound();
        }
        if (a.y - a.r > height) asteroids.splice(i, 1);
      }
    }

    function render() {
      ctx.fillStyle = "#05070c";
      ctx.fillRect(0, 0, width, height);

      // stars (cheap)
      ctx.fillStyle = "white";
      for (let i = 0; i < 60; i++)
        ctx.fillRect((i * 73) % width, (i * 37) % height, 1, 1);

      // player
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();

      // asteroids
      ctx.fillStyle = "#f87171";
      asteroids.forEach((a) => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // HUD
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "12px system-ui";
      ctx.fillText("← → to move • avoid red rocks", 12, 18);
    }

    function loop(now) {
      if (!running) {
        last = now;
        return requestAnimationFrame(loop);
      }
      let dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      // fixed stepping for stability
      let stepLeft = dt;
      const fixed = 1 / 60;
      while (stepLeft > 0) {
        const use = Math.min(stepLeft, fixed);
        step(use);
        stepLeft -= use;
      }
      render();
      requestAnimationFrame(loop);
    }

    reset();
    requestAnimationFrame(loop);

    return () => {
      running = false;
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Asteroid Dodger</h1>
      <canvas
        ref={canvasRef}
        className="rounded-2xl shadow-lg bg-black w-full max-w-[900px]"
      />
      {state.gameOver && (
        <div className="mt-4 bg-white/10 p-4 rounded-xl">
          <div className="font-semibold">Game Over 🚫</div>
          <div className="text-sm text-gray-300 mt-1">{state.fact}</div>
          <button
            onClick={() => location.reload()}
            className="mt-3 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
          >
            Play again
          </button>
        </div>
      )}
    </section>
  );
}
