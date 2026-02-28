export default function Marquee({ children, speed = 25, direction = "left" }) {
  const animDir = direction === "right" ? "marqueeReverse" : "marquee";
  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
      <div style={{
        display: "inline-block",
        animation: `${animDir} ${speed}s linear infinite`,
      }}>
        {children}
        {children}
        {children}
      </div>
      <style>{`
        @keyframes marqueeReverse {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
