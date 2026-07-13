import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import Badge from './Badge';
import { schedule } from '../data';

export default function Schedule() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="schedule" className="schedule-section" ref={ref}>
      <div className="container">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 36,
          flexWrap: "wrap",
          gap: 12,
        }}>
          <motion.h2
            style={{ fontSize: 40, fontWeight: 700, margin: 0 }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            When to show up
          </motion.h2>
          <Badge color="#7BBAD4" bg="#eef7fb">all paces welcome</Badge>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            marginBottom: 24,
            background: "#fff",
            borderRadius: 14,
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            border: "1px solid #e8e4df",
            boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "#fef3e6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <MapPin size={18} color="#E8913A" />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Apple Store, 5th Ave</span>
            <span style={{ color: "#bbb", fontSize: 13, marginLeft: 10 }}>yes, the glass cube</span>
          </div>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}>
          {schedule.map((s, i) => (
            <motion.div
              key={i}
              className={`schedule-card ${s.type === 'theme' ? 'theme' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
            >
              <div className="font-cursive" style={{
                fontSize: 42,
                fontWeight: 700,
                color: s.type === "theme" ? "#7BBAD4" : "#E8913A",
                letterSpacing: -1,
                marginBottom: 10,
                lineHeight: 1,
              }}>
                {s.day}
              </div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 6 }}>{s.full}</div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 15,
                fontWeight: 700,
                color: "#1a1a1a",
              }}>
                <Clock size={13} color="#bbb" />
                {s.time}
              </div>
              {s.type === "theme" && (
                <div style={{ marginTop: 12 }}>
                  <Badge color="#7BBAD4" bg="#eef7fb" rotate={0}>theme run!</Badge>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
