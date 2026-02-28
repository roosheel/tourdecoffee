import { motion } from 'framer-motion';

export default function Badge({ children, color = "#E8913A", bg = "#fef3e6", rotate = 0 }) {
  return (
    <motion.span
      className="badge"
      style={{
        background: bg,
        color: color,
        transform: `rotate(${rotate}deg)`,
        border: `1.5px solid ${color}`,
      }}
      whileHover={{ scale: 1.08, rotate: rotate + 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {children}
    </motion.span>
  );
}
