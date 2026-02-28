import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Instagram as InstagramIcon, ArrowUpRight } from 'lucide-react';

export default function Instagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!document.querySelector('script[src*="elfsight"]')) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section id="instagram" className="instagram-section" ref={ref}>
      <div className="container">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 14,
        }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #fef3e6, #fce7d0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <InstagramIcon size={20} color="#E8913A" />
            </div>
            <h2 className="font-cursive" style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>
              @tourdecoffee_runclub
            </h2>
          </motion.div>
          <motion.a
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            href="https://www.instagram.com/tourdecoffee_runclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: "10px 20px", fontSize: 13 }}
          >
            follow us <ArrowUpRight size={13} />
          </motion.a>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="elfsight-app-f17fe89a-6f10-4822-b8f9-ea5747bb42f3" data-elfsight-app-lazy></div>
        </motion.div>
      </div>
    </section>
  );
}
