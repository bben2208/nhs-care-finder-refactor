// apps/web/src/components/ResultCard.tsx
import type { Place } from "../hooks/usePlacesSearch";

type Props = {
  place: Place;
  expanded: boolean;
  onToggle: () => void;
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => void;
  toDirections: (lat: number, lon: number) => string;
  border: string; card: string; fg: string; sub: string; dark: boolean;
};

export default function ResultCard({
  place, expanded, onToggle, isFav, toggleFav, toDirections, border, card, fg, sub, dark,
}: Props) {
  const title =
    place.name?.trim() ||
    place.address?.trim() ||
    (place.location
      ? `Around ${Number(place.location.lat).toFixed(6)},${Number(place.location.lon).toFixed(6)}`
      : "Unknown location");

  const typeLabel = {
    gp: "GP",
    "walk-in": "Walk-in",
    utc: "Urgent Treatment Centre",
    ae: "A&E",
  }[place.type] ?? place.type;

  const distanceKm = (place.distanceMeters ?? 0) / 1000;

  return (
    <li
      role="listitem"
      style={{
        border: `1px solid ${border}`,
        borderRadius: 12,
        background: card,
        color: fg,
        padding: 12,
      }}
    >
      {/* header row */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", paddingRight: 20 }}>
        <button
          onClick={() => toggleFav(place.id)}
          aria-pressed={isFav(place.id)}
          title={isFav(place.id) ? "Remove from favourites" : "Add to favourites"}
          style={{
            border: `1px solid ${border}`,
            background: dark ? "#0f172a" : "#f3f4f6",
            color: fg,
            borderRadius: 8,
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          {isFav(place.id) ? "★" : "☆"}
        </button>

        <button
          onClick={onToggle}
          aria-expanded={expanded}
          style={{
            flex: 1,
            textAlign: "left",
            background: "transparent",
            border: "none",
            color: fg,
            cursor: "pointer",
            padding: 0,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {/* VISIBLE TITLE — not encoded */}
          {title}
        </button>

        {/* status pill */}
        <span
          style={{
            
            marginRight: "20px", // ✅ Added
            fontSize: 12,
            padding: "2px 8px",
            borderRadius: 999,
            border: `1px solid ${place.status.open ? "#16a34a" : border}`,
            background: place.status.open ? (dark ? "#052e16" : "#e6ffed") : "transparent",
            color: place.status.open ? (dark ? "#86efac" : "#166534") : sub,
          }}
        >
          {place.status.open
            ? `Open${place.status.closesInMins ? ` · closes in ${place.status.closesInMins}m` : ""}`
            : "Closed"}
        </span>
      </div>

      {/* subline */}
      <div style={{ marginTop: 6, color: sub, fontSize: 13 }}>
        {typeLabel} · {distanceKm.toFixed(1)} km
        {place.waitMinutes != null ? ` · Est. wait: ${place.waitMinutes}m` : ""}
      </div>

      {/* details */}
      {expanded && (
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          {place.address && (
            <div>
              <strong>Address:</strong>{" "}
              <span>{place.address}</span>
            </div>
          )}
          {place.phone && (
            <div>
              <strong>Call:</strong>{" "}
              <a href={`tel:${place.phone}`} style={{ color: "#16a34a" }}>
                {place.phone}
              </a>
            </div>
          )}
          {place.website && (
            <div>
              <strong>Website:</strong>{" "}
              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#16a34a" }}
              >
                {place.website}
              </a>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            {place.location && (
              <a
                href={toDirections(place.location.lat, place.location.lon)} // encoded inside the URL builder only
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "8px 12px",
                  background: "#0b6",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 8,
                }}
              >
                Directions
              </a>
            )}
          </div>

          {/* simple opening hours line for today */}
          {place.opening && (
            <div style={{ marginTop: 4, color: sub, fontSize: 12 }}>
              Today:{" "}
              {renderTodayHours(place.opening)}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function renderTodayHours(opening: Place["opening"]) {
  const dow = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][
    new Date().getDay()
  ] as keyof Place["opening"];
  const slots = opening[dow] || [];
  if (!slots.length) return "Closed";
  return slots.map((w) => `${w.open}–${w.close}`).join(", ");
}