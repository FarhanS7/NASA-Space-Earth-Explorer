// components/NeoTracker.jsx
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export default function NeoTracker({ onHighlight }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPHAOnly, setShowPHAOnly] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/neo/feed`)
      .then((r) => r.json())
      .then((json) => {
        if (mounted) setData(json);
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setData({ error: err.message });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  // Build scene hints: deterministic angle from id + radius scaled into scene units
  const buildHint = (a) => {
    const idNum =
      Number(a.id) || a.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    const angle = (idNum % 360) * (Math.PI / 180);
    const rkm = a.close_approach?.miss_distance_km || 4e5; // default if missing
    const scale = 1e5; // 1 unit = 100k km => tune to fit scene
    const pos = {
      x: Math.cos(angle) * (rkm / scale),
      y: Math.sin(angle) * (rkm / scale),
      z: 0,
    };
    return {
      ...a,
      relVelKmS: a.close_approach?.rel_velocity_km_s,
      pha: a.is_potentially_hazardous_asteroid,
      scenePosition: pos,
    };
  };

  useEffect(() => {
    if (data?.asteroids) {
      // send a list of hints to 3D scene
      const hints = data.asteroids.map(buildHint);
      window.dispatchEvent(
        new CustomEvent("neo:loaded", { detail: { asteroids: hints } })
      );
    }
  }, [data]);

  if (loading) return <div className="p-4">Loading asteroids…</div>;
  if (!data) return <div className="p-4 text-red-500">No data</div>;
  if (data.error)
    return <div className="p-4 text-red-500">Error: {data.error}</div>;

  const asteroids = (data.asteroids || []).filter(
    (a) => !showPHAOnly || a.is_potentially_hazardous_asteroid
  );

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle>Asteroid Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">
            Window: {data.start} → {data.end} • {asteroids.length} objects
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">PHAs only</span>
            <Switch checked={showPHAOnly} onCheckedChange={setShowPHAOnly} />
          </div>
        </div>

        <div className="max-h-[40vh] overflow-auto space-y-2">
          {asteroids.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between p-2 rounded border"
            >
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-muted-foreground">
                  {a.close_approach?.date} •{" "}
                  {a.close_approach?.miss_distance_km
                    ? `${Math.round(
                        a.close_approach.miss_distance_km
                      ).toLocaleString()} km`
                    : "N/A"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {a.is_potentially_hazardous_asteroid && (
                  <span className="text-red-500 text-sm">PHA</span>
                )}
                <Button
                  size="sm"
                  onClick={() => {
                    const hint = buildHint(a);
                    window.dispatchEvent(
                      new CustomEvent("neo:highlight", { detail: hint })
                    );
                    onHighlight && onHighlight(hint);
                  }}
                >
                  Highlight
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(a.nasa_jpl_url, "_blank")}
                >
                  JPL
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
