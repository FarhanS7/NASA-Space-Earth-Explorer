// app/api/nasa-climate/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dataset = searchParams.get("dataset");
  const country = searchParams.get("country");
  const years = searchParams.get("years");

  try {
    // In a real implementation, you would fetch from NASA's Earthdata API
    // This is a simplified version for demonstration

    // Example endpoint for CO2 data (would need proper authentication)
    // const response = await fetch('https://airs.jpl.nasa.gov/api/v2/data/CO2_MMM');

    // For now, we'll return sample data structure
    const sampleData = generateSampleData(dataset, country, years);

    return new Response(JSON.stringify(sampleData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Failed to fetch NASA climate data:", error);

    // Return sample data as fallback
    const sampleData = generateSampleData(dataset, country, years);

    return new Response(JSON.stringify(sampleData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600",
      },
    });
  }
}

// Generate sample climate data
function generateSampleData(dataset, country, years) {
  const data = [];
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - parseInt(years);

  let baseValue, trend;

  switch (dataset) {
    case "co2":
      baseValue = country === "global" ? 350 : 300;
      trend = 2.5;
      break;
    case "temperature":
      baseValue = country === "global" ? 14.0 : 12.0;
      trend = 0.03;
      break;
    case "rainfall":
      baseValue = country === "global" ? 1000 : 800;
      trend = country === "global" ? -2 : -1;
      break;
    case "sealevel":
      baseValue = 0;
      trend = 3.2;
      break;
    default:
      baseValue = 100;
      trend = 1;
  }

  for (let year = startYear; year <= currentYear; year++) {
    const variability = Math.random() * 10 - 5;
    const value = baseValue + (year - startYear) * trend + variability;

    data.push({ year, value: parseFloat(value.toFixed(2)) });
  }

  return data;
}
