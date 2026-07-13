import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Badge from './Badge';
import tdcLogo from '../assets/tdc-logo.png';

export default function Merch() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="merch" className="merch-section" ref={ref}>
      <div className="merch-bg-text">TDC</div>
      <div className="container" style={{ position: "relative" }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 48,
        }}>
          <motion.div
            style={{ flex: "1 1 320px" }}
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Badge color="#E8913A" bg="rgba(232,145,58,0.15)" rotate={-1}>coming soon</Badge>
            <h2 style={{
              fontSize: 44,
              fontWeight: 700,
              margin: "20px 0 14px",
              lineHeight: 1.1,
            }}>
              Merch incoming.
            </h2>
            <p className="font-hand" style={{
              color: "#888",
              fontSize: 16,
              maxWidth: 380,
              lineHeight: 1.7,
            }}>
              Tees, hats, probably a tote bag because this is still New York. Follow us on Instagram to know when it drops.
            </p>
            <motion.a
              href="https://www.instagram.com/tourdecoffee_runclub/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "#E8913A",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                marginTop: 20,
                padding: "10px 0",
                borderBottom: "2px solid transparent",
                transition: "border-color 0.2s ease",
              }}
              whileHover={{ x: 4 }}
            >
              Get notified <ArrowUpRight size={15} />
            </motion.a>
          </motion.div>
          <motion.div
            style={{ flex: "0 1 220px", textAlign: "center" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src={tdcLogo}
              alt="TDC Cup"
              style={{
                height: 160,
                opacity: 0.2,
                animation: "float 5s ease-in-out infinite",
                filter: "drop-shadow(0 8px 24px rgba(232,145,58,0.15))",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
