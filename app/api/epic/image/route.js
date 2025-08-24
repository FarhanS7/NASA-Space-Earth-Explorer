export const dynamic = "force-dynamic";

// /api/epic/image?date=YYYY-MM-DD&name=<imageName>
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = (searchParams.get("date") || "").trim();
  const name = (searchParams.get("name") || "").trim();
  const key = process.env.NASA_API_KEY || "DEMO_KEY";

  if (!date || !name) return new Response("Bad request", { status: 400 });

  const path = date.replaceAll("-", "/");
  // EPIC archive supports png/jpg; png is crisp and looks great on globe
  const upstream = `https://epic.gsfc.nasa.gov/archive/natural/${path}/png/${name}.png?api_key=${key}`;

  try {
    const res = await fetch(upstream, { cache: "no-store" });
    if (!res.ok) return new Response("Image not found", { status: 404 });

    const buf = await res.arrayBuffer();
    return new Response(buf, {
      headers: {
        "content-type": "image/png",
        "cache-control": "no-cache",
        "access-control-allow-origin": "*",
      },
    });
  } catch (e) {
    return new Response("Upstream error", { status: 500 });
  }
}
