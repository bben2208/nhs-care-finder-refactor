import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useDirectionsUrl } from "../hooks/useDirectionsUrl";
import { FitBounds } from "./FitBounds";
const TYPE_ICON = {
    gp: "🩺",
    "walk-in": "🚶",
    utc: "🏥",
    ae: "🚑"
};
export default function BigMap({ results }) {
    const { toDirections } = useDirectionsUrl();
    const center = results[0]
        ? [results[0].location.lat, results[0].location.lon]
        : [51.509, -0.118];
    const bounds = results.length
        ? results.map(r => [r.location.lat, r.location.lon])
        : undefined;
    return (_jsxs(MapContainer, { center: center, zoom: 12, style: { height: "100%", width: "100%" }, scrollWheelZoom: true, children: [_jsx(TileLayer, { attribution: '\u00A9 OpenStreetMap contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }), bounds && _jsx(FitBounds, { bounds: bounds }), results.map(r => (_jsx(Marker, { position: [r.location.lat, r.location.lon], children: _jsxs(Popup, { children: [_jsxs("div", { style: { fontWeight: 600 }, children: [TYPE_ICON[r.type], " ", r.name] }), _jsxs("div", { style: { fontSize: 12 }, children: [(r.distanceMeters / 1000).toFixed(1), " km", r.waitMinutes != null ? ` · wait ${r.waitMinutes}m` : ""] }), _jsx("a", { href: toDirections(r.location.lat, r.location.lon), target: "_blank", rel: "noreferrer", children: "Directions" })] }) }, r.id)))] }));
}
