import { ArrowUpRight } from 'lucide-react';
import Badge from './Badge';
import Marquee from './Marquee';
import tdcTitle from '../assets/tdc-title.png';
import tdcDecoration from '../assets/tdc-decoration.png';
import { MARQUEE_TOP } from '../data';

const cursive = { fontFamily: '"Caveat", cursive' };
const handwritten = { fontFamily: '"Patrick Hand", cursive' };

export default function Hero({ onNav }) {
  return (
    <>
      <section id="top" style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        position: "relative",
      }}>
        <img
          src={tdcDecoration}
          alt=""
          style={{
            position: "absolute",
            right: "8%",
            top: "18%",
            height: 120,
            opacity: 0.09,
            animation: "float 4s ease-in-out infinite",
          }}
        />
        <div style={{ maxWidth: 1000, margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge color="#E8913A" bg="#fef3e6" rotate={-2}>NYC run club</Badge>
            <Badge color="#7BBAD4" bg="#eef7fb" rotate={1}>est. whenever</Badge>
          </div>
          <img
            src={tdcTitle}
            alt="Tour de Coffee"
            style={{ width: "min(420px, 80vw)", marginBottom: 24 }}
          />
          <p style={{
            color: "#999",
            fontSize: 17,
            lineHeight: 1.8,
            maxWidth: 420,
            margin: "0 0 36px",
            ...handwritten,
          }}>
            We meet at the Apple Store on 5th Ave at 6:30am and run to a different coffee shop every single time. That's the whole thing.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
            <a
              href="https://www.strava.com/clubs/tourdecoffee"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-lift"
              style={{
                background: "#E8913A",
                color: "#fff",
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                borderRadius: 24,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Join on Strava <ArrowUpRight size={14} />
            </a>
            <a
              href="https://www.instagram.com/tourdecoffee_runclub/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-lift"
              style={{
                color: "#aaa",
                padding: "12px 28px",
                fontSize: 14,
                textDecoration: "none",
                border: "1.5px solid #e0dcd7",
                borderRadius: 24,
              }}
            >
              @tourdecoffee_runclub
            </a>
          </div>
          <div
            onClick={() => onNav("about")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              opacity: 0.4,
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <span style={{ fontSize: 11, color: "#bbb", marginBottom: 4 }}>scroll</span>
            <span style={{ fontSize: 18, color: "#bbb" }}>↓</span>
          </div>
        </div>
      </section>
      <div style={{
        background: "#E8913A",
        padding: "10px 0",
        color: "#fff",
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: 1,
        fontFamily: '"Caveat", cursive',
      }}>
        <Marquee speed={25}>
          <span style={{ padding: "0 4px" }}>{MARQUEE_TOP}</span>
        </Marquee>
      </div>
    </>
  );
}
