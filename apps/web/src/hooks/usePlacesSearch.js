// src/hooks/usePlacesSearch.ts
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiGetWithFallback } from "../lib/api";

export function usePlacesSearch() {
  const [, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // ---- SEARCH BY POSTCODE ----
  const searchByPostcode = useCallback(
    async (postcode, radiusKm, type) => {
      setLoading(true);
      setError("");
      setResults([]);
      setExpandedId(null);

      try {
        const params = new URLSearchParams();
        params.set("postcode", postcode);
        params.set("radius", String(radiusKm));
        if (type) params.set("type", type);

        // Automatically add demo flag for local dev OR when running on localhost
        if (import.meta?.env?.DEV || (typeof window !== 'undefined' && window.location.hostname.includes('localhost'))) {
          params.set("demo", "1");
        }

        const { data } = await apiGetWithFallback("/places", params.toString());
        setResults(data.results);
        setExpandedId(data.results?.[0]?.id ?? null);

        const next = { postcode, radius: String(radiusKm) };
        if (type) next.type = type;
        setSearchParams(next, { replace: false });
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || "Search failed");
      } finally {
        setLoading(false);
      }
    },
    [setSearchParams]
  );

  // ---- SEARCH BY COORDINATES ----
  const searchByCoords = useCallback(
    async (lat, lon, radiusKm, type) => {
      setLoading(true);
      setError("");
      setResults([]);
      setExpandedId(null);

      try {
        const params = new URLSearchParams();
        params.set("lat", String(lat));
        params.set("lon", String(lon));
        params.set("radius", String(radiusKm));
        if (type) params.set("type", type);

        // Automatically add demo flag for local dev OR when running on localhost
        if (import.meta?.env?.DEV || (typeof window !== 'undefined' && window.location.hostname.includes('localhost'))) {
          params.set("demo", "1");
        }

        const { data } = await apiGetWithFallback("/places", params.toString());
        setResults(data.results);
        setExpandedId(data.results?.[0]?.id ?? null);

        const next = {
          lat: String(lat),
          lon: String(lon),
          radius: String(radiusKm),
        };
        if (type) next.type = type;
        setSearchParams(next, { replace: false });
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || "Search failed");
      } finally {
        setLoading(false);
      }
    },
    [setSearchParams]
  );

  // ---- RETURN HOOK API ----
  return {
    loading,
    results,
    error,
    expandedId,
    setExpandedId,
    searchByPostcode,
    searchByCoords,
  };
}