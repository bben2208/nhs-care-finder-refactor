import axios from "axios";

export const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/+$/, "");
console.info("[CFG] API_BASE =", API_BASE);

const api = axios.create({ baseURL: API_BASE });

// Log each request URL
api.interceptors.request.use((cfg) => {
  const full = API_BASE + (cfg.url?.startsWith("/") ? cfg.url : `/${cfg.url ?? ""}`);
  console.info("[HTTP] →", cfg.method?.toUpperCase(), full);
  return cfg;
});

// Helper with fallback: try `/places`, then `/api/places` if 404
export async function apiGetWithFallback(path: string, qs?: string) {
  const url = qs ? `${path}?${qs}` : path;
  try {
    return await api.get(url);
  } catch (err: any) {
    if (err?.response?.status === 404) {
      const alt = qs ? `/api${path}?${qs}` : `/api${path}`;
      console.warn("[HTTP] fallback →", alt);
      return await api.get(alt);
    }
    throw err;
  }
}

export { api };