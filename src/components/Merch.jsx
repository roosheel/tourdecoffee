import { ArrowUpRight } from 'lucide-react';
import Badge from './Badge';
import tdcLogo from '../assets/tdc-logo.png';

const cursive = { fontFamily: '"Caveat", cursive' };
const handwritten = { fontFamily: '"Patrick Hand", cursive' };

export default function Merch() {
  return (
    <section id="merch" style={{
      background: "#1a1a1a",
      padding: "60px 24px",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        right: -20,
        top: -10,
        opacity: 0.06,
        fontSize: 200,
        fontWeight: 900,
        letterSpacing: -8,
        color: "#E8913A",
        lineHeight: 1,
      }}>
        TDC
      </div>
      <div style={{
        maxWidth: 1000,
        margin: "0 auto",
        position: "relative",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 40,
      }}>
        <div style={{ flex: "1 1 300px" }}>
          <Badge color="#E8913A" bg="rgba(232,145,58,0.15)" rotate={-1}>coming soon</Badge>
          <h2 style={{ fontSize: 40, fontWeight: 700, margin: "16px 0 12px", ...cursive }}>
            Merch incoming.
          </h2>
          <p style={{ color: "#888", fontSize: 15, maxWidth: 380, lineHeight: 1.7, ...handwritten }}>
            Tees, hats, probably a tote bag because this is still New York. Follow us on Instagram to know when it drops.
          </p>
          <a
            href="https://www.instagram.com/tourdecoffee_runclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover-lift"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#E8913A",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              marginTop: 12,
            }}
          >
            Get notified <ArrowUpRight size={14} />
          </a>
        </div>
        <div style={{ flex: "0 1 200px", textAlign: "center" }}>
          <img
            src={tdcLogo}
            alt="TDC Cup"
            style={{ height: 140, opacity: 0.25, animation: "float 5s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
