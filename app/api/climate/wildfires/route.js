// app/api/climate/wildfires/route.js
const EONET_URL =
  "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=wildfires";

export async function GET() {
  try {
    const res = await fetch(EONET_URL, { next: { revalidate: 600 } });
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
        .filter(
          (p) =>
            p.coords &&
            Number.isFinite(p.coords[0]) &&
            Number.isFinite(p.coords[1])
        );
    });

    return Response.json({ data });
  } catch (e) {
    console.error("wildfires route error", e);
    return Response.json({ data: [] }, { status: 200 });
  }
}
