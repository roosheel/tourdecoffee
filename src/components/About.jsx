import { stats } from '../data';

const cursive = { fontFamily: '"Caveat", cursive' };
const handwritten = { fontFamily: '"Patrick Hand", cursive' };

export default function About() {
  return (
    <section id="about" style={{ padding: "80px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "start" }}>
        <div style={{ flex: "1 1 340px" }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 4px", ...cursive }}>
            What's the deal?
          </h2>
          <p style={{ color: "#ccc", fontSize: 13, margin: "0 0 20px" }}>/ about us</p>
        </div>
        <div style={{ flex: "1 1 420px" }}>
          <p style={{ color: "#777", fontSize: 16, lineHeight: 1.9, margin: "0 0 16px", ...handwritten }}>
            Tour de Coffee started because we got tired of running in circles. So we started running to coffee shops instead. Every run starts at the Apple Store on 5th Ave and ends somewhere new.
          </p>
          <p style={{ color: "#777", fontSize: 16, lineHeight: 1.9, margin: "0 0 24px", ...handwritten }}>
            Nobody checks splits. It's 5 to 20 people who like starting the day moving and ending it caffeinated. If that's you, just show up. Seriously. We're nice.
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#E8913A", ...cursive }}>{s.num}</div>
                <div style={{ fontSize: 11, color: "#bbb", letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
