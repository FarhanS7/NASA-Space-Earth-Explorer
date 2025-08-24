// app/api/nasa-epic/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  // Use demo key or your NASA API key
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";

  try {
    // Fetch available images for the selected date
    const response = await fetch(
      `https://epic.gsfc.nasa.gov/api/natural/date/${date}?api_key=${apiKey}`
    );

    if (!response.ok) {
      return new Response("NASA EPIC API error", {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    return new Response("Failed to fetch NASA data", {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
