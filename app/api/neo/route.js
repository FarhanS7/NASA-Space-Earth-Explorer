// app/api/neo/feed/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");

    const today = new Date();
    const toISO = (d) => d.toISOString().slice(0, 10);
    const start = start_date || toISO(today);
    const ed =
      end_date || toISO(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000));

    const key =
      process.env.NASA_API_KEY ||
      process.env.NEXT_PUBLIC_NASA_KEY ||
      "DEMO_KEY";
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${ed}&api_key=${key}`;

    const res = await fetch(url);
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json(
        { error: "NeoWs upstream error", detail: txt },
        { status: 502 }
      );
    }

    const data = await res.json();

    const out = [];
    for (const dateKey of Object.keys(data.near_earth_objects || {})) {
      for (const neo of data.near_earth_objects[dateKey]) {
        const cad =
          (neo.close_approach_data || []).find(
            (c) => c.close_approach_date === dateKey
          ) || (neo.close_approach_data || [])[0];

        const est_diameter_m = (() => {
          const d = neo.estimated_diameter?.meters;
          if (!d) return null;
          return (
            ((d.estimated_diameter_min || 0) +
              (d.estimated_diameter_max || 0)) /
            2
          );
        })();

        out.push({
          id: neo.neo_reference_id,
          name: neo.name,
          is_potentially_hazardous_asteroid:
            !!neo.is_potentially_hazardous_asteroid,
          est_diameter_m,
          close_approach: cad
            ? {
                date: cad.close_approach_date,
                miss_distance_km: Number(
                  cad.miss_distance?.kilometers ||
                    cad.miss_distance?.kilometres ||
                    0
                ),
                rel_velocity_km_s: Number(
                  cad.relative_velocity?.kilometers_per_second || 0
                ),
                orbiting_body: cad.orbiting_body,
              }
            : null,
          nasa_jpl_url: neo.nasa_jpl_url,
        });
      }
    }

    // Sort by closest distance
    out.sort(
      (a, b) =>
        (a.close_approach?.miss_distance_km || Infinity) -
        (b.close_approach?.miss_distance_km || Infinity)
    );

    return NextResponse.json({
      start,
      end: ed,
      count: out.length,
      asteroids: out,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
