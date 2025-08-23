// pages/api/apod-random.js
export default async function handler(req, res) {
  try {
    const key = process.env.NASA_API_KEY || "DEMO_KEY";
    const resp = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${key}&count=1`
    );
    const data = await resp.json();
    const pic = Array.isArray(data) ? data[0] : data;
    if (!pic) return res.status(200).json({ apod: null });
    res.status(200).json({
      apod: {
        url: pic.url,
        title: pic.title,
        date: pic.date,
        explanation: pic.explanation,
      },
    });
  } catch {
    res.status(200).json({ apod: null });
  }
}
