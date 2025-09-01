import { Link } from "react-router-dom";

type Props = {
  dark: boolean;
  toggleDark: () => void;
  fg: string;
  border: string;
  bg: string;
  children: React.ReactNode;
};

export default function Layout({ dark, toggleDark, fg, border, bg, children }: Props) {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 16, fontFamily: "system-ui, sans-serif", background: bg, color: fg, minHeight: "100vh" }}>
      <nav style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700 }}>NHS Local Care Finder (demo)</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={toggleDark} style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${border}`, background: dark ? "#0f172a" : "#f3f4f6", color: fg }}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
         
          <Link to="/guidance" style={{ textDecoration: "none", color: fg }}>Guidance</Link>
        </div>
      </nav>
      {children}
    </div>
  );
}