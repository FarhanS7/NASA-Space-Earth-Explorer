// app/api/reverse-geocode/route.js - Fixed
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  // Validate parameters
  if (!lat || !lon || isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
    return new Response(JSON.stringify({ error: "Invalid coordinates" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Use Nominatim for reverse geocoding with proper headers
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          "User-Agent": "NASA-Space-App/1.0 (your-email@example.com)",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.display_name) {
      return new Response(
        JSON.stringify({
          display_name: data.display_name,
          address: data.address,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Location not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return new Response(JSON.stringify({ error: "Reverse geocoding failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
