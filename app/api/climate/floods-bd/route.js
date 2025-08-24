// app/api/climate/floods-bd/route.js
const EONET_FLOODS =
  "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=floods";

// Rough Bangladesh bbox
const BBOX = {
  minLat: 20.6,
  maxLat: 26.7,
  minLon: 88.0,
  maxLon: 92.7,
};

function inBbox([lat, lon]) {
  return (
    lat >= BBOX.minLat &&
    lat <= BBOX.maxLat &&
    lon >= BBOX.minLon &&
    lon <= BBOX.maxLon
  );
}

export async function GET() {
  try {
    const res = await fetch(EONET_FLOODS, { next: { revalidate: 600 } });
    const json = await res.json();
    const events = Array.isArray(json?.events) ? json.events : [];

    const data = events.flatMap((ev) => {
      const title = ev.title;
      const id = ev.id;
      const geometries = ev.geometries || [];
      return geometries
        .map((g) => ({
          id,
          title,
          date: g.date,
          coords: Array.isArray(g.coordinates)
            ? g.coordinates.slice().reverse()
            : null, // [lat, lon]
        }))
        .filter((p) => p.coords && inBbox(p.coords));
    });

    return Response.json({ data });
  } catch (e) {
    console.error("floods-bd route error", e);
    return Response.json({ data: [] }, { status: 200 });
  }
}
