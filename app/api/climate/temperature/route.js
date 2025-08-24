export async function GET() {
  try {
    const res = await fetch("https://global-warming.org/api/temperature-api", {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const rows = Array.isArray(json?.result) ? json.result : [];

    const data = rows
      .map((d) => ({
        year: d.time, // year as string
        temp: Number(d.station) || Number(d.land) || 0,
      }))
      .filter((d) => d.year && Number.isFinite(d.temp))
      .slice(-140); // last ~140 years

    return Response.json({ data });
  } catch (e) {
    console.error("temperature route error", e);
    return Response.json({ data: [] }, { status: 200 });
  }
}
