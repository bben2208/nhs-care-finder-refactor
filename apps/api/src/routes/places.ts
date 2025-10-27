// apps/api/src/routes/places.ts
import { Router } from "express";
import axios from "axios";

const router = Router();

// Very small helper
function toNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

type Place = {
  id: string;
  name: string;
  type: "gp" | "walk-in" | "utc" | "ae";
  distanceMeters: number;
  status: { open: boolean; closesInMins?: number };
  location: { lat: number; lon: number };
  address?: string;
  phone?: string;
  website?: string;
  opening: {
    mon: { open: string; close: string }[];
    tue: { open: string; close: string }[];
    wed: { open: string; close: string }[];
    thu: { open: string; close: string }[];
    fri: { open: string; close: string }[];
    sat: { open: string; close: string }[];
    sun: { open: string; close: string }[];
  };
  features?: { xray?: boolean; wheelchair?: boolean; parking?: boolean };
  waitMinutes?: number;
};

// dumb opening-hours placeholder
const EMPTY_OPENING = {
  mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
} as Place["opening"];

// map OSM tags to your type
function mapAmenityToType(a?: string): Place["type"] {
  switch (a) {
    case "hospital": return "ae";           // closest match for now
    case "urgent_care": return "utc";
    case "clinic": return "walk-in";
    case "doctors": return "gp";
    default: return "walk-in";
  }
}

// haversine distance in meters
function distanceMeters(a: {lat:number; lon:number}, b: {lat:number; lon:number}) {
  const R = 6371000;
  const toRad = (x:number) => x * Math.PI/180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const la1 = toRad(a.lat);
  const la2 = toRad(b.lat);
  const s =
    Math.sin(dLat/2)**2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

async function geocodePostcode(postcode: string) {
  const url = "https://nominatim.openstreetmap.org/search";
  const { data } = await axios.get(url, {
    params: { q: postcode, format: "json", addressdetails: 1, limit: 1 },
    headers: { "User-Agent": "nhs-care-finder/1.0 (demo)" },
    timeout: 10000,
  });
  const hit = Array.isArray(data) ? data[0] : undefined;
  if (!hit) throw new Error("Postcode not found");
  return { lat: Number(hit.lat), lon: Number(hit.lon) };
}

async function queryOverpass(lat: number, lon: number, radiusKm: number, type?: string) {
  const radiusM = Math.max(100, Math.min(50000, Math.round(radiusKm * 1000)));

  // Build amenity filter
  // If `type` provided, narrow the amenity list
  let amenities = ["hospital", "urgent_care", "clinic", "doctors"];
  if (type) {
    const map: Record<string,string[]> = {
      ae: ["hospital"],
      utc: ["urgent_care"],
      "walk-in": ["clinic"],
      gp: ["doctors"],
    };
    amenities = map[type] ?? amenities;
  }

  const overpassQL = `
    [out:json][timeout:25];
    (
      ${amenities.map(a => `node["amenity"="${a}"](around:${radiusM},${lat},${lon});`).join("\n")}
      ${amenities.map(a => `way["amenity"="${a}"](around:${radiusM},${lat},${lon});`).join("\n")}
      ${amenities.map(a => `relation["amenity"="${a}"](around:${radiusM},${lat},${lon});`).join("\n")}
    );
    out center tags;
  `.trim();

  const { data } = await axios.post("https://overpass-api.de/api/interpreter", overpassQL, {
    headers: { "Content-Type": "text/plain", "User-Agent": "nhs-care-finder/1.0 (demo)" },
    timeout: 25000,
  });

  const elements: any[] = data?.elements ?? [];
  return elements;
}

router.get("/", async (req, res) => {
  try {
    const postcode = (req.query.postcode as string | undefined)?.trim();
    const latQ = toNumber(req.query.lat);
    const lonQ = toNumber(req.query.lon);
    const radiusKm = toNumber(req.query.radius) ?? 10;
    const type = (req.query.type as string | undefined)?.trim() as Place["type"] | undefined;

    if (!postcode && (latQ == null || lonQ == null)) {
      return res.status(400).json({ error: "Provide either 'postcode' or both 'lat' and 'lon'." });
    }

    // Resolve coordinates
    const origin = postcode ? await geocodePostcode(postcode) : { lat: latQ!, lon: lonQ! };

    // Fetch real places
    const osm = await queryOverpass(origin.lat, origin.lon, radiusKm, type);

    const places: Place[] = osm.map((el, i) => {
      const center = el.type === "node"
        ? { lat: el.lat, lon: el.lon }
        : (el.center ?? { lat: origin.lat, lon: origin.lon });

      const name = el.tags?.name || el.tags?.["name:en"] || "Unnamed facility";
      const amenity = el.tags?.amenity as string | undefined;
      const pType = mapAmenityToType(amenity);

      // simple address
      const addr = [
        el.tags?.["addr:housename"],
        el.tags?.["addr:housenumber"],
        el.tags?.["addr:street"],
        el.tags?.["addr:city"],
        el.tags?.["addr:postcode"],
      ].filter(Boolean).join(", ");

      const dist = Math.round(distanceMeters(origin, center));

      return {
        id: `osm-${el.type}-${el.id}`,
        name,
        type: pType,
        distanceMeters: dist,
        status: { open: true },          // could be improved by parsing opening_hours
        location: { lat: center.lat, lon: center.lon },
        address: addr || undefined,
        phone: el.tags?.phone || el.tags?.contact_phone || undefined,
        website: el.tags?.website || el.tags?.contact_website || undefined,
        opening: EMPTY_OPENING,
        features: {
          wheelchair: el.tags?.wheelchair === "yes",
          parking: Boolean(el.tags?.parking || el.tags?.["parking:lane"] || el.tags?.["amenity:parking"]),
          xray: undefined,
        },
      };
    })
    // Filter again by type (in case multiple amenities were requested)
    .filter(p => !type || p.type === type)
    // Sort by nearest
    .sort((a,b) => a.distanceMeters - b.distanceMeters);

    return res.json({ results: places, debug: { postcode, lat: origin.lat, lon: origin.lon, radius: radiusKm, type } });
  } catch (err: any) {
    console.error("[/places] error:", err?.message || err);
    return res.status(500).json({ error: "Failed to fetch places", details: err?.message });
  }
});

export default router;