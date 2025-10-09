import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Tabs({ value, onChange, border, card, fg }) {
    return (_jsxs("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [_jsx("button", { onClick: () => onChange("list"), style: { padding: "8px 12px", borderRadius: 8, border: `1px solid ${border}`, background: value === "list" ? "#0b6" : card, color: value === "list" ? "white" : fg }, children: "List" }), _jsx("button", { onClick: () => onChange("map"), style: { padding: "8px 12px", borderRadius: 8, border: `1px solid ${border}`, background: value === "map" ? "#0b6" : card, color: value === "map" ? "white" : fg }, children: "Map" })] }));
}
