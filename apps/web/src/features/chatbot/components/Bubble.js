import { jsx as _jsx } from "react/jsx-runtime";
export default function Bubble({ role, children, }) {
    const isUser = role === "user";
    return (_jsx("div", { style: { display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }, children: _jsx("div", { style: {
                background: isUser ? "#e5f6ff" : "#f3f4f6",
                color: "#111827",
                border: `1px solid ${isUser ? "#93c5fd" : "#e5e7eb"}`,
                borderRadius: 12,
                padding: "8px 10px",
                maxWidth: "80%",
                whiteSpace: "pre-wrap",
                lineHeight: 1.3,
            }, children: children }) }));
}
