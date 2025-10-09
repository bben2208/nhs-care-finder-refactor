import { jsx as _jsx } from "react/jsx-runtime";
const base = {
    borderRadius: 8,
    padding: "8px 12px",
    border: "1px solid transparent",
    cursor: "pointer",
    fontSize: 14
};
const variants = {
    primary: { background: "#0b6", color: "#fff", borderColor: "#0b6" },
    secondary: { background: "#f3f4f6", color: "#111827", borderColor: "#e5e7eb" },
    danger: { background: "#dc2626", color: "#fff", borderColor: "#dc2626" }
};
export default function Button({ children, variant = "primary", style, ...rest }) {
    return (_jsx("button", { ...rest, style: {
            ...base,
            ...(variants[variant] || {}),
            ...(style || {})
        }, children: children }));
}
