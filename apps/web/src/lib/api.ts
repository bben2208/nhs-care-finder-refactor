import axios from "axios";

export const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/+$/, "");
console.info("[CFG] API_BASE =", API_BASE);

// Log each request URL
const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((cfg) => {
  const full = API_BASE + (cfg.url?.startsWith("/") ? cfg.url : `/${cfg.url ?? ""}`);
  console.info("[HTTP] →", cfg.method?.toUpperCase(), full);
  return cfg;
});

export { api };