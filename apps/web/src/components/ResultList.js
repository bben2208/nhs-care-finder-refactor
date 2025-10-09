import { jsx as _jsx } from "react/jsx-runtime";
import ResultCard from "./ResultCard";
export default function ResultList({ results, loading, error, expandedId, setExpandedId, isFav, toggleFav, toDirections, border, card, fg, sub, dark }) {
    if (error) {
        return _jsx("p", { role: "alert", "aria-live": "polite", style: { color: "crimson", marginTop: 8 }, children: error });
    }
    if (loading && results.length === 0) {
        return (_jsx("ul", { style: { listStyle: "none", padding: 0, marginTop: 16, display: "grid", gap: 8 }, children: Array.from({ length: 3 }).map((_, i) => (_jsx("li", { style: { height: 84, borderRadius: 12, background: card, border: `1px solid ${border}`, opacity: 0.6 } }, i))) }));
    }
    return (_jsx("ul", { "aria-busy": loading, style: { listStyle: "none", padding: 0, marginTop: 16, display: "grid", gap: 8 }, children: results.map((r) => (_jsx(ResultCard, { place: r, expanded: expandedId === r.id, onToggle: () => setExpandedId(prev => prev === r.id ? null : r.id), isFav: isFav, toggleFav: toggleFav, toDirections: toDirections, border: border, card: card, fg: fg, sub: sub, dark: dark }, r.id))) }));
}
