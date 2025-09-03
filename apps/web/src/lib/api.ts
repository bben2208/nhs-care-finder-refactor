import axios from "axios";

export const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/+$/, "");

// helpful debug: visible in browser console
// @ts-ignore
window.__API_BASE = API_BASE;
console.info("[CFG] API_BASE =", API_BASE);

export const api = axios.create({ baseURL: API_BASE });