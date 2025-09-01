import express from "express";
import axios from "axios";
import seed from "../data/places.seed.json" with { type: "json" };

type LatLon = { lat: number; lon: number };

function haversineMeters(a: LatLon, b: LatLon): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

type Window = { open: string; close: string };
type Opening = {
  mon: Window[]; tue: Window[]; wed: Window[];
  thu: Window[]; fri: Window[]; sat: Window[]; sun: Window[];
};
const dayKey = (d: number): keyof Opening =>
  (["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d] as keyof Opening);

function toMin(t: string) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function isOpenNow(opening: Opening, now = new Date()) {
  const windows = opening[dayKey(now.getDay())];
  const nowM = now.getHours() * 60 + now.getMinutes();
  for (const w of windows) {
    const s = toMin(w.open), e = toMin(w.close);
    if (s <= nowM && nowM <= e) return { open: true, closesInMins: e - nowM };
  }
  return { open: false as const };
}

/** --- Geocoding helpers --- */
function normalizePostcode(raw: string): string {
  // Turn + into space, collapse whitespace, uppercase (keep internal space variant for search)
  return raw.replace(/\+/g, " ").replace(/\s+/g, " ").trim().toUpperCase();
}
function extractOutcode(pc: string): string | null {
  // e.g. "BN21 4YB" -> "BN21"
  const m = normalizePostcode(pc).match(/^([A-Z]{1,2}\d[A-Z\d]?)/);
  return m ? m[1] : null;
}

async function geocodePostcode(raw: string): Promise<LatLon> {
  const cleaned = normalizePostcode(raw);
  const nospace = cleaned.replace(/\s/g, "");

  // 1) Exact full postcode (no space)
  try {
    const { data } = await axios.get(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(nospace)}`,
      { timeout: 6000 }
    );
    if (data?.result) return { lat: data.result.latitude, lon: data.result.longitude };
  } catch {}

  // 2) Fuzzy search for full postcode (with q)
  try {
    const { data } = await axios.get(
      "https://api.postcodes.io/postcodes",
      { params: { q: cleaned, limit: 1 }, timeout: 6000 }
    );
    const hit = data?.result?.[0];
    if (hit) return { lat: hit.latitude, lon: hit.longitude };
  } catch {}

  // 3) OUTCODE centroid (area like "BN21")
  try {
    const out = extractOutcode(cleaned);
    if (out) {
      const { data } = await axios.get(
        `https://api.postcodes.io/outcodes/${encodeURIComponent(out)}`,
        { timeout: 6000 }
      );
      const r = data?.result;
      if (r?.latitude && r?.longitude) return { lat: r.latitude, lon: r.longitude };
    }
  } catch {}

  // 4) OSM fallback (broad search)
  try {
    const { data } = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: { q: `${cleaned}, UK`, format: "json", limit: 1 },
        headers: { "User-Agent": "nhs-care-finder (learning project)" },
        timeout: 8000
      }
    );
    const hit = Array.isArray(data) ? data[0] : null;
    if (hit?.lat && hit?.lon) return { lat: Number(hit.lat), lon: Number(hit.lon) };
  } catch {}

  throw new Error(`Postcode not found: ${raw}`);
}

/** --- Router --- */
const router = express.Router();

router.get("/", async (req, res) => {
  const { postcode, lat, lon, type, radius = "10" } = req.query as Record<string, string>;
  try {
    let origin: LatLon | null = null;

    if (postcode) {
      origin = await geocodePostcode(postcode);
    } else if (lat && lon) {
      origin = { lat: Number(lat), lon: Number(lon) };
    } else {
      return res.status(400).json({ error: "Provide postcode or lat & lon" });
    }

    const rMeters = Number(radius) * 1000;

    const results = (seed as any[])
      .filter(p => (type ? p.type === type : true))
      .map(p => {
        const distanceMeters = Math.round(haversineMeters(origin!, p.location));
        const status = isOpenNow(p.opening);
        return { ...p, distanceMeters, status };
      })
      .filter(p => p.distanceMeters <= rMeters)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    res.json({ query: { postcode, lat, lon, type, radius, origin }, count: results.length, results });
  } catch (e: any) {
    console.error("Search error:", e?.response?.status, e?.response?.data || e?.message);
    res.status(400).json({ error: e?.message ?? "Bad request" });
  }
});

// ✅ Sibling route (NOT nested)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const place = (seed as any[]).find(p => p.id === id);
  if (!place) return res.status(404).json({ error: "Place not found" });
  res.json(place);
});

export default router;