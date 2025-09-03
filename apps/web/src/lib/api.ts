import axios from "axios";

export const API_BASE =
  (import.meta.env.VITE_API_BASE ?? "").replace(/\/+$/, ""); // trim trailing /

export const api = axios.create({
  baseURL: API_BASE, // e.g. https://nhs-care-finder-api.onrender.com
});