// app/api/geocode/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  try {
    // Use Nominatim for geocoding (OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}&limit=1`
    );

    const data = await response.json();

    if (data && data.length > 0) {
      return new Response(
        JSON.stringify({
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          display_name: data[0].display_name,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Location not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Geocoding failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
