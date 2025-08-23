// pages/api/neo-fact.js
export default async function handler(req, res) {
  try {
    const key = process.env.NASA_API_KEY || "DEMO_KEY";
    const resp = await fetch(
      `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${key}`
    );
    const data = await resp.json();
    const list = data?.near_earth_objects || [];
    const pick = list[Math.floor(Math.random() * list.length)];
    const fact = pick
      ? `Asteroid ${
          pick.name
        } has est. diameter ${pick.estimated_diameter?.meters?.estimated_diameter_max?.toFixed(
          0
        )} m and is ${
          pick.is_potentially_hazardous_asteroid
            ? "potentially hazardous"
            : "not hazardous"
        }.`
      : "Space is big. Really big.";
    res.status(200).json({ fact });
  } catch (e) {
    res.status(200).json({ fact: "NASA NeoWs is busy. Fun fact coming soon!" });
  }
}
