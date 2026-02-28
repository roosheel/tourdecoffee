import { Heart } from 'lucide-react';
import tdcDecoration from '../assets/tdc-decoration.png';
import tdcTitle from '../assets/tdc-title.png';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "start",
          gap: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={tdcDecoration} alt="TDC" style={{ height: 40, opacity: 0.7 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Tour de Coffee</div>
              <div style={{ fontSize: 12, color: "#bbb" }}>New York City</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#bbb", lineHeight: 2, textAlign: "right" }}>
            Apple Store, 5th Ave · Mon / Wed / Fri · 6:30am
            <br />
            <a
              href="https://www.instagram.com/tourdecoffee_runclub/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Instagram
            </a>
            {" · "}
            <a
              href="https://www.strava.com/clubs/tourdecoffee"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Strava
            </a>
          </div>
        </div>

        <div style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: "1px solid #ece8e3",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <span style={{
            color: "#ddd",
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}>
            &copy; 2026 Tour de Coffee Run Club
            <Heart size={10} color="#E8913A" fill="#E8913A" />
          </span>
          <img src={tdcTitle} alt="" style={{ height: 16, opacity: 0.06 }} />
        </div>
      </div>
    </footer>
  );
}
