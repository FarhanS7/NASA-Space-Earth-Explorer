import fetch from "node-fetch";

export async function GET() {
  try {
    const key = process.env.NASA_API_KEY || "DEMO_KEY";
    const response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${key}`
    );
    const data = await response.json();
    const photos = data?.latest_photos || [];

    if (photos.length === 0)
      return new Response(JSON.stringify({ photo: null }), { status: 200 });

    const pic = photos[Math.floor(Math.random() * photos.length)];

    return new Response(
      JSON.stringify({
        photo: {
          img_src: pic.img_src,
          earth_date: pic.earth_date,
          camera: pic.camera.full_name,
        },
      }),
      { status: 200 }
    );
  } catch (e) {
    console.error("Mars API error:", e);
    return new Response(JSON.stringify({ photo: null }), { status: 200 });
  }
}
