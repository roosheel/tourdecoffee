import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Home } from 'lucide-react';
import Badge from './Badge';
import Marquee from './Marquee';
import tdcTitle from '../assets/tdc-title.png';
import tdcDecoration from '../assets/tdc-decoration.png';
import { MARQUEE_TOP } from '../data';

export default function Hero({ onNav }) {
  return (
    <>
      <section id="top" className="hero">
        <div className="hero-bg-circle" />
        <div className="hero-bg-circle-2" />

        <img
          src={tdcDecoration}
          alt=""
          style={{
            position: "absolute",
            right: "8%",
            top: "15%",
            height: 140,
            opacity: 0.07,
            animation: "float 4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <img
          src={tdcDecoration}
          alt=""
          style={{
            position: "absolute",
            left: "5%",
            bottom: "20%",
            height: 80,
            opacity: 0.04,
            animation: "float 6s ease-in-out infinite 1s",
            pointerEvents: "none",
            transform: "rotate(20deg)",
          }}
        />

        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}
          >
            <Badge color="#E8913A" bg="#fef3e6" rotate={-2}>NYC run club</Badge>
            <Badge color="#7BBAD4" bg="#eef7fb" rotate={1}>est. whenever</Badge>
          </motion.div>

          <motion.img
            src={tdcTitle}
            alt="Tour de Coffee"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ width: "min(460px, 85vw)", marginBottom: 28 }}
          />

          <motion.p
            className="font-hand"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{
              color: "#999",
              fontSize: 18,
              lineHeight: 1.8,
              maxWidth: 440,
              margin: "0 0 40px",
            }}
          >
            We meet at the{" "}
            <span style={{ fontWeight: 600 }}>
              <Home size={16} style={{ display: "inline", verticalAlign: "middle", marginBottom: 2 }} />
              {" "}Apple Store
            </span>
            {" "}on 5th Ave at 6:30am and run to a different coffee shop every single time. That's the whole thing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 56 }}
          >
            <a
              href="https://www.strava.com/clubs/tourdecoffee"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Join on Strava <ArrowUpRight size={15} />
            </a>
            <a
              href="https://www.instagram.com/tourdecoffee_runclub/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              @tourdecoffee_runclub
            </a>
          </motion.div>

          <motion.div
            onClick={() => onNav("about")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              animation: "pulse 2.5s ease-in-out infinite",
            }}
          >
            <span style={{ fontSize: 11, color: "#bbb", marginBottom: 4, letterSpacing: 1 }}>scroll</span>
            <ChevronDown size={18} color="#bbb" />
          </motion.div>
        </div>
      </section>

      <div className="marquee-wrap orange">
        <Marquee speed={22}>
          <span style={{ padding: "0 6px" }}>{MARQUEE_TOP}</span>
        </Marquee>
      </div>
    </>
  );
}
