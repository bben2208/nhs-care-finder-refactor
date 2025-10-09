import axios from "axios";
// Resolve API base from Vite env or fallback to legacy proxy
const RAW = import.meta.env?.VITE_API_BASE?.trim?.();
export const API_BASE = RAW && RAW.length > 0 ? RAW.replace(/\/+$/, "") : "/api";
console.info("[CFG] API_BASE =", API_BASE);
export function buildUrl(path, qs) {
    const p = path.startsWith("/") ? path : `/${path}`;
    const q = qs ? (p.includes("?") ? `&${qs}` : `?${qs}`) : "";
    return `${API_BASE}${p}${q}`;
}
export const api = axios.create({ baseURL: API_BASE });
/** GET with graceful fallback to legacy “/api” prefix */
export async function apiGetWithFallback(path, qs) {
    const url = buildUrl(path, qs);
    try {
        return await axios.get(url);
    }
    catch (err) {
        if (API_BASE !== "/api") {
            const p = path.startsWith("/") ? path : `/${path}`;
            const legacy = `/api${p}${qs ? `?${qs}` : ""}`;
            return await axios.get(legacy);
        }
        throw err;
    }
}
