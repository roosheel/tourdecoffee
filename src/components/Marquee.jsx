export default function Marquee({ children, speed = 30 }) {
  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-block", animation: `marquee ${speed}s linear infinite` }}>
        {children}
        {children}
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
