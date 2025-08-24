// app/api/nasa-imagery/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const layer = searchParams.get("layer");
  const year = searchParams.get("year");

  try {
    // In a real implementation, you would use NASA's GIBS API
    // For demo purposes, we'll return a placeholder image

    const placeholderImages = {
      natural:
        "https://placehold.co/600x400/4F46E5/FFFFFF?text=Natural+Color+Imagery",
      urban:
        "https://placehold.co/600x400/7C3AED/FFFFFF?text=Urban+Development",
      vegetation:
        "https://placehold.co/600x400/10B981/FFFFFF?text=Vegetation+Index",
      temperature:
        "https://placehold.co/600x400/F97316/FFFFFF?text=Temperature+Data",
      pollution:
        "https://placehold.co/600x400/3B82F6/FFFFFF?text=Air+Quality+Data",
    };

    // Simulate different years with different filters
    let imageUrl = placeholderImages[layer] || placeholderImages.natural;

    if (year && year < 2015) {
      // Add a "vintage" filter for older years
      imageUrl += "&text=" + encodeURIComponent(`Year: ${year}`);
    }

    return new Response(
      JSON.stringify({
        imageUrl,
        coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
        layer,
        year: year || new Date().getFullYear(),
        source: "NASA GIBS (Global Imagery Browse Services)",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=3600",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch imagery" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
