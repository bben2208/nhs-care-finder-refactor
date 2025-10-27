//Footer.tsx
export default function Footer({
    reset,
    hasOutcome,
  }: {
    reset: () => void;
    hasOutcome: boolean;
  }) {
    return (
      <div style={{ padding: 8, display: "flex", gap: 8 }}>
        <button
          onClick={reset}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
        {hasOutcome && (
          <a
            href="https://111.nhs.uk/"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background: "#0b6",
              color: "#fff",
              textDecoration: "none",
              border: "1px solid #0b6",
            }}
          >
            NHS 111
          </a>
        )}
      </div>
    );
  }