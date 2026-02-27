import { MapPin } from 'lucide-react';
import Badge from './Badge';
import { schedule } from '../data';

const cursive = { fontFamily: '"Caveat", cursive' };

export default function Schedule() {
  return (
    <section id="schedule" style={{
      background: "#f3f1ed",
      padding: "60px 24px",
      borderTop: "1px solid #e8e4df",
      borderBottom: "1px solid #e8e4df",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 32,
        }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, margin: 0, ...cursive }}>When to show up</h2>
          <Badge color="#7BBAD4" bg="#eef7fb">all paces welcome</Badge>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}>
          {schedule.map((s, i) => (
            <div
              key={i}
              className="hover-lift"
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 24,
                border: s.type === "theme" ? "2px solid #7BBAD4" : "1px solid #e8e4df",
                cursor: "default",
              }}
            >
              <div style={{
                fontSize: 38,
                fontWeight: 700,
                color: s.type === "theme" ? "#7BBAD4" : "#E8913A",
                ...cursive,
                letterSpacing: -1,
                marginBottom: 8,
              }}>
                {s.day}
              </div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 4 }}>{s.full}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{s.time}</div>
              {s.type === "theme" && (
                <div style={{ marginTop: 8 }}>
                  <Badge color="#7BBAD4" bg="#eef7fb" rotate={0}>theme run!</Badge>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 24,
          background: "#fff",
          borderRadius: 12,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          border: "1px solid #e8e4df",
        }}>
          <MapPin size={16} color="#E8913A" />
          <div>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Apple Store, 5th Ave</span>
            <span style={{ color: "#bbb", fontSize: 13, marginLeft: 8 }}>yes, the glass cube</span>
          </div>
        </div>
      </div>
    </section>
  );
}
