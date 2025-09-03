import express from "express";
import axios from "axios";
import seed from "../data/places.seed.json" with { type: "json" };
function haversineMeters(a, b) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return R * c;
}
const dayKey = (d) => ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d];
function toMin(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function isOpenNow(opening, now = new Date()) {
    const windows = opening[dayKey(now.getDay())];
    const nowM = now.getHours() * 60 + now.getMinutes();
    for (const w of windows) {
        const s = toMin(w.open), e = toMin(w.close);
        if (s <= nowM && nowM <= e)
            return { open: true, closesInMins: e - nowM };
    }
    return { open: false };
}
/** --- Geocoding helpers --- */
function normalizePostcode(raw) {
    // Turn + into space, collapse whitespace, uppercase (keep internal space variant for search)
    return raw.replace(/\+/g, " ").replace(/\s+/g, " ").trim().toUpperCase();
}
function extractOutcode(pc) {
    // e.g. "BN21 4YB" -> "BN21"
    const m = normalizePostcode(pc).match(/^([A-Z]{1,2}\d[A-Z\d]?)/);
    return m ? m[1] : null;
}
async function geocodePostcode(raw) {
    const cleaned = normalizePostcode(raw);
    const nospace = cleaned.replace(/\s/g, "");
    // 1) Exact full postcode (no space)
    try {
        const { data } = await axios.get(`https://api.postcodes.io/postcodes/${encodeURIComponent(nospace)}`, { timeout: 6000 });
        if (data?.result)
            return { lat: data.result.latitude, lon: data.result.longitude };
    }
    catch { }
    // 2) Fuzzy search for full postcode (with q)
    try {
        const { data } = await axios.get("https://api.postcodes.io/postcodes", { params: { q: cleaned, limit: 1 }, timeout: 6000 });
        const hit = data?.result?.[0];
        if (hit)
            return { lat: hit.latitude, lon: hit.longitude };
    }
    catch { }
    // 3) OUTCODE centroid (area like "BN21")
    try {
        const out = extractOutcode(cleaned);
        if (out) {
            const { data } = await axios.get(`https://api.postcodes.io/outcodes/${encodeURIComponent(out)}`, { timeout: 6000 });
            const r = data?.result;
            if (r?.latitude && r?.longitude)
                return { lat: r.latitude, lon: r.longitude };
        }
    }
    catch { }
    // 4) OSM fallback (broad search)
    try {
        const { data } = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: { q: `${cleaned}, UK`, format: "json", limit: 1 },
            headers: { "User-Agent": "nhs-care-finder (learning project)" },
            timeout: 8000
        });
        const hit = Array.isArray(data) ? data[0] : null;
        if (hit?.lat && hit?.lon)
            return { lat: Number(hit.lat), lon: Number(hit.lon) };
    }
    catch { }
    throw new Error(`Postcode not found: ${raw}`);
}
/** --- Router --- */
const router = express.Router();
router.get("/", async (req, res) => {
    const { postcode, lat, lon, type, radius = "10" } = req.query;
    try {
        let origin = null;
        if (postcode) {
            origin = await geocodePostcode(postcode);
        }
        else if (lat && lon) {
            origin = { lat: Number(lat), lon: Number(lon) };
        }
        else {
            return res.status(400).json({ error: "Provide postcode or lat & lon" });
        }
        const rMeters = Number(radius) * 1000;
        const results = seed
            .filter(p => (type ? p.type === type : true))
            .map(p => {
            const distanceMeters = Math.round(haversineMeters(origin, p.location));
            const status = isOpenNow(p.opening);
            return { ...p, distanceMeters, status };
        })
            .filter(p => p.distanceMeters <= rMeters)
            .sort((a, b) => a.distanceMeters - b.distanceMeters);
        res.json({ query: { postcode, lat, lon, type, radius, origin }, count: results.length, results });
    }
    catch (e) {
        console.error("Search error:", e?.response?.status, e?.response?.data || e?.message);
        res.status(400).json({ error: e?.message ?? "Bad request" });
    }
});
// ✅ Sibling route (NOT nested)
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const place = seed.find(p => p.id === id);
    if (!place)
        return res.status(404).json({ error: "Place not found" });
    res.json(place);
});
export default router;
