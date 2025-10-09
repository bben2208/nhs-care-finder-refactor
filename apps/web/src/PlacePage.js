import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
//PlacePage.tsx
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGetWithFallback } from "./lib/api";
const dayOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const dayLabel = {
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};
export default function PlacePage() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!id)
            return;
        setLoading(true);
        setError(null);
        (async () => {
            try {
                const { data } = await apiGetWithFallback(`/places/${id}`);
                setPlace(data);
            }
            catch (err) {
                setError(err?.response?.data?.error ||
                    err?.message ||
                    "An error occurred fetching place details.");
            }
            finally {
                setLoading(false);
            }
        })();
    }, [id]);
    return (_jsxs("div", { style: { padding: 16, fontFamily: "system-ui, sans-serif", maxWidth: 600, margin: "0 auto" }, children: [_jsx("div", { style: { marginBottom: 12 }, children: _jsx(Link, { to: "/", style: { textDecoration: "none" }, children: "\u2190 Back" }) }), loading && _jsx("p", { children: "Loading..." }), error && (_jsxs("div", { style: { color: "red", marginBottom: 16 }, children: [_jsx("strong", { children: "Error:" }), " ", error] })), !loading && !error && place && (_jsxs(_Fragment, { children: [_jsx("h1", { style: { marginBottom: 0 }, children: place.name }), _jsx("div", { style: { color: "#666", marginBottom: 12 }, children: place.type.toUpperCase() }), _jsxs("div", { style: { marginBottom: 10 }, children: [place.address && (_jsxs("div", { children: [_jsx("strong", { children: "Address:" }), " ", _jsx("span", { style: { marginLeft: 8 }, children: place.address })] })), place.phone && (_jsxs("div", { children: [_jsx("strong", { children: "Phone:" }), " ", _jsx("a", { href: `tel:${place.phone}`, style: { color: "#0066cc" }, children: place.phone })] })), place.website && (_jsxs("div", { children: [_jsx("strong", { children: "Website:" }), " ", _jsx("a", { href: place.website, target: "_blank", rel: "noopener noreferrer", style: { color: "#0066cc" }, children: place.website })] })), place.location && (_jsxs("div", { children: [_jsx("strong", { children: "Map:" }), " ", _jsx("a", { href: `https://www.google.com/maps/search/?api=1&query=${place.location.lat},${place.location.lon}`, target: "_blank", rel: "noopener noreferrer", style: { color: "#0066cc" }, children: "View on Google Maps" })] }))] }), place.features && (_jsxs("div", { style: { marginBottom: 18 }, children: [_jsx("strong", { children: "Features:" }), _jsxs("div", { style: { marginTop: 6, display: "flex", flexWrap: "wrap", gap: 8 }, children: ["wheelchair" in place.features && (_jsx(Badge, { label: "Wheelchair", on: !!place.features.wheelchair })), "parking" in place.features && (_jsx(Badge, { label: "Parking", on: !!place.features.parking })), "xray" in place.features && (_jsx(Badge, { label: "X-ray", on: !!place.features.xray }))] })] })), _jsxs("div", { style: { marginBottom: 16 }, children: [_jsx("strong", { children: "Opening Hours:" }), _jsx("table", { style: { width: "100%", marginTop: 6, borderCollapse: "collapse" }, children: _jsx("tbody", { children: dayOrder.map((d) => (_jsxs("tr", { children: [_jsx("td", { style: { padding: "4px 8px", fontWeight: 500, width: 70 }, children: dayLabel[d] }), _jsx("td", { style: { padding: "4px 8px" }, children: place.opening[d].length === 0
                                                    ? "Closed"
                                                    : place.opening[d].map((w, i) => (_jsxs("span", { style: { marginRight: 8 }, children: [w.open, " \u2013 ", w.close] }, `${d}-${i}`))) })] }, d))) }) })] }), _jsx("div", { style: { marginTop: 32, color: "#888", fontSize: 13 }, children: "Information provided as a guide only. Please check with the place for latest details." })] }))] }));
}
function Badge({ label, on }) {
    return (_jsxs("span", { style: {
            background: on ? "#e6ffed" : "#f1f5f9",
            color: on ? "#166534" : "#475569",
            border: `1px solid ${on ? "#16a34a" : "#cbd5e1"}`,
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 12,
        }, children: [label, on ? "" : " (n/a)"] }));
}
