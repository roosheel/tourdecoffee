import tdcLogo from '../assets/tdc-logo.png';

const NAV_ITEMS = ["about", "schedule", "log", "journal", "instagram", "merch"];

export default function Navbar({ scrolled, onNav }) {
  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: scrolled ? "rgba(250,249,247,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      transition: "all 0.3s",
    }}>
      <div style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 60,
      }}>
        <img
          onClick={() => onNav("top")}
          src={tdcLogo}
          alt="TDC"
          style={{ height: 36, cursor: "pointer" }}
          className="hover-lift"
        />
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {NAV_ITEMS.map(item => (
            <span
              key={item}
              onClick={() => onNav(item)}
              className="hover-orange"
              style={{
                color: "#aaa",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 500,
                transition: "color 0.15s",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}
