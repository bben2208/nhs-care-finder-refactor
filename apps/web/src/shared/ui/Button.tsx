import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from "react";

type Variant = "primary" | "secondary" | "danger";

const base: CSSProperties = {
  borderRadius: 8,
  padding: "8px 12px",
  border: "1px solid transparent",
  cursor: "pointer",
  fontSize: 14
};

const variants: Record<Variant, CSSProperties> = {
  primary: { background: "#0b6", color: "#fff", borderColor: "#0b6" },
  secondary: { background: "#f3f4f6", color: "#111827", borderColor: "#e5e7eb" },
  danger: { background: "#dc2626", color: "#fff", borderColor: "#dc2626" }
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
};

export default function Button({ children, variant = "primary", style, ...rest }: Props) {
  return (
    <button
      {...rest}
      style={{
        ...base,
        ...(variants[variant] || {}),
        ...(style || {})
      }}
    >
      {children}
    </button>
  );
}