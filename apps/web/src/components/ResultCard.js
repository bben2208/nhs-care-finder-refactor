import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import MapMini from "./MapMini";
function renderToday(opening) {
    const now = new Date();
    const key = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][now.getDay()];
    const windows = opening[key];
    if (!windows || windows.length === 0)
        return "Closed";
    return windows.map(w => `${w.open}–${w.close}`).join(", ");
}
export default function ResultCard({ place: r, expanded, onToggle, isFav, toggleFav, toDirections, border, card, fg, sub, dark }) {
    const isOpen = r.status.open;
    const km = (r.distanceMeters / 1000).toFixed(1);
    return (_jsxs("li", { style: { border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden", background: card }, children: [_jsx("div", { role: "button", tabIndex: 0, onClick: onToggle, onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggle();
                } }, "aria-expanded": expanded, "aria-controls": `panel-${r.id}`, style: { cursor: "pointer", display: "block", width: "100%", padding: 12, background: "transparent", border: "none", textAlign: "left", color: fg }, children: _jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }, children: [_jsxs("div", { children: [_jsxs("div", { style: { fontWeight: 600 }, children: [_jsx("button", { onClick: (ev) => { ev.stopPropagation(); toggleFav(r.id); }, "aria-label": isFav(r.id) ? "Unfavourite" : "Favourite", style: { marginRight: 6, border: "none", background: "transparent", cursor: "pointer" }, children: isFav(r.id) ? "⭐" : "☆" }), ICON[r.type], " ", r.name] }), _jsxs("div", { style: { fontSize: 13, color: sub }, children: [r.type.toUpperCase(), " \u00B7 ", km, " km \u00B7 Today: ", renderToday(r.opening), " ", r.waitMinutes != null ? `· Est. wait: ${r.waitMinutes}m` : ""] })] }), _jsx("span", { style: { fontSize: 12, padding: "4px 8px", borderRadius: 999, marginRight: 20, background: isOpen ? "#14532d" : "#7f1d1d", border: `1px solid ${isOpen ? "#16a34a" : "#dc2626"}`, color: "#fff" }, children: isOpen ? `Open${r.status.closesInMins ? ` · closes in ${r.status.closesInMins}m` : ""}` : "Closed" })] }) }), expanded && (_jsxs("div", { id: `panel-${r.id}`, style: { padding: 12, borderTop: `1px solid ${border}`, background: dark ? "#0f172a" : "#fafafa", color: fg }, children: [_jsxs("div", { style: { display: "grid", gap: 6, marginBottom: 10 }, children: [r.address && _jsx("div", { children: r.address }), r.phone && _jsxs("a", { href: `tel:${r.phone}`, style: { color: "#0b6" }, children: ["Call: ", r.phone] }), r.website && (_jsx("a", { href: r.website, target: "_blank", rel: "noreferrer", style: { color: "#0b6" }, children: "Website" })), _jsx(Link, { to: `/place/${r.id}`, style: { color: "#0b6" }, children: "View details \u2192" })] }), _jsx("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: _jsx("a", { href: toDirections(r.location.lat, r.location.lon), target: "_blank", rel: "noreferrer", style: { padding: "8px 10px", background: "#0b6", color: "white", borderRadius: 8, textDecoration: "none" }, children: "Directions" }) }), _jsx("div", { style: { height: 180, borderRadius: 8, overflow: "hidden", border: `1px solid ${border}`, marginBottom: 10 }, children: _jsx(MapMini, { lat: r.location.lat, lon: r.location.lon, name: r.name }) }), _jsxs("div", { style: { fontSize: 13, color: sub }, children: [_jsx("strong", { style: { color: fg }, children: "Today:" }), " ", renderToday(r.opening)] })] }))] }));
}
const ICON = {
    gp: "🩺",
    "walk-in": "🚶",
    utc: "🏥",
    ae: "🚑"
};