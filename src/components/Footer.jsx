import tdcDecoration from '../assets/tdc-decoration.png';
import tdcTitle from '../assets/tdc-title.png';

export default function Footer() {
  return (
    <footer style={{ padding: "40px 24px 28px", borderTop: "1px solid #e8e4df" }}>
      <div style={{
        maxWidth: 1000,
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "start",
        gap: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={tdcDecoration} alt="TDC" style={{ height: 36, opacity: 0.7 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Tour de Coffee</div>
            <div style={{ fontSize: 11, color: "#bbb" }}>New York City</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.8, textAlign: "right" }}>
          Apple Store, 5th Ave · Mon / Wed / Fri · 6:30am
          <br />
          <a
            href="https://www.instagram.com/tourdecoffee_runclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover-orange"
            style={{ color: "#aaa", textDecoration: "none", transition: "color 0.15s" }}
          >
            Instagram
          </a>
          {" · "}
          <a
            href="https://www.strava.com/clubs/tourdecoffee"
            target="_blank"
            rel="noopener noreferrer"
            className="hover-orange"
            style={{ color: "#aaa", textDecoration: "none", transition: "color 0.15s" }}
          >
            Strava
          </a>
        </div>
      </div>
      <div style={{
        maxWidth: 1000,
        margin: "20px auto 0",
        paddingTop: 16,
        borderTop: "1px solid #ece8e3",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ color: "#ddd", fontSize: 11 }}>&copy; 2026 Tour de Coffee Run Club</span>
        <img src={tdcTitle} alt="" style={{ height: 16, opacity: 0.07 }} />
      </div>
    </footer>
  );
}
