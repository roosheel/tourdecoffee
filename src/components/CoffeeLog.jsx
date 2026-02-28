import { useState, useMemo, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, Search, Coffee } from 'lucide-react';
import { coffeeLog } from '../data';
import tdcDecoration from '../assets/tdc-decoration.png';

export default function CoffeeLog() {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const filtered = useMemo(() => {
    if (!search.trim()) return coffeeLog;
    const q = search.toLowerCase();
    return coffeeLog.filter(s =>
      s.n.toLowerCase().includes(q) ||
      (s.h && s.h.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <section id="log" className="coffee-log" ref={ref}>
      <div className="container">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 28,
        }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-cursive" style={{ fontSize: 40, fontWeight: 700, margin: "0 0 4px" }}>
              Coffee Log
            </h2>
            <p style={{ color: "#ccc", fontSize: 13, margin: 0 }}>click any shop for the review</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <img src={tdcDecoration} alt="" style={{ height: 22, opacity: 0.4 }} />
            <span style={{ color: "#ccc", fontSize: 12 }}>{coffeeLog.length} shops and counting</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.15 }}
          style={{ position: "relative", marginBottom: 20 }}
        >
          <Search
            size={16}
            color="#ccc"
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            className="log-search"
            placeholder="Search shops by name or neighborhood..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {filtered.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#ccc",
            }}>
              <Coffee size={32} color="#e0dcd7" style={{ marginBottom: 12 }} />
              <div className="font-hand" style={{ fontSize: 16 }}>
                No shops match "{search}"
              </div>
            </div>
          )}
          <AnimatePresence mode="popLayout">
            {filtered.map((shop, i) => (
              <motion.div
                key={shop.n + shop.dt}
                className={`log-entry ${expanded === i ? 'expanded' : ''}`}
                onClick={() => setExpanded(expanded === i ? null : i)}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#1a1a1a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {shop.n}
                    </span>
                    {shop.h && (
                      <span style={{
                        fontSize: 11,
                        color: "#bbb",
                        background: "#f3f1ed",
                        padding: "3px 10px",
                        borderRadius: 6,
                        flexShrink: 0,
                      }}>
                        {shop.h}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                    <span style={{
                      color: "#E8913A",
                      fontSize: 13,
                      fontWeight: 700,
                      background: "#fef8f0",
                      padding: "3px 10px",
                      borderRadius: 6,
                    }}>
                      {shop.d} mi
                    </span>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star
                          key={j}
                          size={12}
                          fill={j < shop.s ? "#E8913A" : "transparent"}
                          color={j < shop.s ? "#E8913A" : "#e0dcd7"}
                        />
                      ))}
                    </div>
                    <span style={{
                      color: "#ccc",
                      fontSize: 11,
                      minWidth: 48,
                      textAlign: "right",
                    }}>
                      {shop.dt}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === i && shop.t && (
                    <motion.p
                      className="font-hand"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        color: "#999",
                        fontSize: 15,
                        margin: "12px 0 4px 0",
                        overflow: "hidden",
                      }}
                    >
                      &ldquo;{shop.t}&rdquo;
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
