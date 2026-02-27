import { useState } from 'react';
import { Star } from 'lucide-react';
import { coffeeLog } from '../data';
import tdcDecoration from '../assets/tdc-decoration.png';

const cursive = { fontFamily: '"Caveat", cursive' };
const handwritten = { fontFamily: '"Patrick Hand", cursive' };

export default function CoffeeLog() {
  const [expanded, setExpanded] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <section id="log" style={{ padding: "60px 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "end",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 32,
      }}>
        <div>
          <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 4px", ...cursive }}>Coffee Log</h2>
          <p style={{ color: "#ccc", fontSize: 13, margin: 0 }}>click any shop for the review</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={tdcDecoration} alt="" style={{ height: 22, opacity: 0.4 }} />
          <span style={{ color: "#ccc", fontSize: 12 }}>{coffeeLog.length} shops and counting</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {coffeeLog.map((shop, i) => (
          <div
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "16px 16px",
              background: expanded === i ? "#f3f1ed" : hovered === i ? "#faf8f5" : "transparent",
              borderRadius: 10,
              cursor: "pointer",
              transition: "background 0.15s",
              border: expanded === i ? "1px solid #e8e4df" : "1px solid transparent",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{shop.n}</span>
                {shop.h && <span style={{
                  fontSize: 11,
                  color: "#bbb",
                  background: "#f3f1ed",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}>
                  {shop.h}
                </span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ color: "#E8913A", fontSize: 13, fontWeight: 700 }}>{shop.d} mi</span>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star
                      key={j}
                      size={12}
                      fill={j < shop.s ? "#E8913A" : "transparent"}
                      color={j < shop.s ? "#E8913A" : "#e0dcd7"}
                    />
                  ))}
                </div>
                <span style={{ color: "#ddd", fontSize: 11, minWidth: 45, textAlign: "right" }}>{shop.dt}</span>
              </div>
            </div>
            {expanded === i && shop.t && (
              <p style={{ color: "#999", fontSize: 14, margin: "10px 0 2px 0", ...handwritten }}>
                &ldquo;{shop.t}&rdquo;
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
