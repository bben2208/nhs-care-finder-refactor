import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Opening = {
  day: string;
  opens: string | null;
  closes: string | null;
};

type Place = {
  id: string;
  name: string;
  type: string;
  address: string;
  phone?: string;
  website?: string;
  location?: {
    lat: number;
    lng: number;
  };
  features?: string[];
  openingHours?: Opening[];
};

export default function PlacePage() {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`/api/places/${id}`)
      .then((res) => {
        setPlace(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.error ||
            err.message ||
            "An error occurred fetching place details."
        );
        setLoading(false);
      });
  }, [id]);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ marginBottom: 12 }}>
        <Link to="/" style={{ textDecoration: "none" }}>← Back</Link>
      </div>
      {loading && <p>Loading...</p>}
      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      {!loading && !error && place && (
        <>
          <h1 style={{ marginBottom: 0 }}>{place.name}</h1>
          <div style={{ color: "#666", marginBottom: 12 }}>{place.type}</div>
          <div style={{ marginBottom: 10 }}>
            <div>
              <strong>Address:</strong>
              <div style={{ marginLeft: 8, display: "inline" }}>{place.address}</div>
            </div>
            {place.phone && (
              <div>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${place.phone}`} style={{ color: "#0066cc" }}>
                  {place.phone}
                </a>
              </div>
            )}
            {place.website && (
              <div>
                <strong>Website:</strong>{" "}
                <a href={place.website} target="_blank" rel="noopener noreferrer" style={{ color: "#0066cc" }}>
                  {place.website}
                </a>
              </div>
            )}
            {place.location && (
              <div>
                <strong>Map:</strong>{" "}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.location.lat},${place.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0066cc" }}
                >
                  View on Google Maps
                </a>
              </div>
            )}
          </div>
          {place.features && place.features.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <strong>Features:</strong>
              <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {place.features.map((feature) => (
                  <span
                    key={feature}
                    style={{
                      background: "#e7f1ff",
                      color: "#2456a8",
                      borderRadius: 12,
                      padding: "4px 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: 0.2,
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          {place.openingHours && place.openingHours.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <strong>Opening Hours:</strong>
              <table style={{ width: "100%", marginTop: 6, borderCollapse: "collapse" }}>
                <tbody>
                  {place.openingHours.map((o) => (
                    <tr key={o.day}>
                      <td style={{ padding: "4px 8px", fontWeight: 500 }}>{o.day}</td>
                      <td style={{ padding: "4px 8px" }}>
                        {o.opens && o.closes
                          ? `${o.opens} – ${o.closes}`
                          : "Closed"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ marginTop: 32, color: "#888", fontSize: 13 }}>
            Information provided as a guide only. Please check with the place for latest details.
          </div>
        </>
      )}
    </div>
  );
}