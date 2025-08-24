// app/api/nasa-eonet/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || 50;

  try {
    // Try to fetch from NASA EONET API
    const response = await fetch(
      `https://eonet.gsfc.nasa.gov/api/v3/events?limit=${limit}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`NASA EONET API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300",
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch from NASA EONET, using fallback data:",
      error
    );

    // Fallback data for demo purposes
    const fallbackData = {
      events: [
        {
          id: "test-wildfire-1",
          title: "Wildfire in California",
          categories: [{ id: "wildfires", title: "Wildfires" }],
          geometry: [
            {
              date: new Date().toISOString(),
              coordinates: [-121.5, 38.5], // California coordinates
            },
          ],
          sources: [{ url: "https://www.nasa.gov" }],
        },
        {
          id: "test-storm-1",
          title: "Tropical Storm in Atlantic",
          categories: [{ id: "severeStorms", title: "Severe Storms" }],
          geometry: [
            {
              date: new Date().toISOString(),
              coordinates: [-60.0, 25.0], // Atlantic coordinates
            },
          ],
          sources: [{ url: "https://www.nasa.gov" }],
        },
      ],
    };

    return new Response(JSON.stringify(fallbackData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300",
      },
    });
  }
}
