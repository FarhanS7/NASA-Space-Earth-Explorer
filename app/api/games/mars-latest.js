// pages/api/mars-latest.js
export default async function handler(req, res) {
  try {
    const key = process.env.NASA_API_KEY || "DEMO_KEY";
    const response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${key}`
    );
    const data = await response.json();
    const photos = data?.latest_photos || [];

    if (photos.length === 0) return res.status(200).json({ photo: null });

    // pick random photo
    const pic = photos[Math.floor(Math.random() * photos.length)];
    res.status(200).json({
      photo: {
        img_src: pic.img_src,
        earth_date: pic.earth_date,
        camera: pic.camera.full_name,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(200).json({ photo: null });
  }
}
