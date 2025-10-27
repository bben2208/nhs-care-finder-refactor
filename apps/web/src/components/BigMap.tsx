import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Place } from "../hooks/usePlacesSearch";

/** Imperatively recenter when `center` changes */
function CenterSetter({ center }: { center?: { lat: number; lon: number } }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      const z = map.getZoom();
      map.setView([center.lat, center.lon], z, { animate: true });
    }
  }, [center, map]);
  return null;
}

/** Fit bounds helper — runs once on mount or when bounds identity changes */
function FitBounds({ bounds }: { bounds: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!bounds || bounds.length === 0) return;
    if (bounds.length === 1) {
      map.setView(bounds[0], Math.max(map.getZoom(), 12), { animate: true });
    } else {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, bounds]);
  return null;
}

const TYPE_ICON: Record<Place["type"], string> = {
  gp: "🩺",
  "walk-in": "🚶",
  utc: "🏥",
  ae: "🚑",
};

type Props = {
  results: Place[];
  /** Preferred center (e.g. from geolocation) */
  center?: { lat: number; lon: number };
};

export default function BigMap({ results, center }: Props) {
  // initial center: explicit center -> first result -> London fallback
  const initialCenter: [number, number] = center
    ? [center.lat, center.lon]
    : results[0]
    ? [results[0].location.lat, results[0].location.lon]
    : [51.509, -0.118];

  const bounds =
    results.length > 0
      ? (results.map((r) => [r.location.lat, r.location.lon]) as [number, number][])
      : undefined;

  return (
    <MapContainer
      center={initialCenter}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
      />

      {/* Recenter when the `center` prop changes */}
      <CenterSetter center={center} />

      {/* If we have multiple results, fit bounds on mount */}
      {bounds && results.length > 1 && <FitBounds bounds={bounds} />}

      {results.map((r) => (
        <Marker key={r.id} position={[r.location.lat, r.location.lon]}>
          <Popup>
            <div style={{ fontWeight: 600 }}>
              {TYPE_ICON[r.type]} {r.name}
            </div>
            <div style={{ fontSize: 12 }}>
              {(r.distanceMeters / 1000).toFixed(1)} km
              {r.waitMinutes != null ? ` · wait ${r.waitMinutes}m` : ""}
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${r.location.lat},${r.location.lon}`}
              target="_blank"
              rel="noreferrer"
            >
              Directions
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}