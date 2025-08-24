// app/api/nasa-epic-dates/route.js
export async function GET() {
  try {
    const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
    const response = await fetch(
      `https://epic.gsfc.nasa.gov/api/natural/all?api_key=${apiKey}`
    );

    if (!response.ok) {
      return new Response("Failed to fetch available dates", {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const datesData = await response.json();
    // Extract just the date strings from the response
    const availableDates = datesData.map((item) => item.date);

    return new Response(JSON.stringify(availableDates), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=86400", // Cache for 24 hours
      },
    });
  } catch (error) {
    return new Response("Failed to fetch available dates", {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
