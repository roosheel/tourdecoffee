import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats } from '../data';

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="about" ref={ref}>
      <div className="container">
        <div className="about-grid">
          <motion.div
            style={{ flex: "1 1 340px" }}
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ fontSize: 40, fontWeight: 700, margin: "0 0 6px" }}>
              What's the deal?
            </h2>
            <p style={{ color: "#ccc", fontSize: 13, margin: "0 0 20px", letterSpacing: 1 }}>/ about us</p>
          </motion.div>

          <motion.div
            style={{ flex: "1 1 420px" }}
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="font-hand" style={{
              color: "#777",
              fontSize: 17,
              lineHeight: 1.9,
              margin: "0 0 16px",
            }}>
              Tour de Coffee started because we got tired of running in circles. So we started running to coffee shops instead. Every run starts at the Apple Store on 5th Ave and ends somewhere new.
            </p>
            <p className="font-hand" style={{
              color: "#777",
              fontSize: 17,
              lineHeight: 1.9,
              margin: "0 0 32px",
            }}>
              Nobody checks splits. It's 5 to 20 people who like starting the day moving and ending it caffeinated. If that's you, just show up. Seriously. We're nice.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  className="stat-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                >
                  <div className="font-cursive" style={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: "#E8913A",
                    lineHeight: 1.2,
                  }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize: 11, color: "#bbb", letterSpacing: 0.5, marginTop: 4 }}>
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
