// components/InfoPanel.jsx
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InfoPanel({ asteroid, onOpenJpl }) {
  if (!asteroid) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asteroid Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Click a marker or "Highlight" an asteroid to view details here.
          </div>
        </CardContent>
      </Card>
    );
  }

  const dkm = asteroid.close_approach?.miss_distance_km ?? null;
  const vel = asteroid.close_approach?.rel_velocity_km_s ?? null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{asteroid.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          Potentially Hazardous:{" "}
          {asteroid.is_potentially_hazardous_asteroid ? "Yes" : "No"}
        </div>
        <div className="text-sm">
          Estimated diameter:{" "}
          {asteroid.est_diameter_m
            ? `${Math.round(asteroid.est_diameter_m)} m`
            : "N/A"}
        </div>
        <div className="text-sm">
          Miss distance:{" "}
          {dkm ? `${Math.round(dkm).toLocaleString()} km` : "N/A"}
        </div>
        <div className="text-sm">
          Relative speed: {vel ? `${Number(vel).toFixed(2)} km/s` : "N/A"}
        </div>
        <div className="flex gap-2 mt-2">
          <Button onClick={() => onOpenJpl && onOpenJpl(asteroid.nasa_jpl_url)}>
            Open JPL page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
