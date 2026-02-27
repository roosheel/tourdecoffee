export default function Badge({ children, color = "#E8913A", bg = "#fef3e6", rotate = 0 }) {
  return (
    <span style={{
      display: "inline-block",
      background: bg,
      color: color,
      padding: "5px 14px",
      borderRadius: 20,
      fontSize: 14,
      fontWeight: 600,
      transform: `rotate(${rotate}deg)`,
      border: `1.5px solid ${color}`,
      fontFamily: '"Caveat", cursive',
    }}>
      {children}
    </span>
  );
}
