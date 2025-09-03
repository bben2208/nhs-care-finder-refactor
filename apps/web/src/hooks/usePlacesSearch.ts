import { useCallback, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export type OpeningWindow = { open: string; close: string };
export type Opening = {
  mon: OpeningWindow[]; tue: OpeningWindow[]; wed: OpeningWindow[];
  thu: OpeningWindow[]; fri: OpeningWindow[]; sat: OpeningWindow[]; sun: OpeningWindow[];
};

export type Place = {
  id: string;
  name: string;
  type: "gp" | "walk-in" | "utc" | "ae";
  distanceMeters: number;
  status: { open: boolean; closesInMins?: number };
  location: { lat: number; lon: number };
  address?: string;
  phone?: string;
  website?: string;
  opening: Opening;
  features?: { xray?: boolean; wheelchair?: boolean; parking?: boolean };
  waitMinutes?: number;
};

export function usePlacesSearch() {
  const [, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Place[]>([]);
  const [error, setError] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const searchByPostcode = useCallback(async (postcode: string, radiusKm: number, type?: string) => {
    setLoading(true); setError(""); setResults([]); setExpandedId(null);
    try {
      const params = new URLSearchParams();
      params.set("postcode", postcode);
      params.set("radius", String(radiusKm));
      if (type) params.set("type", type);
      const { data } = await axios.get(`/api/places?${params.toString()}`);
      setResults(data.results);
      setExpandedId(data.results?.[0]?.id ?? null);
      const next: Record<string,string> = { postcode, radius: String(radiusKm) };
      if (type) next.type = type;
      setSearchParams(next, { replace: false });
    } catch (e: any) {
      setError(e?.response?.data?.error || "Search failed");
    } finally { setLoading(false); }
  }, [setSearchParams]);

  const searchByCoords = useCallback(async (lat: number, lon: number, radiusKm: number, type?: string) => {
    setLoading(true); setError(""); setResults([]); setExpandedId(null);
    try {
      const params = new URLSearchParams();
      params.set("lat", String(lat));
      params.set("lon", String(lon));
      params.set("radius", String(radiusKm));
      if (type) params.set("type", type);
      const { data } = await axios.get(`/api/places?${params.toString()}`);
      setResults(data.results);
      setExpandedId(data.results?.[0]?.id ?? null);
      const next: Record<string,string> = { lat: String(lat), lon: String(lon), radius: String(radiusKm) };
      if (type) next.type = type;
      setSearchParams(next, { replace: false });
    } catch (e: any) {
      setError(e?.response?.data?.error || "Search failed");
    } finally { setLoading(false); }
  }, [setSearchParams]);

  return {
    loading, results, error, expandedId, setExpandedId,
    searchByPostcode, searchByCoords
  };
}