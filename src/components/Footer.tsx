export default function Footer() {
  return (
    <footer style={{ width: "100%", borderTop: "1px solid rgba(0,0,0,0.12)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span style={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} Beacon-UI
          </span>
          <nav style={{ display: "flex", gap: 16 }}>
            <a href="/privacy" style={{ textDecoration: "none", opacity: 0.85 }}>
              Privacy
            </a>
            <a href="/terms" style={{ textDecoration: "none", opacity: 0.85 }}>
              Terms
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
