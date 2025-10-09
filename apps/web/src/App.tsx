import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { useFavourites } from "./hooks/useFavourites";
import { usePlacesSearch } from "./hooks/usePlacesSearch";
import useFiltersAndSort, { type Filters, type SortKey } from "./hooks/useFiltersAndSort";
import { useDirectionsUrl } from "./hooks/useDirectionsUrl";
import { useThemeTokens } from "./hooks/useThemeTokens";

import Layout from "./components/Layout";
import SearchForm from "./components/SearchForm";
import Tabs from "./components/Tabs";
import BigMap from "./components/BigMap";
import ResultList from "./components/ResultList";

// Chatbot (named export from features/chatbot/index.ts)
import { Chatbot } from "./features/chatbot";

export default function App() {
  const [searchParams] = useSearchParams();

  // persisted prefs
  const [postcode, setPostcode] = useLocalStorage<string>("pc", "BN21");
  const [type, setType] = useLocalStorage<string>("type", "");
  const [radius, setRadius] = useLocalStorage<number>("rad", 10);
  const [dark, setDark] = useLocalStorage<boolean>("dark", false);

  const [filters, setFilters] = useState<Filters>({
    open: false, wheelchair: false, parking: false, xray: false, fav: false
  });
  const [tab, setTab] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState<SortKey>("nearest");

  // ⬇️ Hold the preferred map center (e.g., from geolocation)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number } | undefined>(undefined);

  const { isFav, toggleFav } = useFavourites();
  const {
    loading, results, error, expandedId, setExpandedId,
    searchByPostcode, searchByCoords
  } = usePlacesSearch();

  const { toDirections } = useDirectionsUrl();
  const { bg, fg, sub, card, border } = useThemeTokens(dark);

  // seed state from URL on first load
  useEffect(() => {
    const pc = searchParams.get("postcode");
    const ty = searchParams.get("type");
    const radStr = searchParams.get("radius");
    if (pc) setPostcode(pc);
    if (ty !== null) setType(ty);
    if (radStr) {
      const r = Number(radStr);
      if (!Number.isNaN(r) && r > 0) setRadius(r);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear any mapCenter set by geolocation so the map recenters to first result
    setMapCenter(undefined);
    searchByPostcode(postcode.trim(), radius, type || undefined);
  };

  const useMyLocation = () => {
    // HTTPS or localhost required
    const isLocalhost = location.hostname === "localhost";
    if (location.protocol !== "https:" && !isLocalhost) {
      alert("Geolocation needs HTTPS (or http://localhost). Open the site on HTTPS or localhost.");
      return;
    }
    if (!navigator.geolocation) {
      alert("This browser doesn’t support geolocation.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // 1) Optimistically recenter map right away
        setMapCenter({ lat: latitude, lon: longitude });

        // 2) Then fetch places; ensure a sensible radius for coords search
        const r = Math.max(radius || 0, 5);
        if (r !== radius) setRadius(r);
        searchByCoords(latitude, longitude, r, type || undefined);
      },
      (err) => {
        console.warn("[GEO] error", err);
        alert(
          err.code === err.PERMISSION_DENIED
            ? "Location permission was denied. Allow it in site settings and try again."
            : err.code === err.POSITION_UNAVAILABLE
            ? "Location unavailable. Check network/GPS and try again."
            : err.code === err.TIMEOUT
            ? "Getting your location timed out. Try again."
            : "Couldn’t get your location."
        );
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 30000 }
    );
  };

  // Filter/sort as before, then cap to 4 in the LIST (map can still show all)
  const filteredSorted = useFiltersAndSort(results, filters, sortBy, isFav);
  const top4 = filteredSorted.slice(0, 4);

  return (
    <Layout dark={dark} toggleDark={() => setDark(d => !d)} fg={fg} border={border} bg={bg}>
      <SearchForm
        postcode={postcode} setPostcode={setPostcode}
        type={type} setType={setType}
        radius={radius} setRadius={setRadius}
        filters={filters} setFilters={setFilters}
        sortBy={sortBy} setSortBy={setSortBy}
        loading={loading}
        onSearch={onSearch}
        useMyLocation={useMyLocation}
        border={border} card={card} fg={fg} sub={sub} dark={dark}
      />

      <Tabs value={tab} onChange={setTab} border={border} card={card} fg={fg} />

      {tab === "list" ? (
        <ResultList
          results={top4}                 // <= show only top 4 in the list
          loading={loading}
          error={error || undefined}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          isFav={isFav}
          toggleFav={toggleFav}
          toDirections={toDirections}
          border={border} card={card} fg={fg} sub={sub} dark={dark}
        />
      ) : (
        <div style={{ marginTop: 16, height: 420, borderRadius: 12, overflow: "hidden", border: `1px solid ${border}` }}>
          <BigMap
            results={filteredSorted}     // map shows full set (swap to top4 if you want symmetry)
            center={mapCenter}           // <= recenter as soon as geolocation resolves
          />
        </div>
      )}

      <p style={{ fontSize: 12, color: sub, marginTop: 20 }}>
        Info only — not medical advice. In emergencies call 999. For advice use NHS 111 online.
      </p>

      <Chatbot border={border} card={card} fg={fg} sub={sub} />
    </Layout>
  );
}