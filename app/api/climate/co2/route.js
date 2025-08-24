// app/api/climate/co2/route.js
export async function GET() {
  try {
    const res = await fetch("https://global-warming.org/api/co2-api", {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const rows = Array.isArray(json?.co2) ? json.co2 : [];

    const data = rows
      .map((d) => ({
        date: d.date, // YYYY-MM-DD
        ppm: Number(d.trend),
      }))
      .filter((d) => d.date && Number.isFinite(d.ppm))
      .slice(-360); // ~30 years of monthly data

    return Response.json({ data });
  } catch (e) {
    console.error("co2 route error", e);
    return Response.json({ data: [] }, { status: 200 });
  }
}
